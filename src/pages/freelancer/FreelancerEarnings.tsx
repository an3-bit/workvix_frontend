import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Nav2 from '@/components/Nav2';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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

// Move these helpers above the component
const getLast12Months = () => {
  const months = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth() + 1}`,
      label: d.toLocaleString('default', { month: 'short', year: '2-digit' })
    });
  }
  return months;
};

const aggregateMonthlyEarnings = (earnings: EarningRecord[]) => {
  const months = getLast12Months();
  const monthly = months.map(({ key, label }) => {
    const total = earnings
      .filter(e => e.status === 'completed' && `${new Date(e.created_at).getFullYear()}-${new Date(e.created_at).getMonth() + 1}` === key)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return { month: label, earnings: total };
  });
  return monthly;
};

const exportEarningsToCSV = (earnings: EarningRecord[]) => {
  if (!earnings.length) return;
  const header = [
    'Order ID',
    'Project Title',
    'Amount',
    'Status',
    'Date',
  ];
  const rows = earnings.map(e => [
    e.id,
    e.bid?.jobs?.title || 'Unknown Project',
    e.amount,
    e.status,
    new Date(e.created_at).toLocaleDateString(),
  ]);
  const csvContent = [header, ...rows].map(row => row.map(String).map(cell => '"' + cell.replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'earnings_report.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportEarningsToPDF = (earnings: EarningRecord[]) => {
  if (!earnings.length) {
    toast({ title: 'No Data', description: 'No earnings to export.', variant: 'destructive' });
    return;
  }
  try {
    const doc = new jsPDF();
    const tableColumn = ['Order ID', 'Project Title', 'Amount', 'Status', 'Date'];
    const tableRows = earnings.map(e => [
      e.id,
      e.bid?.jobs?.title || 'Unknown Project',
      e.amount,
      e.status,
      new Date(e.created_at).toLocaleDateString(),
    ]);
    doc.text('Earnings Report', 14, 16);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save('earnings_report.pdf');
    toast({ title: 'Success', description: 'PDF downloaded.', variant: 'success' });
  } catch (error) {
    console.error('PDF export error:', error);
    toast({ title: 'Error', description: 'Failed to export PDF.', variant: 'destructive' });
  }
};

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

  const monthlyEarningsData = aggregateMonthlyEarnings(earnings);

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

      // Transform the data to match EarningRecord interface
      const transformedEarnings = (ordersData || [])
        .filter(order => order.bids)
        .map(order => ({
          id: order.id,
          amount: order.amount,
          status: order.status,
          created_at: order.created_at,
          bid: {
            id: order.bids.id,
            job_id: order.bids.job_id,
            amount: order.bids.amount,
            jobs: order.bids.jobs
          }
        })) as EarningRecord[];

      setEarnings(transformedEarnings);

      // Calculate earnings statistics
      const completedEarnings = transformedEarnings.filter(order => order.status === 'completed');
      const pendingEarnings = transformedEarnings.filter(order => order.status === 'pending');

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => exportEarningsToCSV(earnings)}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportEarningsToPDF(earnings)}>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Monthly Earnings Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyEarningsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="earnings" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerEarnings;
