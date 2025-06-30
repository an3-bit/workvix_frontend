import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Send, User, DollarSign, Clock, Package, FileText, Check, X, Bell, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input'; // Assuming you have an Input component
import { Label } from '@/components/ui/label'; // Assuming you have a Label component
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

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
  freelancer: {
    id: string; // Added freelancer ID for easier comparison
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  client: { // Added client details for comprehensive display
    id: string; // Added client ID for easier comparison
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  messages: Message[];
  unread_count: number;
  offers: Offer[];
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface Order {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  bid: {
    delivery_time: string;
    job: {
      title: string;
    };
  } | null;
}

interface Offer {
  id: string;
  chat_id: string;
  freelancer_id: string;
  client_id: string;
  amount: number;
  delivery_time: string;
  description: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

const ClientChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const initialChatId = searchParams.get('chat');

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerDetails, setOfferDetails] = useState({
    amount: '',
    delivery_time: '',
    description: ''
  });
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeData();

    // Setup real-time subscription for messages and offers
    const messageChannel = supabase
      .channel('messages_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
        const newMessage = payload.new as Message;
        setChats(prevChats => {
          const updatedChats = prevChats.map(chat => {
            if (chat.id === newMessage.chat_id) {
              const updatedMessages = [...chat.messages, newMessage];
              // Update unread count for the recipient if they are not the sender and the chat is not currently selected
              const isRecipient = newMessage.sender_id !== currentUser?.id;
              const isSelectedChat = selectedChat?.id === chat.id;
              const unreadCount = isRecipient && !isSelectedChat ? chat.unread_count + 1 : chat.unread_count;

              return {
                ...chat,
                messages: updatedMessages,
                updated_at: new Date().toISOString(), // Update chat for sorting
                unread_count: unreadCount,
              };
            }
            return chat;
          }).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()); // Sort by updated_at

          // If the new message is for the currently selected chat, update it
          if (selectedChat?.id === newMessage.chat_id) {
            setSelectedChat(prev => prev ? { ...prev, messages: [...prev.messages, newMessage] } : null);
            if (newMessage.sender_id !== currentUser?.id) {
              markMessagesAsRead(newMessage.chat_id, currentUser.id);
            }
          }
          return updatedChats;
        });
        scrollToBottom();
      })
      .subscribe();

    const offersChannel = supabase
      .channel('offers_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'offers' }, payload => {
        const updatedOffer = payload.new as Offer;
        setChats(prevChats => prevChats.map(chat => {
          if (chat.id === updatedOffer.chat_id) {
            return {
              ...chat,
              offers: chat.offers.map(offer => 
                offer.id === updatedOffer.id ? updatedOffer : offer
              ),
              updated_at: new Date().toISOString(), // Update chat for sorting
            };
          }
          return chat;
        }).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())); // Sort by updated_at

        if (selectedChat?.id === updatedOffer.chat_id) {
          setSelectedChat(prev => prev ? { 
            ...prev, 
            offers: prev.offers.map(offer => offer.id === updatedOffer.id ? updatedOffer : offer) 
          } : null);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(offersChannel);
    };
  }, [currentUser, selectedChat]); // Added selectedChat to dependencies to ensure markMessagesAsRead has latest state

  const initializeData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      setCurrentUser(user);
      await fetchChats(user.id);
      await fetchOrders(user.id);
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

  const fetchChats = async (userId: string) => {
    try {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .or(`client_id.eq.${userId},freelancer_id.eq.${userId}`)
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
              .single();

            const { data: freelancerData } = await supabase
              .from('profiles') // Assuming a 'profiles' table for both client/freelancer details
              .select('id, first_name, last_name, email')
              .eq('id', chat.freelancer_id)
              .single();

            const { data: clientData } = await supabase
              .from('profiles') // Assuming a 'profiles' table
              .select('id, first_name, last_name, email')
              .eq('id', chat.client_id)
              .single();

            const { data: messages } = await supabase
              .from('messages')
              .select('*')
              .eq('chat_id', chat.id)
              .order('created_at', { ascending: true });

            const { data: offers } = await supabase
              .from('offers')
              .select('*')
              .eq('chat_id', chat.id)
              .order('created_at', { ascending: false });

            const unreadCount = messages?.filter(
              m => m.sender_id !== userId && !m.read
            ).length || 0;

            // Ensure offers have all required fields for the Offer type
            const offersWithDefaults = (offers || []).map((offer: any) => ({
              id: offer.id,
              chat_id: offer.chat_id,
              freelancer_id: offer.freelancer_id,
              client_id: offer.client_id,
              amount: offer.amount,
              delivery_time: offer.delivery_time,
              description: offer.description ?? '',
              status: offer.status,
              created_at: offer.created_at,
              updated_at: offer.updated_at,
            }));

            return {
              ...chat,
              job: jobData,
              freelancer: freelancerData,
              client: clientData,
              messages: messages || [],
              offers: offersWithDefaults,
              unread_count: unreadCount
            };
          })
        );

        setChats(chatsWithDetails);
        
        // Auto-select chat from URL param or first chat if available
        if (initialChatId) {
          const chatToSelect = chatsWithDetails.find(chat => chat.id === initialChatId);
          if (chatToSelect) {
            setSelectedChat(chatToSelect);
            await markMessagesAsRead(chatToSelect.id, userId);
            navigate('/client/chat', { replace: true }); // Clean URL after selection
          } else if (chatsWithDetails.length > 0) {
            setSelectedChat(chatsWithDetails[0]);
            await markMessagesAsRead(chatsWithDetails[0].id, userId);
          }
        } else if (chatsWithDetails.length > 0 && !selectedChat) {
          setSelectedChat(chatsWithDetails[0]);
          await markMessagesAsRead(chatsWithDetails[0].id, userId);
        }
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchOrders = async (userId: string) => {
    try {
      // Fetch jobs created by the current client to filter orders
      const { data: clientJobs, error: clientJobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('client_id', userId);

      if (clientJobsError) throw clientJobsError;
      const clientJobIds = clientJobs.map(job => job.id);

// Fetch orders where the bid's job_id is in the list of jobs posted by this client
const { data: orders, error: ordersError } = await supabase
  .from('orders')
  .select(`
    *,
    bid:bid_id (
      *,
      job:job_id (
        title,
        budget,
        category,
        client_id
      )
    )
  `);

if (ordersError) {
  console.error("Error fetching orders:", ordersError);
  return;
}

// Filter orders to only those where the job belongs to this client
const clientOrders = (orders || []).filter(order =>
  order.bid?.job?.client_id === userId
);

setOrders(clientOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const markMessagesAsRead = async (chatId: string, userId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('chat_id', chatId)
        .neq('sender_id', userId); // Only mark messages sent by others as read

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
      ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleChatSelect = async (chat: Chat) => {
    setSelectedChat(chat);
    setShowOfferForm(false); // Hide offer form when switching chats
    if (currentUser) {
      await markMessagesAsRead(chat.id, currentUser.id);
    }
    scrollToBottom();
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFile(e.target.files[0]);
    } else {
      setAttachedFile(null);
    }
  };

  const clearAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachedFile) return;
    if (!selectedChat || !currentUser) return;

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
          content: newMessage,
          attachment_url: attachmentUrl,
        }])
        .select()
        .single();
      if (error) throw error;
      if (message) {
        setSelectedChat(prev => prev ? {
          ...prev,
          messages: [...prev.messages, message]
        } : null);
        setNewMessage('');
        clearAttachedFile();
        scrollToBottom();
        await supabase
          .from('chats')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', selectedChat.id);
        const recipientId = currentUser.id === selectedChat.client_id ? selectedChat.freelancer_id : selectedChat.client_id;
        if (recipientId) {
          await supabase
            .from('notifications')
            .insert([{
              user_id: recipientId,
              type: 'new_message',
              message: `New message from ${currentUser.id === selectedChat.client_id ? selectedChat.client?.first_name : selectedChat.freelancer?.first_name}`,
              read: false,
              metadata: { chat_id: selectedChat.id }
            }]);
        }
      }
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

  const handleCreateOffer = async () => {
    if (!selectedChat || !currentUser || !offerDetails.amount || !offerDetails.delivery_time || !offerDetails.description) {
      toast({
        title: 'Error',
        description: 'Please fill all offer details.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: offer, error } = await supabase
        .from('offers')
        .insert([{
          chat_id: selectedChat.id,
          freelancer_id: currentUser.id,
          client_id: selectedChat.client_id, // Client ID from the chat
          amount: parseFloat(offerDetails.amount),
          delivery_time: offerDetails.delivery_time,
          description: offerDetails.description,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      if (offer) {
        // Update local state and sort by updated_at
        setSelectedChat(prev => prev ? {
          ...prev,
          offers: [offer, ...prev.offers].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort offers by created_at
        } : null);

        setChats(prev => prev.map(chat => 
          chat.id === selectedChat.id 
            ? { ...chat, offers: [offer, ...chat.offers].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), updated_at: new Date().toISOString() }
            : chat
        ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));

        // Create notification for client
        if (selectedChat.client_id) {
          await supabase
            .from('notifications')
            .insert([{
              user_id: selectedChat.client_id,
              type: 'new_offer',
              message: `New offer received for "${selectedChat.job?.title || 'your job'}"`,
              read: false,
              metadata: { chat_id: selectedChat.id, offer_id: offer.id }
            }]);
        }

        toast({
          title: 'Success',
          description: 'Offer sent successfully!',
        });

        setShowOfferForm(false);
        setOfferDetails({
          amount: '',
          delivery_time: '',
          description: ''
        });
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      toast({
        title: 'Error',
        description: `Failed to send offer: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  const handleOfferResponse = async (offerId: string, accepted: boolean) => {
    if (!selectedChat || !currentUser) return;

    try {
      // Update offer status
      const { data: updatedOffer, error } = await supabase
        .from('offers')
        .update({
          status: accepted ? 'accepted' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', offerId)
        .select()
        .single();

      if (error) throw error;

      if (updatedOffer) {
        // Update local state and sort
        setSelectedChat(prev => prev ? {
          ...prev,
          offers: prev.offers.map(offer => 
            offer.id === offerId ? updatedOffer : offer
          ).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        } : null);

        setChats(prev => prev.map(chat => 
          chat.id === selectedChat.id 
            ? { 
                ...chat, 
                offers: chat.offers.map(offer => 
                  offer.id === offerId ? updatedOffer : offer
                ).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
                updated_at: new Date().toISOString(),
              }
            : chat
        ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));

        // Create notification for freelancer
        if (selectedChat.freelancer_id) {
          await supabase
            .from('notifications')
            .insert([{
              user_id: selectedChat.freelancer_id,
              type: accepted ? 'offer_accepted' : 'offer_rejected',
              message: `Your offer for "${selectedChat.job?.title || 'a job'}" was ${accepted ? 'accepted' : 'rejected'}.`,
              read: false,
              metadata: { chat_id: selectedChat.id, offer_id: offerId }
            }]);
        }

        toast({
          title: 'Success',
          description: `Offer ${accepted ? 'accepted' : 'rejected'}!`,
        });

        if (accepted) {
          // Redirect to checkout page with offer ID
          navigate(`/checkout?offer_id=${offerId}`);
        }
      }
    } catch (error) {
      console.error('Error responding to offer:', error);
      toast({
        title: 'Error',
        description: `Failed to process offer response: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Determine if the current user is the freelancer or client in the selected chat
  const isFreelancer = currentUser?.id && selectedChat?.freelancer_id === currentUser.id;
  const isClient = currentUser?.id && selectedChat?.client_id === currentUser.id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                  <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                  <p className="text-sm text-gray-600">{chats.length} conversations</p>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {chats.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No messages yet
                    </div>
                  ) : (
                    chats.map((chat) => {
                      const chatPartner = chat.freelancer?.id === currentUser?.id ? chat.client : chat.freelancer;
                      const partnerFirstName = chatPartner?.first_name || 'Unknown';
                      const partnerLastName = chatPartner?.last_name || 'User';

                      return (
                        <div
                          key={chat.id}
                          onClick={() => handleChatSelect(chat)}
                          className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                            selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                              {partnerFirstName.charAt(0)}{partnerLastName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-900 truncate">
                                  {partnerFirstName} {partnerLastName}
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
                              <p className="text-xs text-gray-500">
                                {chat.messages.length > 0 
                                  ? chat.messages[chat.messages.length - 1].content.substring(0, 30) + '...'
                                  : 'No messages yet'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
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
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {selectedChat.freelancer?.id === currentUser?.id ? selectedChat.client?.first_name?.charAt(0) : selectedChat.freelancer?.first_name?.charAt(0)}
                          {selectedChat.freelancer?.id === currentUser?.id ? selectedChat.client?.last_name?.charAt(0) : selectedChat.freelancer?.last_name?.charAt(0)}
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900">
                            {selectedChat.freelancer?.id === currentUser?.id 
                              ? `${selectedChat.client?.first_name || 'Unknown'} ${selectedChat.client?.last_name || 'Client'}`
                              : `${selectedChat.freelancer?.first_name || 'Unknown'} ${selectedChat.freelancer?.last_name || 'Freelancer'}`
                            }
                          </h2>
                          <p className="text-sm text-gray-600">{selectedChat.job?.title || 'No job title'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${selectedChat.job?.budget || 0}</p>
                        <p className="text-xs text-gray-500">{selectedChat.job?.category || 'No category'}</p>
                      </div>
                    </div>

                    {/* Offers Section */}
                    {selectedChat.offers.length > 0 && (
                      <div className="border-b border-gray-200 p-4 bg-gray-50">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Offers ({selectedChat.offers.length})
                        </h3>
                        <div className="space-y-3">
                          {selectedChat.offers.map((offer) => (
                            <div key={offer.id} className="border rounded-lg p-3 bg-white">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">${offer.amount}</p>
                                  <p className="text-sm text-gray-600">{offer.delivery_time}</p>
                                  <p className="text-xs text-gray-500 mt-1">{offer.description}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`text-xs px-2 py-1 rounded ${
                                    offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                    offer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {offer.status}
                                  </span>
                                  {isClient && offer.status === 'pending' && (
                                    <>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleOfferResponse(offer.id, true)}
                                      >
                                        <Check className="h-4 w-4 text-green-600" />
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8 w-8 p-0"
                                        onClick={() => handleOfferResponse(offer.id, false)}
                                      >
                                        <X className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </>
                                  )}
                                  {isFreelancer && offer.status === 'rejected' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      disabled // Freelancer cannot resubmit rejected offer directly from here
                                    >
                                      Rejected
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {selectedChat.messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No messages yet. Start the conversation!
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
                              <p>{message.content}</p>
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
                      <div ref={messagesEndRef} /> {/* Scroll to this element */}
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-gray-200 p-4">
                      {isFreelancer && !showOfferForm && (
                        <div className="mb-3">
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setShowOfferForm(true)}
                          >
                            Make an Offer
                          </Button>
                        </div>
                      )}

                      {showOfferForm && isFreelancer && ( // Ensure only freelancer sees this form
                        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                          <h3 className="font-medium mb-3">Create Offer</h3>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="offer-amount">Amount ($)</Label>
                              <Input
                                id="offer-amount"
                                type="number"
                                value={offerDetails.amount}
                                onChange={(e) => setOfferDetails({...offerDetails, amount: e.target.value})}
                                placeholder="e.g. 100"
                              />
                            </div>
                            <div>
                              <Label htmlFor="offer-delivery-time">Delivery Time</Label>
                              <Input
                                id="offer-delivery-time"
                                type="text"
                                value={offerDetails.delivery_time}
                                onChange={(e) => setOfferDetails({...offerDetails, delivery_time: e.target.value})}
                                placeholder="e.g. 2 weeks"
                              />
                            </div>
                            <div>
                              <Label htmlFor="offer-description">Description</Label>
                              <Textarea
                                id="offer-description"
                                value={offerDetails.description}
                                onChange={(e) => setOfferDetails({...offerDetails, description: e.target.value})}
                                placeholder="Describe your offer..."
                                rows={3}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline"
                                onClick={() => setShowOfferForm(false)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleCreateOffer}
                                disabled={!offerDetails.amount || !offerDetails.delivery_time || !offerDetails.description}
                              >
                                Send Offer
                              </Button>
                            </div>
                          </div>
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
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Select a conversation to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="max-w-7xl mx-auto mt-8 bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Recent Orders
              </h3>
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No orders yet</p>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          {/* Display job title from the offer's chat's job */}
                          <h4 className="font-medium text-gray-900">
                            {order.offer?.chat?.job?.title || 'N/A'}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 mr-1" />
                              ${order.amount}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {order.offer?.delivery_time || 'TBD'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ClientChatPage;