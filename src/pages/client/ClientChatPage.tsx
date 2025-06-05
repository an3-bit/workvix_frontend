
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, Star, MessageSquare, User, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

interface ChatInfo {
  id: string;
  job_id: string;
  freelancer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  job: {
    title: string;
    budget: number;
  };
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

interface Order {
  id: string;
  status: string;
  amount: number;
  bid: {
    delivery_time: string;
    freelancer: {
      first_name: string;
      last_name: string;
    };
  };
}

const ClientChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job');
  const selectedChatId = searchParams.get('chat');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [chats, setChats] = useState<ChatInfo[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    initializeClientChat();
  }, [jobId, selectedChatId]);

  const initializeClientChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      setCurrentUser(user);
      await fetchChats(user.id);
      if (selectedChatId) {
        await selectChat(selectedChatId);
      }
      await fetchOrders(user.id);
    } catch (error) {
      console.error('Error initializing client chat:', error);
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
      const { data: chatData } = await supabase
        .from('chats')
        .select(`
          id,
          job_id,
          freelancer_id,
          created_at,
          jobs!inner(title, budget),
          profiles!chats_freelancer_id_fkey(id, first_name, last_name, email)
        `)
        .eq('client_id', userId);

      if (chatData) {
        const chatsWithDetails = await Promise.all(
          chatData.map(async (chat: any) => {
            // Get last message
            const { data: lastMessage } = await supabase
              .from('messages')
              .select('content, created_at')
              .eq('chat_id', chat.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();

            // Get unread count
            const { count: unreadCount } = await supabase
              .from('messages')
              .select('*', { count: 'exact', head: true })
              .eq('chat_id', chat.id)
              .eq('read', false)
              .neq('sender_id', userId);

            return {
              id: chat.id,
              job_id: chat.job_id,
              freelancer: chat.profiles,
              job: chat.jobs,
              lastMessage: lastMessage?.content || 'No messages yet',
              lastMessageTime: lastMessage?.created_at,
              unreadCount: unreadCount || 0
            };
          })
        );

        setChats(chatsWithDetails);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const fetchOrders = async (userId: string) => {
    try {
      const { data: orderData } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          amount,
          bids!inner(
            delivery_time,
            freelancers!inner(first_name, last_name),
            jobs!inner(client_id)
          )
        `)
        .eq('bids.jobs.client_id', userId);

      if (orderData) {
        const formattedOrders = orderData.map((order: any) => ({
          id: order.id,
          status: order.status,
          amount: order.amount,
          bid: {
            delivery_time: order.bids.delivery_time,
            freelancer: order.bids.freelancers
          }
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const selectChat = async (chatId: string) => {
    try {
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        setSelectedChat(chat);
        await fetchMessages(chatId);
        
        // Mark messages as read
        await supabase
          .from('messages')
          .update({ read: true })
          .eq('chat_id', chatId)
          .neq('sender_id', currentUser?.id);
      }
    } catch (error) {
      console.error('Error selecting chat:', error);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
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
        setMessages(prev => [...prev, message]);
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
            user_id: selectedChat.freelancer.id,
            type: 'new_message',
            message: `New message from client`,
            chat_id: selectedChat.id,
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
          <div className="flex gap-6 max-w-7xl mx-auto">
            {/* Left Sidebar - Chats List */}
            <div className="w-1/3 bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  All messages
                </h2>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => selectChat(chat.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedChat?.id === chat.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                        {chat.freelancer.first_name.charAt(0)}{chat.freelancer.last_name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900 truncate">
                              {chat.freelancer.first_name} {chat.freelancer.last_name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{chat.job.title}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm">5 (57)</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">
                            {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleDateString() : ''}
                          </span>
                          {chat.unreadCount > 0 && (
                            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                        {selectedChat.freelancer.first_name.charAt(0)}{selectedChat.freelancer.last_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedChat.freelancer.first_name} {selectedChat.freelancer.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">{selectedChat.job.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">As a client</span>
                      <span className="text-sm text-blue-600">As a freelancer</span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">
                            Chat started for job: {selectedChat.job.title}
                          </p>
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender_id === currentUser?.id ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                          >
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${message.sender_id === currentUser?.id ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
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
                        className="h-[60px] bg-green-600 hover:bg-green-700"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-[500px] text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Orders */}
            <div className="w-80 bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Orders with you</h3>
                <p className="text-sm text-gray-600">Total ({orders.length})</p>
              </div>
              
              <div className="p-4 space-y-4">
                {orders.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center">No orders yet</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3">
                      <div className="mb-2">
                        <p className="text-sm font-medium">
                          About freelancer: {order.bid.freelancer.first_name} {order.bid.freelancer.last_name}
                        </p>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget:</span>
                          <span className="font-medium">${order.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Delivery time:</span>
                          <span>{order.bid.delivery_time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`capitalize ${order.status === 'completed' ? 'text-green-600' : order.status === 'in_progress' ? 'text-blue-600' : 'text-yellow-600'}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment:</span>
                          <span>${order.amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment method:</span>
                          <span>Credit Card</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3">
                        View Order
                      </Button>
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
