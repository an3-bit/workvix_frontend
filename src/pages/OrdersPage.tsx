
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MoreHorizontal, MessageCircle, Star } from 'lucide-react';
import Nav2 from '@/components/Nav2';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  payment_method: string;
  bid: {
    id: string;
    delivery_time: string;
    freelancer: {
      first_name: string;
      last_name: string;
    };
    job: {
      title: string;
      category: string;
    };
  };
}

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          *,
          bid:bids(
            id,
            delivery_time,
            freelancer:freelancers(first_name, last_name),
            job:jobs(title, category)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === 'active') {
      return orders.filter(order => ['pending', 'in_progress'].includes(order.status));
    }
    return orders.filter(order => order.status === status);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav2 />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skillforge-primary"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by service"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-skillforge-primary focus:border-transparent"
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
                      <div>BUYER</div>
                      <div>GIG</div>
                      <div>DUE ON</div>
                      <div>DELIVERED AT</div>
                      <div>TOTAL</div>
                      <div>NOTE</div>
                    </div>

                    {/* Orders */}
                    {filterOrdersByStatus(activeTab).map((order) => (
                      <div key={order.id} className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-skillforge-primary rounded-full flex items-center justify-center text-white font-medium">
                            {order.bid?.freelancer?.first_name?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {order.bid?.freelancer?.first_name} {order.bid?.freelancer?.last_name}
                            </div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
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
                          ${order.amount}
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
