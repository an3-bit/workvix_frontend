import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { TrendingUp, DollarSign, Users, Link2, ClipboardList, BarChart2, UserPlus, Activity, Bell, UserCircle, Search, LogOut } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Sidebar component for affiliate dashboard
const AffiliateSidebar = ({ active }: { active: string }) => (
  <aside className="bg-white shadow-lg h-full w-64 flex-shrink-0 flex flex-col py-8 px-4 border-r border-gray-100">
    <div className="mb-8 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Affiliate</div>
    <nav className="flex-1 flex flex-col gap-2">
      {[
        { label: 'Overview', href: '/affiliate/dashboard', icon: <BarChart2 className="h-5 w-5" /> },
        { label: 'Clients', href: '/affiliate/clients', icon: <Users className="h-5 w-5" /> },
        { label: 'Freelancers', href: '/affiliate/freelancers', icon: <ClipboardList className="h-5 w-5" /> },
        { label: 'Jobs', href: '/affiliate/jobs', icon: <TrendingUp className="h-5 w-5" /> },
        { label: 'Commission Summary', href: '/affiliate/commissions', icon: <DollarSign className="h-5 w-5" /> },
      ].map(link => (
        <Link
          key={link.label}
          to={link.href}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${active === link.label ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow' : 'text-gray-700 hover:bg-blue-50'}`}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  </aside>
);

// Top navigation bar for affiliate dashboard
const AffiliateNavBar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out of your account.',
      });
      navigate('/affiliate/register');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <nav className="w-full h-16 flex items-center justify-between px-8 bg-white border-b border-gray-100 shadow-sm z-50">
      {/* Left: Brand/Logo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">workvix affiliate</span>
      </div>
      {/* Center: Search Bar */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-blue-500 focus:outline-none bg-gray-50 text-gray-900 shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      {/* Right: Notifications, User, Logout */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-blue-50 transition" title="Notifications">
          <Bell className="h-6 w-6 text-blue-600" />
          {/* Notification dot */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
          <UserCircle className="h-7 w-7" />
        </div>
        <button
          className="p-2 rounded-full hover:bg-red-50 transition flex items-center justify-center"
          title="Logout"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <LogOut className="h-6 w-6 text-red-500" />
        </button>
      </div>
    </nav>
  );
};

// Layout for all affiliate pages
export const AffiliateLayout = ({ active }: { active: string }) => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <AffiliateNavBar />
    <div className="flex flex-1">
      <AffiliateSidebar active={active} />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  </div>
);

// The dashboard page now only renders its main content
const referralLink = `${window.location.origin}/?ref=${localStorage.getItem('affiliate_id') || 'YOUR_ID'}`;

// NOTE: Ensure Supabase Row Level Security (RLS) is enabled so users can only access their own data.

const AffiliateDashboard: React.FC = () => {
  const navigate = useNavigate();

  // State for live data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState([
    { label: 'Total Referrals', value: 0, icon: <Users className="h-6 w-6 text-blue-600" /> },
    { label: 'Commissions Earned', value: '$0', icon: <DollarSign className="h-6 w-6 text-green-600" /> },
    { label: 'Clicks', value: 0, icon: <TrendingUp className="h-6 w-6 text-purple-600" /> },
    { label: 'Conversion Rate', value: '0%', icon: <BarChart2 className="h-6 w-6 text-orange-500" /> },
  ]);
  const [chartData, setChartData] = useState([
    { month: 'Jan', Referrals: 0, Commissions: 0 },
    { month: 'Feb', Referrals: 0, Commissions: 0 },
    { month: 'Mar', Referrals: 0, Commissions: 0 },
    { month: 'Apr', Referrals: 0, Commissions: 0 },
    { month: 'May', Referrals: 0, Commissions: 0 },
    { month: 'Jun', Referrals: 0, Commissions: 0 },
    { month: 'Jul', Referrals: 0, Commissions: 0 },
    { month: 'Aug', Referrals: 0, Commissions: 0 },
    { month: 'Sep', Referrals: 0, Commissions: 0 },
    { month: 'Oct', Referrals: 0, Commissions: 0 },
    { month: 'Nov', Referrals: 0, Commissions: 0 },
    { month: 'Dec', Referrals: 0, Commissions: 0 },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);

  // Format helpers
  const formatNumber = (num: number) => num.toLocaleString();
  const formatCurrency = (num: number) => num.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = await getCurrentUser();
        if (!user) {
          setLoading(false);
          setError('User not authenticated.');
          return;
        }
        const affiliateId = user.id;

        // Fetch total referrals
        const { count: referralCount, error: refErr } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true })
          .eq('affiliate_id', affiliateId);
        if (refErr) throw refErr;

        // Fetch total clicks
        const { count: clickCount, error: clickErr } = await supabase
          .from('affiliate_clicks')
          .select('*', { count: 'exact', head: true })
          .eq('affiliate_id', affiliateId);
        if (clickErr) throw clickErr;

        // Fetch commissions earned
        const { data: commissionsData, error: commErr } = await supabase
          .from('payments')
          .select('amount')
          .eq('user_id', affiliateId)
          .eq('type', 'commission')
          .eq('status', 'completed');
        if (commErr) throw commErr;

        const totalCommissions = commissionsData
          ? commissionsData.reduce((sum, row) => sum + (row.amount || 0), 0)
          : 0;

        // Calculate conversion rate
        const conversionRate =
          clickCount && clickCount > 0
            ? `${((referralCount || 0) / clickCount * 100).toFixed(1)}%`
            : '0%';

        // Fetch monthly chart data (example: group by month)
        let monthlyData = null;
        try {
          const { data } = await supabase
            .rpc('get_affiliate_monthly_stats', { affiliate_id: affiliateId });
          monthlyData = data;
        } catch (e) {
          monthlyData = null;
        }

        // Fetch recent activity (last 5 events)
        const { data: activityData, error: actErr } = await supabase
          .from('referral_activity')
          .select('*')
          .eq('affiliate_id', affiliateId)
          .order('created_at', { ascending: false })
          .limit(5);
        if (actErr) throw actErr;

        setStats([
          { label: 'Total Referrals', value: formatNumber(referralCount || 0), icon: <Users className="h-6 w-6 text-blue-600" /> },
          { label: 'Commissions Earned', value: formatCurrency(totalCommissions), icon: <DollarSign className="h-6 w-6 text-green-600" /> },
          { label: 'Clicks', value: formatNumber(clickCount || 0), icon: <TrendingUp className="h-6 w-6 text-purple-600" /> },
          { label: 'Conversion Rate', value: conversionRate, icon: <BarChart2 className="h-6 w-6 text-orange-500" /> },
        ]);
        if (monthlyData && Array.isArray(monthlyData)) setChartData(monthlyData);
        if (activityData && Array.isArray(activityData)) setRecentActivity(activityData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
      {/* Stat Cards */}
      <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col items-center justify-center p-6 shadow rounded-xl">
            <div className="mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-gray-500">{stat.label}</div>
          </Card>
        ))}
      </div>
      {/* Referral Link */}
      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow">
        <div className="font-semibold mb-2">Your Referral Link</div>
        <div className="flex items-center w-full">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-2 py-1 rounded-l border border-gray-300 bg-white text-sm"
          />
          <Button onClick={copyReferralLink} className="rounded-l-none rounded-r bg-gradient-to-r from-blue-600 to-purple-600 text-white h-9 px-4">Copy</Button>
        </div>
      </div>
      {/* Chart Section */}
      <div className="col-span-2 bg-white rounded-xl shadow p-6 mt-8">
        <div className="font-semibold mb-4">Referrals & Commissions (Monthly)</div>
        <ChartContainer
          config={{
            Referrals: { color: '#6366f1', label: 'Referrals' },
            Commissions: { color: '#10b981', label: 'Commissions' },
          }}
        >
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Referrals" stroke="#6366f1" strokeWidth={2} />
            <Line type="monotone" dataKey="Commissions" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ChartContainer>
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <div className="font-semibold mb-4">Recent Activity</div>
        <ul className="divide-y divide-gray-100">
          {recentActivity.map((activity, idx) => (
            <li key={idx} className="flex items-center gap-3 py-3">
              <span>{activity.icon}</span>
              <span className="flex-1">{activity.desc}</span>
              <span className="text-xs text-gray-400">{activity.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AffiliateDashboard; 