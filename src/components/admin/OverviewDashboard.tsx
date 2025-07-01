import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, Briefcase, MessageSquare, User, Star, LifeBuoy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#2563eb', '#22c55e'];

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
          userTypeDistRes
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
          userTypeDistPromise
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
      } catch (err: any) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
      <div className="mb-8 max-w-md mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>User Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
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
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Latest Payments</CardTitle>
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
      </div>
      <div className="max-w-2xl mx-auto mb-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Latest Messages</CardTitle>
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
  );
};

export default OverviewDashboard;
