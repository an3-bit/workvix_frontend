import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, Briefcase, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
          latestPaymentsRes
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
          latestPaymentsPromise
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
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-blue-100">
              ${monthlySales} in last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlySales}</div>
            <p className="text-xs text-green-100">
              Total earnings so far this month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-purple-100">
              Registered clients on Workvix
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openJobs}</div>
            <p className="text-xs text-orange-100">
              Active jobs awaiting freelancers
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              {recentActivity.length === 0 ? (
                <li>No recent activity found.</li>
              ) : (
                recentActivity.map((item) => (
                  <li key={item.type + '-' + item.id}>- {item.text}</li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              {latestMessages.length === 0 ? (
                <li>No messages found.</li>
              ) : (
                latestMessages.map((msg) => (
                  <li key={msg.id}>
                    - {msg.content ? msg.content.slice(0, 60) : '[No content]'}
                    <span className="text-xs text-gray-400 ml-2">({new Date(msg.created_at).toLocaleString()})</span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
      {/* Payments Table Section */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Latest Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {latestPayments.length === 0 ? (
              <div className="text-gray-500">No payments found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-2 py-1 text-left">ID</th>
                      <th className="px-2 py-1 text-left">Amount</th>
                      <th className="px-2 py-1 text-left">Type</th>
                      <th className="px-2 py-1 text-left">Status</th>
                      <th className="px-2 py-1 text-left">User ID</th>
                      <th className="px-2 py-1 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestPayments.map((p) => (
                      <tr key={p.id}>
                        <td className="px-2 py-1 font-mono max-w-[100px] truncate">{p.id.slice(0, 8)}...</td>
                        <td className="px-2 py-1">${p.amount?.toFixed(2)}</td>
                        <td className="px-2 py-1">{p.type}</td>
                        <td className="px-2 py-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            p.status === 'completed' ? 'bg-green-100 text-green-800' :
                            p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            p.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-2 py-1">{p.user_id}</td>
                        <td className="px-2 py-1">{new Date(p.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewDashboard;
