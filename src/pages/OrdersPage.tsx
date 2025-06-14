
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Package, DollarSign, Clock, User, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  bid_id: string;
  amount: number;
  status: string;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
  bid: {
    amount: number;
    message: string;
    delivery_time: string;
    freelancer_id: string;
    job_id: string;
    freelancer: {
      first_name: string;
      last_name: string;
      email: string;
    } | null;
    job: {
      title: string;
      description: string;
      category: string;
      client_id: string;
    } | null;
  } | null;
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
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
      
      await fetchOrders(user.id);
    } catch (error) {
      console.error('Error initializing data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (userId: string) => {
    try {
      // For clients, get orders where they are the job client
      // For freelancers, get orders where they are the freelancer
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          bid:bids (
            *,
            freelancer:profiles!bids_freelancer_id_fkey (
              first_name,
              last_name,
              email
            ),
            job:jobs (
              title,
              description,
              category,
              client_id
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter orders based on user role
      const userProfile = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', userId)
        .single();

      let filteredOrders = ordersData || [];

      if (userProfile.data?.user_type === 'client') {
        // Show orders for jobs posted by this client
        filteredOrders = ordersData?.filter(order => 
          order.bid?.job?.client_id === userId
        ) || [];
      } else if (userProfile.data?.user_type === 'freelancer') {
        // Show orders for bids made by this freelancer
        filteredOrders = ordersData?.filter(order => 
          order.bid?.freelancer_id === userId
        ) || [];
      }

      setOrders(filteredOrders as Order[]);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load orders.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const handleContactFreelancer = (freelancerId: string, jobId: string) => {
    // Navigate to chat with the freelancer
    navigate(`/chat?freelancer=${freelancerId}&job=${jobId}`);
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
        navigate(`/chat?support_chat=${existingChat.id}`);
        return;
      }

      // Create new support chat
      const { data: supportChat, error } = await supabase
        .from('support_chats')
        .insert([{
          user_id: currentUser.id,
          user_type: userProfile.user_type,
          subject: 'Order Support',
          status: 'open'
        }])
        .select()
        .single();

      if (error) throw error;

      navigate(`/chat?support_chat=${supportChat.id}`);

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
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600 mt-2">
                  {userProfile?.user_type === 'client' 
                    ? 'Manage your project orders and track progress'
                    : 'View your active projects and deliverables'
                  }
                </p>
              </div>
              
              <Button 
                onClick={createSupportChat}
                className="flex items-center space-x-2"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Contact Support</span>
              </Button>
            </div>

            {/* Orders Grid */}
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">
                  {userProfile?.user_type === 'client' 
                    ? 'Start by posting a job and accepting bids from freelancers.'
                    : 'Start bidding on projects to receive your first order.'
                  }
                </p>
                <Button 
                  onClick={() => {
                    if (userProfile?.user_type === 'client') {
                      navigate('/post-job');
                    } else {
                      navigate('/jobs');
                    }
                  }}
                >
                  {userProfile?.user_type === 'client' ? 'Post a Job' : 'Browse Jobs'}
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {orders.map((order) => (
                  <Card key={order.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">
                            {order.bid?.job?.title || 'Project'}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {order.bid?.job?.category || 'General'}
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {getStatusDisplay(order.status)}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Amount and Delivery */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-600">Amount</p>
                            <p className="font-semibold">${order.amount}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-600">Delivery</p>
                            <p className="font-semibold">{order.bid?.delivery_time || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Freelancer Info (for clients) or Client Info (for freelancers) */}
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">
                            {userProfile?.user_type === 'client' ? 'Freelancer' : 'Client'}
                          </p>
                          <p className="font-medium">
                            {userProfile?.user_type === 'client' 
                              ? `${order.bid?.freelancer?.first_name || ''} ${order.bid?.freelancer?.last_name || ''}`.trim() || 'Unknown'
                              : 'Client'
                            }
                          </p>
                        </div>
                      </div>

                      {/* Order Date */}
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Order Date</p>
                          <p className="text-sm font-medium">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleContactFreelancer(
                            order.bid?.freelancer_id || '', 
                            order.bid?.job_id || ''
                          )}
                          className="flex-1"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrdersPage;
