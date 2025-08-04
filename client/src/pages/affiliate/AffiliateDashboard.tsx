import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { TrendingUp, DollarSign, Users, Link2, ClipboardList, BarChart2, UserPlus, Activity, Bell, UserCircle, Search, LogOut, User, Link as LinkIcon, ArrowDownCircle, Settings } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar } from 'recharts';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Sidebar component for affiliate dashboard
const AffiliateSidebar = ({ active }: { active: string }) => (
  <aside className="bg-white shadow-lg h-screen w-64 flex-shrink-0 flex flex-col py-8 px-4 border-r border-gray-100">
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
  const [userProfile, setUserProfile] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch user profile for dropdown
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userProf } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        setUserProfile(userProf);
      }
    })();
    // Close dropdown on outside click
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
          <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
        </button>
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg p-0"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="Profile"
          >
            <UserCircle className="h-7 w-7" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-5 animate-fade-in">
              {userProfile && (
                <div className="mb-3 text-center">
                  <img src={userProfile.avatar_url || `https://ui-avatars.com/api/?name=${userProfile.first_name}+${userProfile.last_name}`} alt="avatar" className="w-14 h-14 rounded-full mx-auto mb-2 border-2 border-blue-200 shadow" />
                  <div className="font-bold text-lg text-gray-900">{userProfile.first_name} {userProfile.last_name}</div>
                  <div className="text-xs text-gray-500">{userProfile.email}</div>
                  <div className="text-xs text-gray-500 mt-1">{userProfile.user_type}</div>
                  <div className="text-xs text-green-600 mt-1">{userProfile.online ? 'Online' : 'Offline'}</div>
                </div>
              )}
              <hr className="my-3 border-gray-200" />
              <button
                className="w-full flex items-center gap-2 text-left px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition mb-2 shadow"
                onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
              >
                <Settings className="h-4 w-4" />
                Profile Settings
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium text-red-600" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// Layout for all affiliate pages
export const AffiliateLayout = ({ active }: { active: string }) => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <AffiliateNavBar />
    <div className="flex flex-1 h-[calc(100vh-4rem)]"> {/* 4rem = 64px navbar height */}
      <AffiliateSidebar active={active} />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

// The dashboard page now only renders its main content
const referralLink = `${window.location.origin}/?ref=${localStorage.getItem('affiliate_id') || 'YOUR_ID'}`;

// NOTE: Ensure Supabase Row Level Security (RLS) is enabled so users can only access their own data.

const AffiliateDashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [stats, setStats] = useState({ earnings: 0, clicks: 0, signups: 0, conversions: 0 });
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setLoading(false);

      console.log('User:', user);

      // 2. Fetch affiliate profile
      const { data: affiliate } = await supabase
        .from('affiliate_marketers')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      setProfile(affiliate);

      console.log('Affiliate:', affiliate);

      // 2b. Fetch user profile from profiles table
      const { data: userProf } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      setUserProfile(userProf);

      // 3. Fetch stats (replace with your actual logic/tables)
      // Example: earnings from payouts/payments table
      let earnings = 0;
      const { data: earningsData } = await supabase
        .from('payouts')
        .select('amount')
        .eq('affiliate_id', user.id)
        .eq('status', 'Completed');
      if (earningsData) {
        earnings = earningsData.reduce((sum, p) => sum + (p.amount || 0), 0);
      }

      // Example: signups from referrals table
      let signups = 0;
      const { count: signupsCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('affiliate_id', user.id);
      if (typeof signupsCount === 'number') signups = signupsCount;

      // Example: clicks from referral_clicks table
      let clicks = 0;
      const { count: clicksCount } = await supabase
        .from('referral_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('affiliate_id', user.id);
      if (typeof clicksCount === 'number') clicks = clicksCount;

      // Example: conversions from referrals table (where converted = true)
      let conversions = 0;
      const { count: conversionsCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('affiliate_id', user.id)
        .eq('converted', true);
      if (typeof conversionsCount === 'number') conversions = conversionsCount;

      setStats({ earnings, clicks, signups, conversions });

      // 4. Fetch recent activity (combine from relevant tables)
      const { data: recentSignups } = await supabase
        .from('referrals')
        .select('referred_email, created_at')
        .eq('affiliate_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      const { data: recentPayouts } = await supabase
        .from('payouts')
        .select('amount, created_at')
        .eq('affiliate_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      const mergedActivity = [
        ...(recentSignups || []).map(s => ({
          type: 'signup',
          message: `${s.referred_email} signed up`,
          time: new Date(s.created_at).toLocaleString(),
        })),
        ...(recentPayouts || []).map(p => ({
          type: 'payout',
          message: `$${p.amount} payout sent`,
          time: new Date(p.created_at).toLocaleString(),
        })),
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setActivity(mergedActivity.slice(0, 5));
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCopyLink = () => {
    if (!profile) return;
    navigator.clipboard.writeText(`https://yourapp.com/register?ref=${profile.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!profile) return <div className="p-8 text-center">No affiliate profile found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 flex flex-col items-center bg-gradient-to-br from-blue-100 to-white border-0 shadow-md">
            <DollarSign className="h-6 w-6 text-green-600 mb-1" />
            <div className="text-lg font-bold text-green-700">${stats.earnings.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Earnings</div>
          </Card>
          <Card className="p-4 flex flex-col items-center bg-gradient-to-br from-purple-100 to-white border-0 shadow-md">
            <User className="h-6 w-6 text-blue-600 mb-1" />
            <div className="text-lg font-bold text-blue-700">{stats.signups}</div>
            <div className="text-xs text-gray-500">Signups</div>
          </Card>
          <Card className="p-4 flex flex-col items-center bg-gradient-to-br from-yellow-100 to-white border-0 shadow-md">
            <BarChart2 className="h-6 w-6 text-purple-600 mb-1" />
            <div className="text-lg font-bold text-purple-700">{stats.clicks}</div>
            <div className="text-xs text-gray-500">Clicks</div>
          </Card>
          <Card className="p-4 flex flex-col items-center bg-gradient-to-br from-green-100 to-white border-0 shadow-md">
            <ArrowDownCircle className="h-6 w-6 text-yellow-600 mb-1" />
            <div className="text-lg font-bold text-yellow-700">{stats.conversions}</div>
            <div className="text-xs text-gray-500">Conversions</div>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Earnings Chart - Bar Graph */}
          <Card className="p-6 bg-white border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-gray-900">Earnings Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ earnings: { color: '#2563eb', label: 'Earnings' } }}>
                <BarChart data={activity.map(a => ({ ...a, earnings: a.amount || 0 }))} width={400} height={250}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="earnings" fill="#2563eb" barSize={32} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          {/* Recent Activity Feed */}
          <Card className="p-6 bg-white border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-gray-900">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-gray-100">
                {activity.length === 0 ? (
                  <li className="py-3 text-gray-400 text-center">No recent activity.</li>
                ) : (
                  activity.map((a, i) => (
                    <li key={i} className="py-3 flex items-center gap-3">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
                      <span className="flex-1 text-gray-800">{a.message}</span>
                      <span className="text-xs text-gray-500">{a.time}</span>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard; 