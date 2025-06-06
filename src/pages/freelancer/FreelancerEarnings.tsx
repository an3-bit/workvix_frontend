
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Nav2 from '@/components/Nav2';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EarningRecord {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  bid: {
    id: string;
    job_id: string;
    amount: number;
    jobs: {
      title: string;
      client_id: string;
    };
  };
}

const FreelancerEarnings = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const { toast } = useToast();

  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    lastMonth: 0,
    pending: 0,
    available: 0
  });

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch orders related to freelancer's bids
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          id,
          amount,
          status,
          created_at,
          bid_id,
          bids (
            id,
            amount,
            job_id,
            freelancer_id,
            jobs (
              title,
              client_id
            )
          )
        `)
        .eq('bids.freelancer_id', user.id);

      if (error) {
        console.error('Error fetching earnings:', error);
        return;
      }

      const validOrders = (ordersData || []).filter(order => order.bids);
      setEarnings(validOrders);

      // Calculate earnings statistics
      const completedEarnings = validOrders.filter(order => order.status === 'completed');
      const pendingEarnings = validOrders.filter(order => order.status === 'pending');

      const totalEarnings = completedEarnings.reduce((sum, order) => sum + Number(order.amount), 0);
      const pendingAmount = pendingEarnings.reduce((sum, order) => sum + Number(order.amount), 0);

      // Calculate this month and last month earnings
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const thisMonthEarnings = completedEarnings
        .filter(order => new Date(order.created_at) >= thisMonthStart)
        .reduce((sum, order) => sum + Number(order.amount), 0);

      const lastMonthEarnings = completedEarnings
        .filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
        })
        .reduce((sum, order) => sum + Number(order.amount), 0);

      setEarningsData({
        totalEarnings,
        thisMonth: thisMonthEarnings,
        lastMonth: lastMonthEarnings,
        pending: pendingAmount,
        available: totalEarnings - pendingAmount
      });

    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load earnings data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Calendar className="h-4 w-4 text-orange-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav2 />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {showBalance ? `$${earningsData.totalEarnings.toFixed(2)}` : '****'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {showBalance ? `$${earningsData.thisMonth.toFixed(2)}` : '****'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {showBalance ? `$${earningsData.available.toFixed(2)}` : '****'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {showBalance ? `$${earningsData.pending.toFixed(2)}` : '****'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {earnings.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No earnings yet</h3>
                  <p className="text-gray-500">Complete jobs to start earning money!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {earnings.map((earning) => (
                    <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(earning.status)}
                        <div>
                          <h3 className="font-medium">{earning.bid?.jobs?.title || 'Unknown Project'}</h3>
                          <p className="text-sm text-gray-600">Order #{earning.id.slice(0, 8)}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(earning.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {showBalance ? `$${earning.amount.toFixed(2)}` : '****'}
                        </p>
                        <p className={`text-sm capitalize ${getStatusColor(earning.status)}`}>
                          {earning.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Earnings Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Earnings chart coming soon!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FreelancerEarnings;
