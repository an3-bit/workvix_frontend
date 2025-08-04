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
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(true); // for mobile
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  // Fetch user and chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setCurrentUser(user);
        // Fetch all chats for this user (as client or freelancer)
        const { data: chatList } = await supabase
          .from('chats')
          .select(`*, job:jobs(title, budget), client:profiles!chats_client_id_fkey(first_name, last_name, avatar_url), freelancer:profiles!chats_freelancer_id_fkey(first_name, last_name, avatar_url)`)
          .or(`client_id.eq.${user.id},freelancer_id.eq.${user.id}`)
          .order('updated_at', { ascending: false });
        setChats(chatList || []);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  // Fetch messages when selectedChat changes
  useEffect(() => {
    if (!selectedChat) return;
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data: messagesData } = await supabase
          .from('messages')
          .select(`*, sender:profiles(first_name, last_name, avatar_url)`)
          .eq('chat_id', selectedChat.id)
          .order('created_at', { ascending: true });
        setMessages(messagesData || []);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  // Sidebar: list of chats with last message preview and unread badge
  const renderSidebar = () => (
    <div className="w-full sm:w-1/3 max-w-full border-r border-gray-200 bg-white flex-shrink-0">
      <div className="flex flex-row overflow-x-auto whitespace-nowrap border-b border-gray-100 bg-gray-50 gap-2 px-2 py-2">
        <button className="min-w-0 px-4 py-2 text-sm font-medium truncate bg-transparent border-none focus:outline-none">Messages</button>
        <button className="min-w-0 px-4 py-2 text-sm font-medium truncate bg-transparent border-none focus:outline-none">Client</button>
        {/* Add more tabs as needed */}
      </div>
      <div className="overflow-y-auto h-[40vh] sm:h-full p-2 sm:p-4">
        {chats.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No conversations yet.</div>
        ) : (
          chats.map(chat => {
            const otherUser = currentUser?.id === chat.client_id ? chat.freelancer : chat.client;
            // Find last message and unread count
            const chatMessages = messages.filter(m => m.chat_id === chat.id);
            const lastMsg = chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null;
            const unreadCount = chatMessages.filter(m => !m.read && m.sender_id !== currentUser?.id).length;
            return (
              <div
                key={chat.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-blue-50 ${selectedChat?.id === chat.id ? 'bg-blue-100' : ''}`}
                onClick={() => { setSelectedChat(chat); setShowSidebar(false); }}
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={otherUser?.avatar_url} />
                  <AvatarFallback>{otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="font-medium truncate w-full">{otherUser?.first_name} {otherUser?.last_name}</div>
                  <div className="text-xs text-gray-500 truncate w-full">{chat.job?.title}</div>
                  {lastMsg && <div className="text-xs text-gray-400 truncate w-full break-words">{lastMsg.content}</div>}
                </div>
                {unreadCount > 0 && <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">{unreadCount}</span>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // Main chat area
  const renderChatArea = () => {
    if (!selectedChat) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <span>Select a conversation to start chatting</span>
        </div>
      );
    }
    const otherUser = currentUser?.id === selectedChat.client_id ? selectedChat.freelancer : selectedChat.client;
    return (
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden h-full max-h-screen w-full">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile back button */}
            <button className="sm:hidden mr-2 flex-shrink-0" onClick={() => setShowSidebar(true)}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={otherUser?.avatar_url} />
              <AvatarFallback>{otherUser?.first_name?.[0]}{otherUser?.last_name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 overflow-hidden">
              <h3 className="font-medium truncate w-full">{otherUser?.first_name} {otherUser?.last_name}</h3>
              <p className="text-sm opacity-90 truncate w-full">{selectedChat.job?.title}</p>
            </div>
          </div>
        </div>
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex gap-2 max-w-xs lg:max-w-md min-w-0">
                  {message.sender_id !== currentUser?.id && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.sender?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {message.sender?.first_name?.[0]}{message.sender?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg px-4 py-2 break-words min-w-0 ${message.sender_id === currentUser?.id ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                    <p className="text-sm break-words w-full">{message.content}</p>
                    {/* ... renderAttachment(message) if needed ... */}
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs ${message.sender_id === currentUser?.id ? 'text-blue-100' : 'text-gray-500'}`}>{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {message.sender_id === currentUser?.id && (
                        <span className={`text-xs ${message.read ? 'text-blue-100' : 'text-blue-200'}`}>{message.read ? '✓✓' : '✓'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Typing Indicator, etc. */}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Message Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative min-w-0">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="min-h-[60px] max-h-[160px] resize-none pr-12 break-words w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    // handleSendMessage();
                  }
                }}
                disabled={sending}
              />
            </div>
            <Button
              onClick={() => {/* handleSendMessage() */}}
              disabled={sending || !newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Responsive layout
  return (
    <div className="flex flex-col sm:flex-row w-full h-full max-w-full">
      {/* Sidebar: show on desktop or if showSidebar is true on mobile */}
      {(showSidebar || window.innerWidth >= 640) && renderSidebar()}
      {/* Chat area: show if a chat is selected and (on desktop or showSidebar is false on mobile) */}
      {(!showSidebar || window.innerWidth >= 640) && renderChatArea()}
    </div>
  );
};

export default ChatSystem; 