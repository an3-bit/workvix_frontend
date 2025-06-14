
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, User, DollarSign, Clock, FileText, Check, X, HelpCircle } from 'lucide-react';
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
  
  // Support chat state
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [supportChatId, setSupportChatId] = useState<string | null>(null);

  useEffect(() => {
    initializeData();
    setupRealtimeSubscription();
  }, []);

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
    if (chatId) {
      selectChatById(chatId, currentUser?.id || '');
    }
  }, [chats, searchParams, currentUser]);

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
        .single();
      
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
        
        // Update chats with new message
        setChats(prev => prev.map(chat => 
          chat.id === newMessage.chat_id
            ? {
                ...chat,
                messages: [...chat.messages, newMessage],
                unread_count: chat.id === selectedChat?.id ? 0 : chat.unread_count + 1
              }
            : chat
        ));
        
        // Update selected chat if it matches
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
      // Get chats where current user is either client or freelancer
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
            // Fetch job details
            const { data: jobData } = await supabase
              .from('jobs')
              .select('title, budget, category')
              .eq('id', chat.job_id)
              .single();

            // Fetch client details from profiles table
            const { data: clientData } = await supabase
              .from('profiles')
              .select('first_name, last_name, email')
              .eq('id', chat.client_id)
              .single();

            // Fetch freelancer details from profiles table
            const { data: freelancerData } = await supabase
              .from('profiles')
              .select('first_name, last_name')
              .eq('id', chat.freelancer_id)
              .single();

            // Fetch messages
            const { data: messages } = await supabase
              .from('messages')
              .select('*')
              .eq('chat_id', chat.id)
              .order('created_at', { ascending: true });

            // Count unread messages from other user
            const unreadCount = messages?.filter(
              m => m.sender_id !== userId && !m.read
            ).length || 0;

            // Fetch offer if exists
            const { data: offerData } = await supabase
              .from('offers')
              .select('*')
              .eq('chat_id', chat.id)
              .single();

            // Type cast the offer status
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
        
        // Auto-select first chat if available and no specific chat is selected
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
      // First check if user already has an open support chat
      const { data: existingChat } = await supabase
        .from('support_chats')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('status', 'open')
        .single();

      if (existingChat) {
        setSupportChatId(existingChat.id);
        setShowSupportChat(true);
        return;
      }

      // Create new support chat
      const { data: supportChat, error } = await supabase
        .from('support_chats')
        .insert([{
          user_id: currentUser.id,
          user_type: userProfile.user_type,
          subject: 'General Support',
          status: 'open'
        }])
        .select()
        .single();

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
      // Mark messages as read in database
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('chat_id', chatId)
        .neq('sender_id', userId);

      // Update local state
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

      // Also update selected chat if it's the same
      if (selectedChat && selectedChat.id === chatId) {
        setSelectedChat(prev => prev ? {
          ...prev,
          unread_count: 0,
          messages: prev.messages.map(msg => 
            msg.sender_id !== userId ? { ...msg, read: true } : msg
          )
        } : null);
      }

      // Delete message notifications for this chat
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
    if (!newMessage.trim() || !selectedChat || !currentUser) return;

    setSending(true);
    try {
      const { data: message, error } = await supabase
        .from('messages')
        .insert([{
          chat_id: selectedChat.id,
          sender_id: currentUser.id,
          content: newMessage.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      if (message) {
        // Update selected chat messages
        setSelectedChat(prev => prev ? {
          ...prev,
          messages: [...prev.messages, message]
        } : null);

        // Update chats list
        setChats(prev => prev.map(chat => 
          chat.id === selectedChat.id 
            ? { ...chat, messages: [...chat.messages, message], updated_at: new Date().toISOString() }
            : chat
        ));

        setNewMessage('');

        // Update chat's updated_at
        await supabase
          .from('chats')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', selectedChat.id);

        // Create notification for other user
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
        description: 'Failed to send message.',
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
        .single();

      if (error) throw error;

      // Type cast the offer status
      const typedOffer = {
        ...offer,
        status: 'pending' as 'pending' | 'accepted' | 'declined'
      };

      // Update local state
      setSelectedChat(prev => prev ? { ...prev, offer: typedOffer } : null);
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id ? { ...chat, offer: typedOffer } : chat
      ));

      // Create notification for client
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
      // Update offer status to accepted
      const { data: updatedOffer, error } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', offerId)
        .select()
        .single();

      if (error) throw error;

      // Type cast the offer status
      const typedOffer = {
        ...updatedOffer,
        status: 'accepted' as 'pending' | 'accepted' | 'declined'
      };

      // Update local state
      setSelectedChat(prev => prev ? { 
        ...prev, 
        offer: typedOffer 
      } : null);
      
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat?.id ? { ...chat, offer: typedOffer } : chat
      ));

      // Create notification for freelancer
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

      // Navigate to checkout
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
      // Update offer status to declined
      const { data: updatedOffer, error } = await supabase
        .from('offers')
        .update({ status: 'declined' })
        .eq('id', offerId)
        .select()
        .single();

      if (error) throw error;

      // Type cast the offer status
      const typedOffer = {
        ...updatedOffer,
        status: 'declined' as 'pending' | 'accepted' | 'declined'
      };

      // Update local state
      setSelectedChat(prev => prev ? { 
        ...prev, 
        offer: typedOffer 
      } : null);
      
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat?.id ? { ...chat, offer: typedOffer } : chat
      ));

      // Create notification for freelancer
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
                              {chat.messages.length > 0 
                                ? chat.messages[chat.messages.length - 1].content.substring(0, 30) + '...'
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
                          {/* Only show Accept/Decline buttons to CLIENT when offer status is PENDING */}
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
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                              <p className="whitespace-pre-wrap">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender_id === currentUser?.id 
                                  ? 'text-blue-100' 
                                  : 'text-gray-500'
                              }`}>
                                {new Date(message.created_at).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-gray-200 p-4">
                      {/* Create Offer button for freelancers when no offer exists */}
                      {isFreelancer && !selectedChat.offer && (
                        <div className="mb-4">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={handleCreateOffer}
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Create Offer
                          </Button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message here..."
                          className="flex-1 min-h-[60px] resize-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={sending || !newMessage.trim()}
                          className="h-[60px]"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="mb-2">Select a conversation to start messaging</p>
                      <p className="text-sm">
                        {chats.length === 0 
                          ? "Accept a bid from the Bids page to start chatting with freelancers"
                          : "Choose a conversation from the sidebar to continue chatting"
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Offer Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Offer</DialogTitle>
            <DialogDescription>
              Fill in the details of your offer for "{selectedChat?.job?.title || 'this job'}".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Job Details Display */}
            {selectedChat?.job && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Job Details</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Title:</strong> {selectedChat.job.title}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Category:</strong> {selectedChat.job.category}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Budget:</strong> ${selectedChat.job.budget}
                </p>
              </div>
            )}
            
            <div>
              <Label>Amount ($)</Label>
              <Input
                type="number"
                value={offerData.amount}
                onChange={(e) => setOfferData({...offerData, amount: e.target.value})}
                placeholder="Enter your offer amount"
              />
            </div>
            <div>
              <Label>Days to Complete</Label>
              <Input
                type="number"
                value={offerData.days}
                onChange={(e) => setOfferData({...offerData, days: e.target.value})}
                placeholder="Enter number of days"
              />
            </div>
            <div>
              <Label>Description (Optional)</Label>
              <Textarea
                value={offerData.description}
                onChange={(e) => setOfferData({...offerData, description: e.target.value})}
                placeholder="Describe your approach or any additional details"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowOfferDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitOffer}
                disabled={!offerData.amount || !offerData.days}
              >
                Submit Offer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
