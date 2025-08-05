import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Send, User, DollarSign, Clock, FileText, Check, X, HelpCircle, Paperclip, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import SupportChat from '@/components/SupportChat';

interface Chat {
  id: string;
  job_id: string;
  client_id: string;
  freelancer_id: string;
  created_at: string;
  updated_at: string;
  job: {
    title: string;
    budget: number;
    category: string;
  } | null;
  client: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  freelancer: {
    first_name: string;
    last_name: string;
  } | null;
  messages: Message[];
  unread_count: number;
  offer?: Offer | null;
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
  attachment_url?: string; // Optional URL for attached file
}

interface Offer {
  id: string;
  chat_id: string;
  job_id: string;
  freelancer_id: string;
  client_id: string;
  amount: number;
  days_to_complete: number;
  description: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [offerData, setOfferData] = useState({
    amount: '',
    days: '',
    description: ''
  });

  // File attachment state
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input element

  // Support chat state
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [supportChatId, setSupportChatId] = useState<string | null>(null);

  // Handle file attachment
  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFile(e.target.files[0]);
    } else {
      setAttachedFile(null);
    }
  };

  // Function to clear attached file state and input
  const clearAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the actual file input
    }
  };

  // Helper to format timestamps
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    initializeData();
    setupRealtimeSubscription();
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat messages when messages change or chat is selected
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [selectedChat?.messages]);

  useEffect(() => {
    // Handle support chat from URL params
    const supportChat = searchParams.get('support_chat');
    if (supportChat) {
      setSupportChatId(supportChat);
      setShowSupportChat(true);
      return;
    }

    // Handle direct chat navigation from URL params
    const chatId = searchParams.get('chat');
    if (chatId && chats.length > 0) { // Ensure chats are loaded before trying to select
      selectChatById(chatId, currentUser?.id || '');
    }

    // Handle navigation from notification (location.state)
    if (location.state && chats.length > 0) {
      console.log('ChatPage location.state:', location.state);
      // Try to find chat by client, freelancer, bid, or job
      const { client, freelancer, clientId, freelancerId, bid, job, notification } = location.state;
      let chatToSelect = null;
      if (clientId) {
        chatToSelect = chats.find(c => c.client_id === clientId || c.freelancer_id === clientId);
      } else if (freelancerId) {
        chatToSelect = chats.find(c => c.freelancer_id === freelancerId || c.client_id === freelancerId);
      } else if (client && client.id) {
        chatToSelect = chats.find(c => c.client_id === client.id);
      } else if (freelancer && freelancer.id) {
        chatToSelect = chats.find(c => c.freelancer_id === freelancer.id);
      } else if (bid && bid.id) {
        chatToSelect = chats.find(c => c.job_id === bid.job_id);
      } else if (job && job.id) {
        chatToSelect = chats.find(c => c.job_id === job.id);
      }
      if (chatToSelect) {
        setSelectedChat(chatToSelect);
        markMessagesAsRead(chatToSelect.id, currentUser?.id || '');
      }
    }
  }, [chats, searchParams, currentUser, location.state]);

  const initializeData = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User error:', userError);
      }
      
      if (!user) {
        console.log('No user found, redirecting to signin');
        navigate('/signin');
        return;
      }

      setCurrentUser(user);
      
      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      setUserProfile(profile);
      
      await fetchChats(user.id);
    } catch (error) {
      console.error('Error initializing data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('messages_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        const newMessage = payload.new as Message;
        
        setChats(prev => prev.map(chat => 
          chat.id === newMessage.chat_id
            ? {
                ...chat,
                messages: [...chat.messages, newMessage],
                unread_count: chat.id === selectedChat?.id ? 0 : chat.unread_count + 1
              }
            : chat
        ));
        
        setSelectedChat(prev => 
          prev && prev.id === newMessage.chat_id
            ? { ...prev, messages: [...prev.messages, newMessage] }
            : prev
        );
      })
      .subscribe();

    // Subscribe to offer changes
    const offersChannel = supabase
      .channel('offers_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'offers'
      }, () => {
        // Refresh chat data when offers change
        if (currentUser) {
          fetchChats(currentUser.id);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(offersChannel);
    };
  };

  const selectChatById = async (chatId: string, userId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setSelectedChat(chat);
      await markMessagesAsRead(chatId, userId);
    }
  };

  const fetchChats = async (userId: string) => {
    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .or(`freelancer_id.eq.${userId},client_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (chatsError) {
        console.error('Error fetching chats:', chatsError);
        return;
      }

      if (chatsData) {
        const chatsWithDetails = await Promise.all(
          chatsData.map(async (chat) => {
            const { data: jobData } = await supabase
              .from('jobs')
              .select('title, budget, category')
              .eq('id', chat.job_id)
              .maybeSingle();

            const { data: clientData } = await supabase
              .from('profiles')
              .select('first_name, last_name, email')
              .eq('id', chat.client_id)
              .maybeSingle();

            const { data: freelancerData } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', chat.freelancer_id)
              .maybeSingle();

            const { data: messages } = await supabase
              .from('messages')
              .select('*')
              .eq('chat_id', chat.id)
              .order('created_at', { ascending: true });

            const unreadCount = messages?.filter(
              m => m.sender_id !== userId && !m.read
            ).length || 0;

            const { data: offerData } = await supabase
              .from('offers')
              .select('*')
              .eq('chat_id', chat.id)
              .maybeSingle();

            const typedOffer = offerData ? {
              ...offerData,
              status: offerData.status as 'pending' | 'accepted' | 'declined'
            } : null;

            return {
              ...chat,
              job: jobData,
              client: clientData,
              freelancer: freelancerData,
              messages: messages || [],
              unread_count: unreadCount,
              offer: typedOffer
            } as Chat;
          })
        );

        setChats(chatsWithDetails);
        
        if (chatsWithDetails.length > 0 && !selectedChat && !searchParams.get('chat') && !showSupportChat) {
          setSelectedChat(chatsWithDetails[0]);
          await markMessagesAsRead(chatsWithDetails[0].id, userId);
        }
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const createSupportChat = async () => {
    if (!currentUser || !userProfile) return;

    try {
      const { data: existingChat } = await supabase
        .from('support_chats')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('status', 'open')
        .maybeSingle();

      if (existingChat) {
        setSupportChatId(existingChat.id);
        setShowSupportChat(true);
        return;
      }

      // Prepare insert data based on user_type
      const insertData: any = {
        user_id: currentUser.id,
        user_type: userProfile.user_type, // must be 'client' or 'freelancer'
        subject: 'General Support',
        status: 'open',
      };
      if (userProfile.user_type === 'client') {
        insertData.client_id = currentUser.id;
      } else if (userProfile.user_type === 'freelancer') {
        insertData.freelancer_id = currentUser.id;
      }

      const { data: supportChat, error } = await supabase
        .from('support_chats')
        .insert([insertData])
        .select()
        .maybeSingle();

      if (error) throw error;

      setSupportChatId(supportChat.id);
      setShowSupportChat(true);

      toast({
        title: 'Support Chat Created',
        description: 'You can now chat with our support team.',
      });
    } catch (error) {
      console.error('Error creating support chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to create support chat.',
        variant: 'destructive',
      });
    }
  };

  const markMessagesAsRead = async (chatId: string, userId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('chat_id', chatId)
        .neq('sender_id', userId);

      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              unread_count: 0,
              messages: chat.messages.map(msg => 
                msg.sender_id !== userId ? { ...msg, read: true } : msg
              )
            }
          : chat
      ));

      if (selectedChat && selectedChat.id === chatId) {
        setSelectedChat(prev => prev ? {
          ...prev,
          unread_count: 0,
          messages: prev.messages.map(msg => 
            msg.sender_id !== userId ? { ...msg, read: true } : msg
          )
        } : null);
      }

      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .eq('type', 'new_message');

    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleChatSelect = async (chat: Chat) => {
    setSelectedChat(chat);
    if (currentUser) {
      await markMessagesAsRead(chat.id, currentUser.id);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedChat || !currentUser) return;
    if (!newMessage.trim() && !attachedFile) {
      toast({
        title: 'Empty Message',
        description: 'Please type a message or attach a file to send.',
        variant: 'destructive',
      });
      return;
    }

    setSending(true);
    try {
      let attachmentUrl: string | null = null;

      if (attachedFile) {
        const fileExtension = attachedFile.name.split('.').pop();
        const filePath = `${selectedChat.id}/${currentUser.id}/${Date.now()}.${fileExtension}`; 

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
        } else {
          throw new Error('Failed to get public URL for the uploaded file.');
        }
      }

      const { data: message, error } = await supabase
        .from('messages')
        .insert([{
          chat_id: selectedChat.id,
          sender_id: currentUser.id,
          content: newMessage.trim(),
          attachment_url: attachmentUrl,
        }])
        .select()
        .maybeSingle();

      if (error) throw error;

      if (message) {
        setSelectedChat(prev => prev ? {
          ...prev,
          messages: [...prev.messages, message]
        } : null);

        setChats(prev => prev.map(chat => 
          chat.id === selectedChat.id 
            ? { ...chat, messages: [...chat.messages, message], updated_at: new Date().toISOString() }
            : chat
        ));

        setNewMessage('');
        clearAttachedFile();

        await supabase
          .from('chats')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', selectedChat.id);

        const otherUserId = currentUser.id === selectedChat.client_id ? selectedChat.freelancer_id : selectedChat.client_id;
        const senderName = currentUser.id === selectedChat.client_id 
          ? `${selectedChat.client?.first_name || 'Client'}`
          : `${selectedChat.freelancer?.first_name || 'Freelancer'}`;

        await supabase
          .from('notifications')
          .insert([{
            user_id: otherUserId,
            type: 'new_message',
            message: `New message from ${senderName}`,
            read: false
          }]);
      }
    } catch (error) {
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

  const handleCreateOffer = () => {
    if (!selectedChat) return;
    setOfferData({
      amount: selectedChat.job?.budget?.toString() || '',
      days: '',
      description: ''
    });
    setShowOfferDialog(true);
  };

  const handleSubmitOffer = async () => {
    if (!selectedChat || !currentUser) return;
    
    try {
      const { data: offer, error } = await supabase
        .from('offers')
        .insert([{
          chat_id: selectedChat.id,
          job_id: selectedChat.job_id,
          freelancer_id: selectedChat.freelancer_id,
          client_id: selectedChat.client_id,
          amount: parseFloat(offerData.amount),
          days_to_complete: parseInt(offerData.days),
          description: offerData.description,
          status: 'pending'
        }])
        .select()
        .maybeSingle();

      if (error) throw error;

      const typedOffer = {
        ...offer,
        status: 'pending' as 'pending' | 'accepted' | 'declined'
      };

      setSelectedChat(prev => prev ? { ...prev, offer: typedOffer } : null);
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id ? { ...chat, offer: typedOffer } : chat
      ));

      await supabase
        .from('notifications')
        .insert([{
          user_id: selectedChat.client_id,
          type: 'new_offer',
          message: `New offer received for ${selectedChat.job?.title || 'your job'}`,
          read: false
        }]);

      toast({
        title: 'Success',
        description: 'Offer submitted successfully!',
      });

      setShowOfferDialog(false);
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit offer.',
        variant: 'destructive',
      });
    }
  };

  const handleAcceptOffer = async (offerId: string) => {
    try {
      const { data: updatedOffer, error } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', offerId)
        .select()
        .maybeSingle();

      if (error) throw error;

      const typedOffer = {
        ...updatedOffer,
        status: 'accepted' as 'pending' | 'accepted' | 'declined'
      };

      setSelectedChat(prev => prev ? { 
        ...prev, 
        offer: typedOffer 
      } : null);
      
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat?.id ? { ...chat, offer: typedOffer } : chat
      ));

      if (selectedChat) {
        await supabase
          .from('notifications')
          .insert([{
            user_id: selectedChat.freelancer_id,
            type: 'offer_accepted',
            message: `Your offer for ${selectedChat.job?.title || 'a job'} was accepted!`,
            read: false
          }]);
      }

      toast({
        title: 'Offer Accepted',
        description: 'The freelancer has been notified. You can now proceed to checkout.',
      });

      navigate(`/checkout?offer_id=${offerId}`);

    } catch (error) {
      console.error('Error accepting offer:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept offer.',
        variant: 'destructive',
      });
    }
  };

  const handleDeclineOffer = async (offerId: string) => {
    try {
      const { data: updatedOffer, error } = await supabase
        .from('offers')
        .update({ status: 'declined' })
        .eq('id', offerId)
        .select()
        .maybeSingle();

      if (error) throw error;

      const typedOffer = {
        ...updatedOffer,
        status: 'declined' as 'pending' | 'accepted' | 'declined'
      };

      setSelectedChat(prev => prev ? { 
        ...prev, 
        offer: typedOffer 
      } : null);
      
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat?.id ? { ...chat, offer: typedOffer } : chat
      ));

      if (selectedChat) {
        await supabase
          .from('notifications')
          .insert([{
            user_id: selectedChat.freelancer_id,
            type: 'offer_declined',
            message: `Your offer for ${selectedChat.job?.title || 'a job'} was declined.`,
            read: false
          }]);
      }

      toast({
        title: 'Offer Declined',
        description: 'You have declined the offer.',
      });

    } catch (error) {
      console.error('Error declining offer:', error);
      toast({
        title: 'Error',
        description: 'Failed to decline offer.',
        variant: 'destructive',
      });
    }
  };

  const isFreelancer = selectedChat && currentUser?.id === selectedChat.freelancer_id;
  const isClient = selectedChat && currentUser?.id === selectedChat.client_id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show support chat if requested
  if (showSupportChat && supportChatId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav2 />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border h-[600px]">
              <SupportChat 
                chatId={supportChatId} 
                onClose={() => {
                  setShowSupportChat(false);
                  setSupportChatId(null);
                }}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm border">
            <div className="flex h-[600px]">
              {/* Chat List Sidebar */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                      <p className="text-sm text-gray-600">{chats.length} conversations</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={createSupportChat}
                      className="flex items-center space-x-2"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>Support</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {chats.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="space-y-2">
                        <p>No messages yet</p>
                        <p className="text-xs">Accept a bid to start chatting with freelancers</p>
                      </div>
                    </div>
                  ) : (
                    chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatSelect(chat)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {currentUser?.id === chat.client_id 
                              ? (chat.freelancer?.first_name?.charAt(0) || 'F') + (chat.freelancer?.last_name?.charAt(0) || 'L')
                              : (chat.client?.first_name?.charAt(0) || 'C') + (chat.client?.last_name?.charAt(0) || 'L')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 truncate">
                                {currentUser?.id === chat.client_id 
                                  ? `${chat.freelancer?.first_name || 'Freelancer'} ${chat.freelancer?.last_name || ''}`
                                  : `${chat.client?.first_name || 'Client'} ${chat.client?.last_name || ''}`}
                              </h3>
                              {chat.unread_count > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                  {chat.unread_count}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {chat.job?.title || 'No job title'}
                            </p>
                            {chat.offer && (
                              <div className="flex items-center mt-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  chat.offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  chat.offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  Offer {chat.offer.status}
                                </span>
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {/* Display a preview of the last message or indicate attachment */}
                              {chat.messages.length > 0 
                                ? chat.messages[chat.messages.length - 1].attachment_url
                                  ? 'Attachment sent 📎'
                                  : chat.messages[chat.messages.length - 1].content.substring(0, 30) + (chat.messages[chat.messages.length - 1].content.length > 30 ? '...' : '')
                                : 'No messages yet'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className="w-2/3 flex flex-col">
                {selectedChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                          {isFreelancer 
                            ? (selectedChat.client?.first_name?.charAt(0) || 'C') + (selectedChat.client?.last_name?.charAt(0) || 'L')
                            : (selectedChat.freelancer?.first_name?.charAt(0) || 'F') + (selectedChat.freelancer?.last_name?.charAt(0) || 'L')}
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900">
                            {isFreelancer 
                              ? `${selectedChat.client?.first_name || ''} ${selectedChat.client?.last_name || ''}`.trim() || 'Client'
                              : `${selectedChat.freelancer?.first_name || ''} ${selectedChat.freelancer?.last_name || ''}`.trim() || 'Freelancer'}
                          </h2>
                          <p className="text-sm text-gray-600">{selectedChat.job?.title || 'No job title'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {selectedChat.offer ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">
                              ${selectedChat.offer.amount}
                            </span>
                            <span className="text-xs text-gray-500">
                              {selectedChat.offer.days_to_complete} days
                            </span>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-900">${selectedChat.job?.budget || 0}</p>
                            <p className="text-xs text-gray-500">{selectedChat.job?.category || 'No category'}</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Offer Display */}
                    {selectedChat.offer && (
                      <div className={`border-b p-4 ${
                        selectedChat.offer.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                        selectedChat.offer.status === 'accepted' ? 'bg-green-50 border-green-200' :
                        'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              {selectedChat.offer.status === 'pending' 
                                ? 'Pending Offer' 
                                : selectedChat.offer.status === 'accepted' 
                                  ? 'Accepted Offer' 
                                  : 'Declined Offer'}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Amount: ${selectedChat.offer.amount} • {selectedChat.offer.days_to_complete} days
                            </p>
                            {selectedChat.offer.description && (
                              <p className="text-sm text-gray-600 mt-1">{selectedChat.offer.description}</p>
                            )}
                          </div>
                          {isClient && selectedChat.offer.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleAcceptOffer(selectedChat.offer?.id || '')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-1" /> Accept
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeclineOffer(selectedChat.offer?.id || '')}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4 mr-1" /> Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    <div id="messages-container" className="flex-1 overflow-y-auto p-4 space-y-4">
                      {selectedChat.messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          <div className="text-center">
                            <p className="mb-2">No messages yet. Start the conversation!</p>
                            <p className="text-sm">
                              {isFreelancer ? "Introduce yourself and discuss the project details." : "Ask any questions about the project requirements."}
                            </p>
                          </div>
                        </div>
                      ) : (
                        selectedChat.messages.map((message) => (
                          <div 
                            key={message.id} 
                            className={`flex ${message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div 
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender_id === currentUser?.id 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-100'
                              }`}
                            >
                              {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
                              
                              {/* Display attached file */}
                              {message.attachment_url && (
                                <div className="mt-2 flex items-center space-x-2 bg-white text-gray-800 p-2 rounded-md shadow-sm">
                                  <FileText className="h-5 w-5 flex-shrink-0" />
                                  <a 
                                    href={message.attachment_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-600 hover:underline flex-1 truncate"
                                    title={message.attachment_url.split('/').pop() || 'Download File'}
                                  >
                                    {message.attachment_url.split('/').pop() || 'Download Attachment'}
                                  </a>
                                  {/* The Button wrapper is good for styling, but for direct download, the <a> tag is key. */}
                                  {/* Ensure the 'download' attribute is on the <a> tag itself. */}
                                  {/* The issue is likely not in this part, but in the URL or permissions. */}
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    asChild 
                                  >
                                    <a href={message.attachment_url} download target="_blank" rel="noopener noreferrer">
                                      <Download className="h-4 w-4" />
                                    </a>
                                  </Button>
                                </div>
                              )}
                              
                              <p className={`text-xs mt-1 ${
                                message.sender_id === currentUser?.id 
                                  ? 'text-blue-100' 
                                  : 'text-gray-500'
                              }`}>
                                {formatTimestamp(message.created_at)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Message Input and Send Button */}
                    <div className="p-4 border-t border-gray-200">
                      {attachedFile && (
                        <div className="mb-2 flex items-center justify-between p-2 bg-gray-100 rounded-md">
                          <span className="text-sm text-gray-700 flex items-center">
                            <Paperclip className="h-4 w-4 mr-2" /> {attachedFile.name}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={clearAttachedFile}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileAttach}
                          className="hidden"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => fileInputRef.current?.click()}
                          className="text-gray-500 hover:text-gray-700"
                          disabled={sending}
                        >
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        <Textarea
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="flex-1 resize-none"
                          rows={1}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          disabled={sending}
                        />
                        <Button 
                          onClick={handleSendMessage} 
                          disabled={sending || (!newMessage.trim() && !attachedFile)}
                        >
                          {sending ? 'Sending...' : <Send className="h-5 w-5" />}
                        </Button>
                      </div>
                      {isFreelancer && !selectedChat.offer && (
                        <div className="mt-2 text-right">
                          <Button size="sm" onClick={handleCreateOffer}>Create Offer</Button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Select a chat to start messaging
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Offer</DialogTitle>
            <DialogDescription>
              Submit an offer for the selected job.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="offer-amount">Offer Amount ($)</Label>
              <Input
                id="offer-amount"
                type="number"
                value={offerData.amount}
                onChange={(e) => setOfferData({ ...offerData, amount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="offer-days">Days to Complete</Label>
              <Input
                id="offer-days"
                type="number"
                value={offerData.days}
                onChange={(e) => setOfferData({ ...offerData, days: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="offer-description">Description</Label>
              <Textarea
                id="offer-description"
                placeholder="Details about your offer..."
                value={offerData.description}
                onChange={(e) => setOfferData({ ...offerData, description: e.target.value })}
                rows={4}
              />
            </div>
            <Button onClick={handleSubmitOffer} disabled={sending}>
              {sending ? 'Submitting...' : 'Submit Offer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
