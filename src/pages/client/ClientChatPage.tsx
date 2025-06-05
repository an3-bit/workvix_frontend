
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User, DollarSign, Clock, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  messages: Message[];
  unread_count: number;
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

const ClientChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    initializeData();
  }, []);

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
      // First get the chats
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('*')
        .eq('client_id', userId)
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

            // Fetch freelancer details
            const { data: freelancerData } = await supabase
              .from('freelancers')
              .select('first_name, last_name, email')
              .eq('id', chat.freelancer_id)
              .single();

            // Fetch messages
            const { data: messages } = await supabase
              .from('messages')
              .select('*')
              .eq('chat_id', chat.id)
              .order('created_at', { ascending: true });

            // Count unread messages from freelancer
            const unreadCount = messages?.filter(
              m => m.sender_id !== userId && !m.read
            ).length || 0;

            return {
              ...chat,
              job: jobData,
              freelancer: freelancerData,
              messages: messages || [],
              unread_count: unreadCount
            };
          })
        );

        setChats(chatsWithDetails);
        
        // Auto-select first chat if available
        if (chatsWithDetails.length > 0 && !selectedChat) {
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
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          bid:bids(
            delivery_time,
            job:jobs(title)
          )
        `)
        .order('created_at', { ascending: false });

      if (ordersData) {
        // Filter orders that belong to this client's jobs
        const clientOrders = ordersData.filter(order => 
          order.bid?.job?.title // Only orders with valid job data
        );
        setOrders(clientOrders);
      }
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
      const { data: message } = await supabase
        .from('messages')
        .insert([{
          chat_id: selectedChat.id,
          sender_id: currentUser.id,
          content: newMessage
        }])
        .select()
        .single();

      if (message) {
        // Update selected chat messages
        setSelectedChat(prev => prev ? {
          ...prev,
          messages: [...prev.messages, message]
        } : null);

        // Update chats list
        setChats(prev => prev.map(chat => 
          chat.id === selectedChat.id 
            ? { ...chat, messages: [...chat.messages, message] }
            : chat
        ));

        setNewMessage('');

        // Update chat's updated_at
        await supabase
          .from('chats')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', selectedChat.id);

        // Create notification for freelancer
        await supabase
          .from('notifications')
          .insert([{
            user_id: selectedChat.freelancer_id,
            type: 'new_message',
            message: `New message from client`,
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
                    chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatSelect(chat)}
                        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                          selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {chat.freelancer?.first_name?.charAt(0) || 'F'}{chat.freelancer?.last_name?.charAt(0) || 'L'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 truncate">
                                {chat.freelancer?.first_name || 'Unknown'} {chat.freelancer?.last_name || 'Freelancer'}
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
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {selectedChat.freelancer?.first_name?.charAt(0) || 'F'}{selectedChat.freelancer?.last_name?.charAt(0) || 'L'}
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900">
                            {selectedChat.freelancer?.first_name || 'Unknown'} {selectedChat.freelancer?.last_name || 'Freelancer'}
                          </h2>
                          <p className="text-sm text-gray-600">{selectedChat.job?.title || 'No job title'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">${selectedChat.job?.budget || 0}</p>
                        <p className="text-xs text-gray-500">{selectedChat.job?.category || 'No category'}</p>
                      </div>
                    </div>

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
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-gray-200 p-4">
                      <div className="flex gap-2">
                        <Textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message here..."
                          className="flex-1 min-h-[60px]"
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
                          <h4 className="font-medium text-gray-900">
                            {order.bid?.job?.title || 'Order'}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 mr-1" />
                              ${order.amount}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {order.bid?.delivery_time || 'TBD'}
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
