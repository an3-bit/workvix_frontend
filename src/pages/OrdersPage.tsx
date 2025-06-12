import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MoreHorizontal, MessageCircle } from 'lucide-react';
import Nav2 from '@/components/Nav2';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Order {
  id: string;
  amount: number;
  status: string; // Order status (e.g., 'paid', 'in_progress', 'delivered', 'completed', 'cancelled')
  created_at: string;
  payment_method: string;
  bid: {
    id: string;
    delivery_time: string; // This comes from the bid
    freelancer_id: string; // ID of the freelancer who made the bid
    job_id: string; // ID of the job related to the bid
    freelancer: { // This assumes 'bids.freelancer_id' links to 'profiles' table
      first_name: string;
      last_name: string;
    };
    job: { // This assumes 'bids.job_id' links to 'jobs' table
      title: string;
      category: string;
      client_id: string; // The ID of the client who posted the job
      client: { // This assumes 'jobs.client_id' links to 'profiles' table
        first_name: string;
        last_name: string;
      };
    };
  };
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [userRole, setUserRole] = useState<'client' | 'freelancer' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = useCallback(async (currentUserId: string, role: 'client' | 'freelancer') => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          bid:bid_id (
            id,
            delivery_time,
            freelancer_id,
            job_id,
            freelancer:freelancer_id ( 
              first_name, 
              last_name
            ),
            job:job_id ( 
              title, 
              category,
              client_id,
              client:client_id ( 
                first_name,
                last_name
              )
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (role === 'client') {
        const { data: clientJobs, error: clientJobsError } = await supabase
          .from('jobs')
          .select('id')
          .eq('client_id', currentUserId);

        if (clientJobsError) {
          console.error("Error fetching client jobs for order filtering:", clientJobsError.message);
          throw clientJobsError;
        }

        const clientJobIds = clientJobs.map(job => job.id);

        if (clientJobIds.length === 0) {
          setOrders([]);
          setLoading(false);
          toast({
            title: "No Orders",
            description: "You haven't posted any jobs that have resulted in orders yet.",
            variant: "default"
          });
          return;
        }
        
        query = query.in('bid.job_id', clientJobIds);

      } else if (role === 'freelancer') {
        query = query.eq('bid.freelancer_id', currentUserId);
      } else {
        setOrders([]);
        setLoading(false);
        return;
      }

      const { data: ordersData, error: queryError } = await query;

      if (queryError) {
        console.error('Error fetching orders:', queryError);
        toast({
          title: "Error",
          description: "Failed to fetch orders: " + queryError.message,
          variant: "destructive"
        });
        return;
      }

      const typedOrders = (ordersData || []).filter(order => order.bid !== null) as Order[];
      setOrders(typedOrders);

      // Provide feedback if no orders are found after filtering
      if (typedOrders.length === 0) {
        toast({
          title: "No Orders",
          description: "No orders found for your account in this role.",
          variant: "default"
        });
      }

    } catch (error: any) {
      console.error('Error in fetchOrders:', error.message);
      toast({
        title: "Error",
        description: `Failed to fetch orders: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    const initPage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        toast({
          title: "Authentication Required",
          description: "Please log in to view your orders.",
          variant: "destructive"
        });
        return;
      }
      setUserId(user.id);

      let determinedRole: 'client' | 'freelancer' | null = null;

      // Check if user is a client (by having jobs)
      const { count: clientJobCount, error: clientJobError } = await supabase
        .from('jobs')
        .select('id', { count: 'exact', head: true })
        .eq('client_id', user.id);

      if (clientJobError) {
        console.error("Error checking client jobs for role determination:", clientJobError.message);
      } else if (clientJobCount && clientJobCount > 0) {
        determinedRole = 'client';
      }

      // If not definitively a client, check if they are a freelancer (by having bids)
      if (!determinedRole) {
        const { count: freelancerBidCount, error: freelancerBidError } = await supabase
          .from('bids')
          .select('id', { count: 'exact', head: true })
          .eq('freelancer_id', user.id);

        if (freelancerBidError) {
          console.error("Error checking freelancer bids for role determination:", freelancerBidError.message);
        } else if (freelancerBidCount && freelancerBidCount > 0) {
          determinedRole = 'freelancer';
        }
      }

      setUserRole(determinedRole);
      
      if (determinedRole) {
        fetchOrders(user.id, determinedRole);
      } else {
        setLoading(false);
        setOrders([]); // Ensure orders array is empty if no role is determined
        toast({
          title: "No Role Detected",
          description: "Your account is not currently associated with any client jobs or freelancer bids.",
          variant: "default"
        });
      }
    };
    initPage();
  }, [fetchOrders, toast]); // Add fetchOrders and toast to dependencies for useCallback

  useEffect(() => {
    if (!userId || !userRole) return;

    const channel = supabase
      .channel('orders_changes_page') // Unique channel name
      .on('postgres_changes', {
        event: '*', // Listen for INSERT, UPDATE, DELETE
        schema: 'public',
        table: 'orders',
      }, (payload) => {
        // console.log("Realtime change detected in orders:", payload); // For debugging
        // Re-fetch orders when there's a change in the 'orders' table
        if (userId && userRole) {
             fetchOrders(userId, userRole);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, userRole, fetchOrders]); // Add fetchOrders to dependencies for useCallback

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-blue-100 text-blue-800'; // New: For orders just paid
      case 'in_progress': return 'bg-indigo-100 text-indigo-800'; // Active work
      case 'pending': return 'bg-yellow-100 text-yellow-800'; // Initial state before payment/start
      case 'delivered': return 'bg-purple-100 text-purple-800'; // Freelancer delivered, awaiting client review
      case 'completed': return 'bg-green-100 text-green-800'; // Client accepted delivery
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterOrdersByStatus = (statusTab: string) => {
    if (!orders || orders.length === 0) return [];

    switch (statusTab) {
      case 'active':
        // 'active' now includes 'paid', 'in_progress', 'pending'
        return orders.filter(order => ['paid', 'in_progress', 'pending'].includes(order.status));
      case 'late':
        // This 'late' status needs to be set in your backend based on 'delivery_time' vs current date
        return orders.filter(order => order.status === 'late');
      case 'delivered':
        return orders.filter(order => order.status === 'delivered');
      case 'completed':
        return orders.filter(order => order.status === 'completed');
      case 'cancelled':
        return orders.filter(order => order.status === 'cancelled');
      case 'starred':
        // Implement starred logic if you have a 'starred' field on orders or user preferences
        return []; // Placeholder
      default:
        return orders;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      console.error("Invalid date string:", dateString);
      return 'Invalid Date';
    }
  };

  const getDisplayName = (order: Order) => {
    // Ensure all nested properties exist before accessing them
    if (!order.bid || !order.bid.freelancer || !order.bid.job || !order.bid.job.client) {
      return 'N/A';
    }

    if (userRole === 'client') {
      // Client views the freelancer they hired
      return `${order.bid.freelancer.first_name} ${order.bid.freelancer.last_name}`;
    } else if (userRole === 'freelancer') {
      // Freelancer views the client who posted the job
      return `${order.bid.job.client.first_name} ${order.bid.job.client.last_name}`;
    }
    return 'User'; // Default if role is null or not determined
  };
  
  const getTableHeaderText = () => {
    if (userRole === 'client') return 'FREELANCER';
    if (userRole === 'freelancer') return 'CLIENT';
    return 'USER';
  };

  if (loading || userRole === null) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav2 />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="ml-4 text-gray-700">Loading orders and determining your role...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Manage {userRole === 'client' ? 'Purchases' : 'Sales'}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by service"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 w-full max-w-2xl mb-8">
              <TabsTrigger value="active">Active ({filterOrdersByStatus('active').length})</TabsTrigger>
              <TabsTrigger value="late">Late ({filterOrdersByStatus('late').length})</TabsTrigger>
              <TabsTrigger value="delivered">Delivered ({filterOrdersByStatus('delivered').length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({filterOrdersByStatus('completed').length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({filterOrdersByStatus('cancelled').length})</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filterOrdersByStatus(activeTab).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 text-lg">No {activeTab} orders to show</div>
                  <p className="text-gray-400 mt-2">When you have {activeTab} orders, they'll appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Table Header */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="grid grid-cols-6 gap-4 p-4 text-sm font-medium text-gray-500 border-b">
                      <div>{getTableHeaderText()}</div> {/* Dynamic header */}
                      <div>GIG</div>
                      <div>DUE ON</div>
                      <div>ORDER DATE</div>
                      <div>TOTAL</div>
                      <div>ACTIONS</div>
                    </div>

                    {/* Orders */}
                    {filterOrdersByStatus(activeTab).map((order) => (
                      <div key={order.id} className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                            {getDisplayName(order)?.[0] || 'U'} {/* Use first char of dynamic name */}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {getDisplayName(order)}
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <div className="font-medium text-gray-900 mb-1">
                            {order.bid?.job?.title || 'Project Title'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.bid?.job?.category || 'Category'}
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          {order.bid?.delivery_time || 'Not specified'}
                        </div>

                        <div className="text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </div>

                        <div className="font-medium text-gray-900">
                          ${order.amount.toFixed(2)} {/* Format amount to 2 decimal places */}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;