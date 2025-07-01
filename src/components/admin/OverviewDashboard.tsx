import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, Briefcase, MessageSquare, User, Star, LifeBuoy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
<<<<<<< HEAD
<<<<<<< HEAD
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const COLORS = ['#2563eb', '#22c55e'];

const sampleSalesData = [
  { month: '2023-07', sales: 12, revenue: 1200 },
  { month: '2023-08', sales: 18, revenue: 1800 },
  { month: '2023-09', sales: 15, revenue: 1500 },
  { month: '2023-10', sales: 22, revenue: 2200 },
  { month: '2023-11', sales: 19, revenue: 1900 },
  { month: '2023-12', sales: 25, revenue: 2500 },
  { month: '2024-01', sales: 20, revenue: 2000 },
  { month: '2024-02', sales: 17, revenue: 1700 },
  { month: '2024-03', sales: 23, revenue: 2300 },
  { month: '2024-04', sales: 21, revenue: 2100 },
  { month: '2024-05', sales: 27, revenue: 2700 },
  { month: '2024-06', sales: 24, revenue: 2400 },
];

const RANGE_OPTIONS = [
  { label: 'This Week', value: 'this_week' },
  { label: 'Previous Week', value: 'previous_week' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 6 Months', value: 'last_6_months' },
  { label: 'This Year', value: 'this_year' },
  { label: 'Last Year', value: 'last_year' },
  { label: 'All Time', value: 'all_time' },
];
=======
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
=======
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
>>>>>>> 7438431 (admin dashboard)

const COLORS = ['#2563eb', '#22c55e'];
>>>>>>> a02f476 (admin dashboard)

const sampleSalesData = [
  { month: '2023-07', sales: 12, revenue: 1200 },
  { month: '2023-08', sales: 18, revenue: 1800 },
  { month: '2023-09', sales: 15, revenue: 1500 },
  { month: '2023-10', sales: 22, revenue: 2200 },
  { month: '2023-11', sales: 19, revenue: 1900 },
  { month: '2023-12', sales: 25, revenue: 2500 },
  { month: '2024-01', sales: 20, revenue: 2000 },
  { month: '2024-02', sales: 17, revenue: 1700 },
  { month: '2024-03', sales: 23, revenue: 2300 },
  { month: '2024-04', sales: 21, revenue: 2100 },
  { month: '2024-05', sales: 27, revenue: 2700 },
  { month: '2024-06', sales: 24, revenue: 2400 },
];

const RANGE_OPTIONS = [
  { label: 'This Week', value: 'this_week' },
  { label: 'Previous Week', value: 'previous_week' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 6 Months', value: 'last_6_months' },
  { label: 'This Year', value: 'this_year' },
  { label: 'Last Year', value: 'last_year' },
  { label: 'All Time', value: 'all_time' },
];

const OverviewDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalSales, setTotalSales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalFreelancers, setTotalFreelancers] = useState(0);
  const [openJobs, setOpenJobs] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [latestMessages, setLatestMessages] = useState<any[]>([]);
  const [latestPayments, setLatestPayments] = useState<any[]>([]);
  const [userTypeDist, setUserTypeDist] = useState<any[]>([]);
<<<<<<< HEAD
<<<<<<< HEAD
  const [monthlySalesData, setMonthlySalesData] = useState<any[]>([]);
  const [useSample, setUseSample] = useState(false);
  const [range, setRange] = useState('this_month');
=======
>>>>>>> a02f476 (admin dashboard)
=======
  const [monthlySalesData, setMonthlySalesData] = useState<any[]>([]);
  const [useSample, setUseSample] = useState(false);
  const [range, setRange] = useState('this_month');
>>>>>>> 7438431 (admin dashboard)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthStartISO = monthStart.toISOString();

        // 1. Total Sales (all time, completed job payments)
        const totalSalesPromise = supabase
          .from('payments')
          .select('amount', { count: 'exact' })
          .eq('type', 'job_payment')
          .eq('status', 'completed');

        // 2. Monthly Sales (completed job payments this month)
        const monthlySalesPromise = supabase
          .from('payments')
          .select('amount')
          .eq('type', 'job_payment')
          .eq('status', 'completed')
          .gte('created_at', monthStartISO);

        // 3. Total Customers
        const totalCustomersPromise = supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('user_type', 'client');

        // 4. Total Freelancers
        const totalFreelancersPromise = supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('user_type', 'freelancer');

        // 5. Open Jobs
        const openJobsPromise = supabase
          .from('jobs')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'open')
          .is('freelancer_id', null);

        // 6. Recent Activity (latest jobs, feedback, support tickets)
        const recentJobsPromise = supabase
          .from('jobs')
          .select('id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(4);
        const recentFeedbackPromise = supabase
          .from('feedback')
          .select('id, comment, created_at')
          .order('created_at', { ascending: false })
          .limit(4);
        const recentTicketsPromise = supabase
          .from('support_tickets')
          .select('id, subject, created_at')
          .order('created_at', { ascending: false })
          .limit(4);

        // 7. Latest Messages
        const latestMessagesPromise = supabase
          .from('messages')
          .select('id, content, created_at, sender_id')
          .order('created_at', { ascending: false })
          .limit(3);

        // 8. Latest Payments
        const latestPaymentsPromise = supabase
          .from('payments')
          .select(`id, amount, type, status, user_id, created_at`)
          .order('created_at', { ascending: false })
          .limit(5);

        // User type distribution
        const userTypeDistPromise = supabase
          .from('profiles')
          .select('user_type', { count: 'exact', head: false });

<<<<<<< HEAD
<<<<<<< HEAD
        // 9. Monthly sales data for the last 12 months
        const salesByMonthPromise = supabase.rpc('monthly_sales_last_12_months');

=======
>>>>>>> a02f476 (admin dashboard)
=======
        // 9. Monthly sales data for the last 12 months
        const salesByMonthPromise = supabase.rpc('monthly_sales_last_12_months');

>>>>>>> 7438431 (admin dashboard)
        const [
          totalSalesRes,
          monthlySalesRes,
          totalCustomersRes,
          totalFreelancersRes,
          openJobsRes,
          recentJobsRes,
          recentFeedbackRes,
          recentTicketsRes,
          latestMessagesRes,
          latestPaymentsRes,
<<<<<<< HEAD
<<<<<<< HEAD
          userTypeDistRes,
          salesByMonthRes
=======
          userTypeDistRes
>>>>>>> a02f476 (admin dashboard)
=======
          userTypeDistRes,
          salesByMonthRes
>>>>>>> 7438431 (admin dashboard)
        ] = await Promise.all([
          totalSalesPromise,
          monthlySalesPromise,
          totalCustomersPromise,
          totalFreelancersPromise,
          openJobsPromise,
          recentJobsPromise,
          recentFeedbackPromise,
          recentTicketsPromise,
          latestMessagesPromise,
          latestPaymentsPromise,
<<<<<<< HEAD
<<<<<<< HEAD
          userTypeDistPromise,
          salesByMonthPromise
=======
          userTypeDistPromise
>>>>>>> a02f476 (admin dashboard)
=======
          userTypeDistPromise,
          salesByMonthPromise
>>>>>>> 7438431 (admin dashboard)
        ]);

        // Total sales (sum of all completed job_payment amounts)
        let totalSales = 0;
        if (totalSalesRes.data) {
          totalSales = totalSalesRes.data.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        }
        setTotalSales(totalSales);

        // Monthly sales (sum of all completed job_payment amounts this month)
        let monthlySales = 0;
        if (monthlySalesRes.data) {
          monthlySales = monthlySalesRes.data.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        }
        setMonthlySales(monthlySales);

        // Total customers
        setTotalCustomers(totalCustomersRes.count || 0);
        // Total freelancers
        setTotalFreelancers(totalFreelancersRes.count || 0);
        // Open jobs
        setOpenJobs(openJobsRes.count || 0);

        // Recent activity: combine, sort by created_at desc, pick top 4
        const jobs = (recentJobsRes.data || []).map((j: any) => ({
          type: 'job',
          id: j.id,
          text: `New job posted: "${j.title}"`,
          created_at: j.created_at
        }));
        const feedback = (recentFeedbackRes.data || []).map((f: any) => ({
          type: 'feedback',
          id: f.id,
          text: `Feedback: "${f.comment?.slice(0, 40)}${f.comment?.length > 40 ? '...' : ''}"`,
          created_at: f.created_at
        }));
        const tickets = (recentTicketsRes.data || []).map((t: any) => ({
          type: 'ticket',
          id: t.id,
          text: `Support ticket: "${t.subject}"`,
          created_at: t.created_at
        }));
        const allActivity = [...jobs, ...feedback, ...tickets].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setRecentActivity(allActivity.slice(0, 4));

        // Latest messages
        setLatestMessages(latestMessagesRes.data || []);
        setLatestPayments(latestPaymentsRes.data || []);

        // User type distribution
        const dist = [
          { name: 'Clients', value: (userTypeDistRes.data || []).filter((u: any) => u.user_type === 'client').length },
          { name: 'Freelancers', value: (userTypeDistRes.data || []).filter((u: any) => u.user_type === 'freelancer').length },
        ];
        setUserTypeDist(dist);
<<<<<<< HEAD
<<<<<<< HEAD

        // Monthly sales data for bar chart
        setMonthlySalesData(salesByMonthRes.data || []);
=======
>>>>>>> a02f476 (admin dashboard)
=======

        // Monthly sales data for bar chart
        setMonthlySalesData(salesByMonthRes.data || []);
>>>>>>> 7438431 (admin dashboard)
      } catch (err: any) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Filtered data for the chart based on range
  const now = new Date();
  let start: Date | null = null;
  let end: Date | null = null;
  switch (range) {
    case 'this_week': {
      // Sunday to Saturday of current week
      const day = now.getDay();
      start = new Date(now);
      start.setDate(now.getDate() - day);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case 'previous_week': {
      // Sunday to Saturday of previous week
      const day = now.getDay();
      end = new Date(now);
      end.setDate(now.getDate() - day - 1);
      end.setHours(23, 59, 59, 999);
      start = new Date(end);
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case 'this_month':
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case 'last_month':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      break;
    case 'last_6_months':
      start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case 'this_year':
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    case 'last_year':
      start = new Date(now.getFullYear() - 1, 0, 1);
      end = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
      break;
    case 'all_time':
    default:
      start = null;
      end = null;
  }
  const filteredSalesData = (useSample ? sampleSalesData : monthlySalesData).filter((d: any) => {
    if (!start && !end) return true;
    const m = d.month + '-01';
    const date = new Date(m);
    if (start && date < start) return false;
    if (end && date > end) return false;
    return true;
  });

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> e25df71 (admin dashboard)
    <>
      <div className="p-6 bg-background pb-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:scale-[1.03] transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-white opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
              <p className="text-xs text-blue-100">${monthlySales} in last month</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:scale-[1.03] transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
              <DollarSign className="h-4 w-4 text-white opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlySales.toLocaleString()}</div>
              <p className="text-xs text-green-100">{((monthlySales / (totalSales || 1)) * 100).toFixed(1)}% of all time</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg hover:scale-[1.03] transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-white opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-indigo-100">Clients registered</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg hover:scale-[1.03] transition-transform">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Freelancers</CardTitle>
              <User className="h-4 w-4 text-white opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFreelancers}</div>
              <p className="text-xs text-pink-100">Freelancers registered</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card className="shadow-md bg-card h-full">
              <CardHeader>
                <CardTitle className="text-foreground flex flex-col gap-2">
                  <span>Sales & Revenue</span>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-foreground">Range:</label>
                      <Select value={range} onValueChange={setRange}>
                        <SelectTrigger className="w-40 h-8 bg-background text-foreground border rounded text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background text-foreground">
                          {RANGE_OPTIONS.map(opt => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <Switch checked={useSample} onCheckedChange={setUseSample} id="sample-toggle" />
                      <label htmlFor="sample-toggle" className="text-xs text-foreground cursor-pointer">Use Sample Data</label>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={filteredSalesData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#8884d8" className="text-xs" />
                    <YAxis stroke="#8884d8" className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#2563eb" name="Sales" />
                    <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="shadow-md bg-card h-full">
              <CardHeader>
                <CardTitle className="text-foreground">User Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={userTypeDist}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {userTypeDist.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="shadow-md bg-card h-full">
              <CardHeader>
                <CardTitle className="text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <li>No recent activity found.</li>
                  ) : (
                    recentActivity.map((item) => (
                      <li key={item.id} className="flex items-center space-x-3">
                        {item.type === 'job' && <Briefcase className="w-5 h-5 text-blue-500" />}
                        {item.type === 'feedback' && <Star className="w-5 h-5 text-yellow-500" />}
                        {item.type === 'ticket' && <LifeBuoy className="w-5 h-5 text-pink-500" />}
                        <span className="flex-1">{item.text}</span>
                        <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</span>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col gap-6">
            <Card className="shadow-md bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Latest Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-100">
                  {latestPayments.length === 0 ? (
                    <li className="py-2 text-gray-500">No payments found.</li>
                  ) : (
                    latestPayments.map((p: any) => (
                      <li key={p.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">${p.amount}</span>
                          <span className={`text-xs rounded px-2 py-0.5 ml-2 ${p.status === 'completed' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{p.status}</span>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-md bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Latest Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y divide-gray-100">
                  {latestMessages.length === 0 ? (
                    <li className="py-2 text-gray-500">No messages found.</li>
                  ) : (
                    latestMessages.map((m: any) => (
                      <li key={m.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{m.content?.slice(0, 40)}{m.content?.length > 40 ? '...' : ''}</span>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span>
                      </li>
                    ))
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
=======
    <div className="p-6 bg-background">
      <h2 className="text-3xl font-bold text-foreground mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:scale-[1.03] transition-transform">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-blue-100">${monthlySales} in last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:scale-[1.03] transition-transform">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlySales.toLocaleString()}</div>
            <p className="text-xs text-green-100">{((monthlySales / (totalSales || 1)) * 100).toFixed(1)}% of all time</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg hover:scale-[1.03] transition-transform">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-indigo-100">Clients registered</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg hover:scale-[1.03] transition-transform">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Freelancers</CardTitle>
            <User className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFreelancers}</div>
            <p className="text-xs text-pink-100">Freelancers registered</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="shadow-md bg-card h-full">
            <CardHeader>
              <CardTitle className="text-foreground flex flex-col gap-2">
                <span>Sales & Revenue</span>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-foreground">Range:</label>
                    <Select value={range} onValueChange={setRange}>
                      <SelectTrigger className="w-40 h-8 bg-background text-foreground border rounded text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background text-foreground">
                        {RANGE_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Switch checked={useSample} onCheckedChange={setUseSample} id="sample-toggle" />
                    <label htmlFor="sample-toggle" className="text-xs text-foreground cursor-pointer">Use Sample Data</label>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={filteredSalesData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#8884d8" className="text-xs" />
                  <YAxis stroke="#8884d8" className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#2563eb" name="Sales" />
                  <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="shadow-md bg-card h-full">
            <CardHeader>
              <CardTitle className="text-foreground">User Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={userTypeDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {userTypeDist.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="shadow-md bg-card h-full">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivity.length === 0 ? (
                  <li>No recent activity found.</li>
                ) : (
                  recentActivity.map((item) => (
                    <li key={item.id} className="flex items-center space-x-3">
                      {item.type === 'job' && <Briefcase className="w-5 h-5 text-blue-500" />}
                      {item.type === 'feedback' && <Star className="w-5 h-5 text-yellow-500" />}
                      {item.type === 'ticket' && <LifeBuoy className="w-5 h-5 text-pink-500" />}
                      <span className="flex-1">{item.text}</span>
                      <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card className="shadow-md bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Latest Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-100">
                {latestPayments.length === 0 ? (
                  <li className="py-2 text-gray-500">No payments found.</li>
                ) : (
                  latestPayments.map((p: any) => (
                    <li key={p.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">${p.amount}</span>
                        <span className={`text-xs rounded px-2 py-0.5 ml-2 ${p.status === 'completed' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{p.status}</span>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
          <Card className="shadow-md bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Latest Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-100">
                {latestMessages.length === 0 ? (
                  <li className="py-2 text-gray-500">No messages found.</li>
                ) : (
                  latestMessages.map((m: any) => (
                    <li key={m.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{m.content?.slice(0, 40)}{m.content?.length > 40 ? '...' : ''}</span>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
>>>>>>> 089fd42 (admin dashboard)
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 w-full z-50 border-t border-border bg-card py-2 px-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>Admin Dashboard © {new Date().getFullYear()} WorkVix</span>
        <div className="flex items-center gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-black transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 2H21l-7.19 8.24L22 22h-6.47l-5.1-6.2L4 22H1l7.64-8.74L2 2h6.47l4.73 5.75L17.53 2zm-2.13 16.98h1.77l-5.13-6.24-1.77 2.13 5.13 6.24z"/></svg></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/></svg></a>
        </div>
      </footer>
    </>
=======
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
=======
    <div className="p-6 bg-background">
      <h2 className="text-3xl font-bold text-foreground mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
>>>>>>> 7438431 (admin dashboard)
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:scale-[1.03] transition-transform">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-blue-100">${monthlySales} in last month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:scale-[1.03] transition-transform">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlySales.toLocaleString()}</div>
            <p className="text-xs text-green-100">{((monthlySales / (totalSales || 1)) * 100).toFixed(1)}% of all time</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg hover:scale-[1.03] transition-transform">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-indigo-100">Clients registered</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg hover:scale-[1.03] transition-transform">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Freelancers</CardTitle>
            <User className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFreelancers}</div>
            <p className="text-xs text-pink-100">Freelancers registered</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="shadow-md bg-card h-full">
            <CardHeader>
              <CardTitle className="text-foreground flex flex-col gap-2">
                <span>Sales & Revenue</span>
                <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-foreground">Range:</label>
                    <Select value={range} onValueChange={setRange}>
                      <SelectTrigger className="w-40 h-8 bg-background text-foreground border rounded text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background text-foreground">
                        {RANGE_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <Switch checked={useSample} onCheckedChange={setUseSample} id="sample-toggle" />
                    <label htmlFor="sample-toggle" className="text-xs text-foreground cursor-pointer">Use Sample Data</label>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={filteredSalesData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#8884d8" className="text-xs" />
                  <YAxis stroke="#8884d8" className="text-xs" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#2563eb" name="Sales" />
                  <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="shadow-md bg-card h-full">
            <CardHeader>
              <CardTitle className="text-foreground">User Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={userTypeDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {userTypeDist.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="shadow-md bg-card h-full">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivity.length === 0 ? (
                  <li>No recent activity found.</li>
                ) : (
                  recentActivity.map((item) => (
                    <li key={item.id} className="flex items-center space-x-3">
                      {item.type === 'job' && <Briefcase className="w-5 h-5 text-blue-500" />}
                      {item.type === 'feedback' && <Star className="w-5 h-5 text-yellow-500" />}
                      {item.type === 'ticket' && <LifeBuoy className="w-5 h-5 text-pink-500" />}
                      <span className="flex-1">{item.text}</span>
                      <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleString()}</span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-6">
          <Card className="shadow-md bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Latest Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-100">
                {latestPayments.length === 0 ? (
                  <li className="py-2 text-gray-500">No payments found.</li>
                ) : (
                  latestPayments.map((p: any) => (
                    <li key={p.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">${p.amount}</span>
                        <span className={`text-xs rounded px-2 py-0.5 ml-2 ${p.status === 'completed' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{p.status}</span>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
          <Card className="shadow-md bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Latest Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-100">
                {latestMessages.length === 0 ? (
                  <li className="py-2 text-gray-500">No messages found.</li>
                ) : (
                  latestMessages.map((m: any) => (
                    <li key={m.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">{m.content?.slice(0, 40)}{m.content?.length > 40 ? '...' : ''}</span>
                      </div>
                      <span className="text-xs text-gray-400">{new Date(m.created_at).toLocaleDateString()}</span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
>>>>>>> a02f476 (admin dashboard)
  );
};

export default OverviewDashboard;
