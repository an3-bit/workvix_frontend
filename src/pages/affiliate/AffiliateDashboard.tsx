import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { TrendingUp, DollarSign, Users, Link2, ClipboardList, BarChart2, UserPlus, Activity, Bell, UserCircle, Search } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';

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
const AffiliateNavBar = () => (
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
    {/* Right: Notifications & User */}
    <div className="flex items-center gap-4">
      <button className="relative p-2 rounded-full hover:bg-blue-50 transition">
        <Bell className="h-6 w-6 text-blue-600" />
        {/* Notification dot */}
        <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
      </button>
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
        <UserCircle className="h-7 w-7" />
      </div>
    </div>
  </nav>
);

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

const AffiliateDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Example stats (replace with real data as needed)
  const stats = [
    { label: 'Total Referrals', value: 128, icon: <Users className="h-6 w-6 text-blue-600" /> },
    { label: 'Commissions Earned', value: '$1,250', icon: <DollarSign className="h-6 w-6 text-green-600" /> },
    { label: 'Clicks', value: 2340, icon: <TrendingUp className="h-6 w-6 text-purple-600" /> },
    { label: 'Conversion Rate', value: '5.4%', icon: <BarChart2 className="h-6 w-6 text-orange-500" /> },
  ];
  const recentActivity = [
    { type: 'Referral', desc: 'New client signed up', date: '2h ago', icon: <UserPlus className="h-5 w-5 text-blue-500" /> },
    { type: 'Commission', desc: 'Earned $50 commission', date: '1d ago', icon: <DollarSign className="h-5 w-5 text-green-500" /> },
    { type: 'Click', desc: 'Referral link clicked', date: '3d ago', icon: <Link2 className="h-5 w-5 text-purple-500" /> },
    { type: 'Activity', desc: 'Account verified', date: '5d ago', icon: <Activity className="h-5 w-5 text-orange-500" /> },
  ];
  // Example chart data
  const chartData = [
    { month: 'Jan', Referrals: 10, Commissions: 120 },
    { month: 'Feb', Referrals: 18, Commissions: 180 },
    { month: 'Mar', Referrals: 25, Commissions: 250 },
    { month: 'Apr', Referrals: 22, Commissions: 210 },
    { month: 'May', Referrals: 30, Commissions: 320 },
    { month: 'Jun', Referrals: 28, Commissions: 300 },
    { month: 'Jul', Referrals: 35, Commissions: 400 },
    { month: 'Aug', Referrals: 40, Commissions: 450 },
    { month: 'Sep', Referrals: 38, Commissions: 420 },
    { month: 'Oct', Referrals: 45, Commissions: 500 },
    { month: 'Nov', Referrals: 50, Commissions: 600 },
    { month: 'Dec', Referrals: 55, Commissions: 700 },
  ];

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  return (
    <>
      {/* Topbar and sidebar are now in AffiliateLayout */}
      {/* Main dashboard content only */}
      {/* ... stats, chart, activity, quick actions ... */}
      {/* (move all main content here, remove outer divs) */}
      {/* ... existing dashboard content ... */}
    </>
  );
};

export default AffiliateDashboard; 