import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Paperclip, Image, FileText, Smile, Video, Phone, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  attachment_url?: string;
  attachment_type?: 'image' | 'file' | 'document';
  attachment_name?: string;
  created_at: string;
  read: boolean;
  sender?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

interface Chat {
  id: string;
  job_id: string;
  client_id: string;
  freelancer_id: string;
  created_at: string;
  updated_at: string;
  job?: {
    title: string;
    budget: number;
  };
  client?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
  freelancer?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  };
}

interface ChatSystemProps {
  jobId?: string;
  bidId?: string;
  receiverId?: string;
  onClose?: () => void;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ jobId, bidId, receiverId, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Initialize chat and user data
  useEffect(() => {
    initializeChat();
  }, [jobId, bidId, receiverId]);

  // Setup real-time subscriptions
  useEffect(() => {
    if (!currentChat?.id) return;

    const messageChannel = supabase
      .channel(`chat_${currentChat.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${currentChat.id}`
      }, (payload) => {
        const newMessage = payload.new as Message;
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
        
        // Mark as read if we're the recipient
        if (newMessage.sender_id !== currentUser?.id) {
          markMessageAsRead(newMessage.id);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${currentChat.id}`
      }, (payload) => {
        const updatedMessage = payload.new as Message;
        setMessages(prev => 
          prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
        );
      })
      .subscribe();

    // Typing indicators
    const typingChannel = supabase
      .channel(`typing_${currentChat.id}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload.userId !== currentUser?.id) {
          setTypingUsers(prev => [...prev.filter(id => id !== payload.payload.userId), payload.payload.userId]);
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(id => id !== payload.payload.userId));
          }, 3000);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [currentChat?.id, currentUser?.id]);

  const initializeChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to access chat.',
          variant: 'destructive',
        });
        return;
      }

      setCurrentUser(user);

      // Find or create chat
      let chat: Chat | null = null;
      
      if (jobId && receiverId) {
        // Find existing chat
        const { data: existingChat } = await supabase
          .from('chats')
          .select(`
            *,
            job:jobs(title, budget),
            client:profiles!chats_client_id_fkey(first_name, last_name, avatar_url),
            freelancer:profiles!chats_freelancer_id_fkey(first_name, last_name, avatar_url)
          `)
          .eq('job_id', jobId)
          .or(`and(client_id.eq.${user.id},freelancer_id.eq.${receiverId}),and(client_id.eq.${receiverId},freelancer_id.eq.${user.id})`)
          .single();

        if (existingChat) {
          chat = existingChat as Chat;
        } else {
          // Create new chat
          const { data: newChat } = await supabase
            .from('chats')
            .insert([{
              job_id: jobId,
              client_id: user.id,
              freelancer_id: receiverId
            }])
            .select(`
              *,
              job:jobs(title, budget),
              client:profiles!chats_client_id_fkey(first_name, last_name, avatar_url),
              freelancer:profiles!chats_freelancer_id_fkey(first_name, last_name, avatar_url)
            `)
            .single();

          chat = newChat as Chat;
        }
      }

      if (chat) {
        setCurrentChat(chat);
        await loadMessages(chat.id);
      }

    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize chat.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(first_name, last_name, avatar_url)
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (messagesData) {
        setMessages(messagesData as Message[]);
        scrollToBottom();
        
        // Mark unread messages as read
        const unreadMessages = messagesData.filter(
          msg => msg.sender_id !== currentUser?.id && !msg.read
        );
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
        }
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleTyping = useCallback(() => {
    if (!currentChat?.id || !currentUser?.id) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Broadcast typing indicator
    supabase
      .channel(`typing_${currentChat.id}`)
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: currentUser.id }
      });

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  }, [currentChat?.id, currentUser?.id]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachedFile) return;
    if (!currentChat || !currentUser) return;

    setSending(true);
    try {
      let attachmentUrl: string | null = null;
      let attachmentType: 'image' | 'file' | 'document' | undefined;
      let attachmentName: string | undefined;

      if (attachedFile) {
        const fileExtension = attachedFile.name.split('.').pop()?.toLowerCase();
        const filePath = `${currentChat.id}/${currentUser.id}/${Date.now()}.${fileExtension}`;
        
        // Determine attachment type
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '')) {
          attachmentType = 'image';
        } else if (['pdf', 'doc', 'docx', 'txt'].includes(fileExtension || '')) {
          attachmentType = 'document';
        } else {
          attachmentType = 'file';
        }
        
        attachmentName = attachedFile.name;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('chat-attachments')
          .upload(filePath, attachedFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`File upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('chat-attachments')
          .getPublicUrl(filePath);

        if (publicUrlData) {
          attachmentUrl = publicUrlData.publicUrl;
        }
      }

      const { data: message, error } = await supabase
        .from('messages')
        .insert([{
          chat_id: currentChat.id,
          sender_id: currentUser.id,
          content: newMessage.trim(),
          attachment_url: attachmentUrl,
          attachment_type: attachmentType,
          attachment_name: attachmentName,
          read: false
        }])
        .select(`
          *,
          sender:profiles(first_name, last_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      setNewMessage('');
      setAttachedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Send notification to other user
      const otherUserId = currentUser.id === currentChat.client_id 
        ? currentChat.freelancer_id 
        : currentChat.client_id;

      await supabase
        .from('notifications')
        .insert([{
          user_id: otherUserId,
          type: 'new_message',
          message: `New message in chat`,
          chat_id: currentChat.id,
          read: false
        }]);

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: 'File Too Large',
          description: 'Please select a file smaller than 10MB.',
          variant: 'destructive',
        });
        return;
      }
      setAttachedFile(file);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getOtherUser = () => {
    if (!currentChat || !currentUser) return null;
    return currentUser.id === currentChat.client_id 
      ? currentChat.freelancer 
      : currentChat.client;
  };

  const renderAttachment = (message: Message) => {
    if (!message.attachment_url) return null;

    if (message.attachment_type === 'image') {
      return (
        <div className="mt-2">
          <img 
            src={message.attachment_url} 
            alt="Attachment"
            className="max-w-xs rounded-lg cursor-pointer hover:opacity-80"
            onClick={() => window.open(message.attachment_url, '_blank')}
          />
        </div>
      );
    }

    return (
      <div className="mt-2">
        <a 
          href={message.attachment_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FileText className="h-4 w-4" />
          <span className="text-sm">{message.attachment_name}</span>
        </a>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <p>No chat available</p>
      </div>
    );
  }

  const otherUser = getOtherUser();

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden h-full max-h-screen">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherUser?.avatar_url} />
              <AvatarFallback>
                {otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">
                {otherUser?.first_name} {otherUser?.last_name}
              </h3>
              <p className="text-sm opacity-90">
                {currentChat.job?.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="flex gap-2 max-w-xs lg:max-w-md">
                {message.sender_id !== currentUser?.id && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.sender?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {message.sender?.first_name?.[0]}{message.sender?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.sender_id === currentUser?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {renderAttachment(message)}
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs ${
                      message.sender_id === currentUser?.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {new Date(message.created_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {message.sender_id === currentUser?.id && (
                      <span className={`text-xs ${
                        message.read ? 'text-blue-100' : 'text-blue-200'
                      }`}>
                        {message.read ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {attachedFile && (
          <div className="mb-3 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700 truncate">{attachedFile.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAttachedFile(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ×
            </Button>
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              placeholder="Type a message..."
              className="min-h-[60px] max-h-[160px] resize-none pr-12"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={sending}
            />
            <div className="absolute bottom-2 right-2 flex items-center space-x-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileAttach}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-gray-600"
                disabled={sending}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-gray-600"
                disabled={sending}
              >
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={sending || (!newMessage.trim() && !attachedFile)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem; 