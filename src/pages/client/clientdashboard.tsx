import React, { useState, useEffect, useRef } from 'react';
import { Search, Users, TrendingUp, DollarSign, Star, Bell, Briefcase, Calendar, AlertCircle, UserCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from 'recharts';
import { saveAs } from 'file-saver';
import MinimalFooter from '@/components/MinimalFooter';

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  created_at: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  category: string;
}

interface Bid {
  id: string;
  amount: number;
  message: string;
  delivery_time: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  freelancer_id: string;
  job_id: string;
  freelancer: {
    first_name: string;
    last_name: string;
  };
  job: {
    title: string;
  };
}

interface Notification {
  id: string;
  type: 'bid_received' | 'bid_accepted' | 'job_started' | 'job_completed';
  message: string;
  read: boolean;
  created_at: string;
  bid_id?: string;
  job_id?: string;
}

const CLIENT_VIDEOS = [
  '/client/client 1.mp4',
  '/client/client 2.mp4',
  '/client/client 3.mp4',
];

const ClientHeroVideo: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(false);
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const [active, setActive] = useState(0); // 0 or 1

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let fadeTimeout: NodeJS.Timeout;
    const playNext = () => {
      setFade(true);
      fadeTimeout = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % CLIENT_VIDEOS.length);
        setActive((a) => 1 - a);
        setFade(false);
      }, 600); // 600ms crossfade
    };
    timeout = setTimeout(playNext, 6000); // 6s per video
    return () => {
      clearTimeout(timeout);
      clearTimeout(fadeTimeout);
    };
  }, [current]);

  // Preload next video
  useEffect(() => {
    const nextIdx = (current + 1) % CLIENT_VIDEOS.length;
    const nextRef = videoRefs[1 - active].current;
    if (nextRef) {
      nextRef.load();
    }
  }, [current, active]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {[0, 1].map((idx) => {
        const videoIdx = (current + idx) % CLIENT_VIDEOS.length;
        return (
          <video
            key={idx}
            ref={videoRefs[idx]}
            src={CLIENT_VIDEOS[videoIdx]}
            autoPlay
            muted
            loop={false}
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${active === idx ? (fade ? 'opacity-0' : 'opacity-100') : (fade ? 'opacity-100' : 'opacity-0')}`}
            onEnded={() => {}}
          />
        );
      })}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalBids: 0,
    completedJobs: 0,
    inProgressJobs: 0
  });
  const [clientProfile, setClientProfile] = useState<any>(null);
  const [spendingData, setSpendingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const setupSubscriptions = async () => {
      const subscriptions = await setupRealtimeSubscriptions();
      
      return () => {
        if (subscriptions) {
          subscriptions.forEach(channel => supabase.removeChannel(channel));
        }
      };
    };
    
    const cleanup = setupSubscriptions();
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // Fetch client profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      setClientProfile(profileData);

      // Fetch jobs
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch bids for client's jobs
      const { data: bidsData } = await supabase
        .from('bids')
        .select(`
          *,
          freelancer:freelancer_id (first_name, last_name),
          job:job_id (title)
        `)
        .in('job_id', jobsData?.map(job => job.id) || []);

      // Fetch unread count
      const { count, error: countError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      // Fetch latest 5 unread notifications
      const { data: notificationsData, error: dataError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch spending data (monthly aggregation)
      let spending = [];
      try {
        const { data: spendingAgg } = await supabase
          .rpc('get_client_monthly_spending', { client_id: user.id });
        if (spendingAgg && Array.isArray(spendingAgg)) spending = spendingAgg;
      } catch (e) {
        // If the function/view does not exist, keep spending empty
        spending = [];
      }
      setSpendingData(spending);

      // Type the data properly
      const typedJobs = (jobsData || []).map(job => ({
        ...job,
        status: job.status as 'open' | 'in_progress' | 'completed' | 'cancelled'
      })) as Job[];

      const typedBids = (bidsData || []).map(bid => ({
        ...bid,
        status: bid.status as 'pending' | 'accepted' | 'rejected'
      })) as Bid[];

      const typedNotifications = (notificationsData || []).map(notification => ({
        ...notification,
        type: notification.type as 'bid_received' | 'bid_accepted' | 'job_started' | 'job_completed'
      })) as Notification[];

      setJobs(typedJobs);
      setBids(typedBids);
      setNotifications(typedNotifications);
      setUnreadCount(count || 0);

      // Calculate stats
      setStats({
        activeJobs: typedJobs.filter(job => job.status === 'open').length,
        totalBids: typedBids.length,
        completedJobs: typedJobs.filter(job => job.status === 'completed').length,
        inProgressJobs: typedJobs.filter(job => job.status === 'in_progress').length
      });

      // Fetch recent payments
      const fetchRecentPayments = async () => {
        if (!profileData?.id) return;
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', profileData.id)
          .order('created_at', { ascending: false })
          .limit(5);
        if (!error && data && data.length > 0) setRecentPayments(data);
      };
      fetchRecentPayments();
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Listen for new bids on client's jobs
    const bidsSubscription = supabase
      .channel('new_bids')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bids'
      }, async (payload) => {
        // Check if this bid is for one of the client's jobs
        const { data: jobCheck } = await supabase
          .from('jobs')
          .select('id')
          .eq('id', payload.new.job_id)
          .eq('client_id', user.id);

        if (jobCheck && jobCheck.length > 0) {
          // Create notification for client about new bid
          await supabase
            .from('notifications')
            .insert([{
              user_id: user.id,
              type: 'bid_received',
              message: `New bid received for your job`,
              bid_id: payload.new.id,
              job_id: payload.new.job_id,
              read: false
            }]);
          
          fetchDashboardData();
        }
      })
      .subscribe();

    return [bidsSubscription];
  };

  const quickActions = [
    { 
      icon: <Search className="h-6 w-6" />, 
      title: "Post New Job", 
      desc: "Find the right talent",
      link: "/post-job"
    },
    { 
      icon: <Briefcase className="h-6 w-6" />, 
      title: "My Jobs", 
      desc: "Manage your jobs",
      link: "/client/jobs"
    },
    { 
      icon: <Users className="h-6 w-6" />, 
      title: "View Bids", 
      desc: "Review proposals",
      link: "/client/bids"
    },
    { 
      icon: <DollarSign className="h-6 w-6" />, 
      title: "Payments", 
      desc: "Manage transactions"
    }
  ];

  const recentJobs = jobs.slice(0, 3);

  // Format helpers
  const formatCurrency = (num: number) => num?.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) || '$0';
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString();

  // Sample data for demo
  const sampleSpendingData = [
    { month: '2024-01', spending: 1200 },
    { month: '2024-02', spending: 800 },
    { month: '2024-03', spending: 1500 },
    { month: '2024-04', spending: 950 },
    { month: '2024-05', spending: 1700 },
    { month: '2024-06', spending: 1100 },
    { month: '2024-07', spending: 2100 },
  ];
  const displaySpendingData = spendingData.length === 0 ? sampleSpendingData : spendingData;

  // Sample recent payments for demo
  const sampleRecentPayments = [
    { id: 1, amount: 1200, date: '2024-07-01', status: 'Completed' },
    { id: 2, amount: 950, date: '2024-06-15', status: 'Completed' },
    { id: 3, amount: 800, date: '2024-05-28', status: 'Completed' },
  ];

  // Calculate real budget tip
  const currentMonth = new Date().toISOString().slice(0, 7);
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonth = lastMonthDate.toISOString().slice(0, 7);
  const currentSpending = displaySpendingData.find(m => m.month === currentMonth)?.spending || 0;
  const lastSpending = displaySpendingData.find(m => m.month === lastMonth)?.spending || 0;
  let budgetTip = '';
  if (lastSpending > 0) {
    const percent = Math.round(((currentSpending - lastSpending) / lastSpending) * 100);
    if (percent > 0) {
      budgetTip = `You spent ${percent}% more this month than last month.`;
    } else if (percent < 0) {
      budgetTip = `Great job! You reduced your spending by ${Math.abs(percent)}% compared to last month.`;
    } else {
      budgetTip = "Your spending is the same as last month.";
    }
  } else if (currentSpending > 0) {
    budgetTip = "This is your first month of spending!";
  } else {
    budgetTip = "No spending data for this or last month.";
  }

  // Helper to convert payments to CSV
  function paymentsToCSV(payments) {
    if (!payments.length) return '';
    const headers = Object.keys(payments[0]);
    const rows = payments.map(p => headers.map(h => JSON.stringify(p[h] ?? '')).join(','));
    return [headers.join(','), ...rows].join('\n');
  }
  // Download CSV for most recent payment
  const handleDownloadInvoice = () => {
    const payment = recentPayments.length > 0 ? recentPayments[0] : sampleRecentPayments[0];
    const csv = paymentsToCSV([payment]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `invoice_${payment.id}.csv`);
  };
  // Download CSV for all recent payments
  const handleExportCSV = () => {
    const payments = recentPayments.length > 0 ? recentPayments : sampleRecentPayments;
    const csv = paymentsToCSV(payments);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'payments.csv');
  };

  // Helper to get icon for notification type
  function getNotificationIcon(type: string) {
    switch (type) {
      case 'bid_received':
        return <DollarSign className="h-4 w-4 text-blue-600" />;
      case 'bid_accepted':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'bid_rejected':
        return <UserCircle className="h-4 w-4 text-red-600" />;
      case 'job_posted':
        return <Briefcase className="h-4 w-4 text-blue-600" />;
      case 'job_started':
        return <Briefcase className="h-4 w-4 text-green-600" />;
      case 'job_completed':
        return <Briefcase className="h-4 w-4 text-green-600" />;
      case 'payment_received':
      case 'order_paid':
        return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'new_message':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  }

  // Helper to show relative time
  function timeAgo(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      <div className="pt-4 pb-8">
        {/* Loading and Error States */}
        {loading && <div className="text-center py-8">Loading...</div>}
        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <ClientHeroVideo />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20"></div>
          <div className="container mx-auto px-4 relative z-10 text-white">
            <div className="flex flex-col lg:flex-row items-start justify-between">
              <div className="max-w-2xl mb-8">
                <h2 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">Welcome back, Client!</h2>
                <p className="text-2xl md:text-3xl opacity-90 mb-10 font-medium drop-shadow">Manage your projects, review proposals, and find the perfect freelancers for your needs.</p>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-7 w-7" />
                      <div>
                        <p className="text-3xl font-bold">{stats.activeJobs}</p>
                        <p className="text-base opacity-80">Active Jobs</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center space-x-2">
                      <Users className="h-7 w-7" />
                      <div>
                        <p className="text-3xl font-bold">{stats.totalBids}</p>
                        <p className="text-base opacity-80">Total Bids</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-7 w-7" />
                      <div>
                        <p className="text-3xl font-bold">{stats.inProgressJobs}</p>
                        <p className="text-base opacity-80">In Progress</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center space-x-2">
                      <Star className="h-7 w-7" />
                      <div>
                        <p className="text-3xl font-bold">{stats.completedJobs}</p>
                        <p className="text-base opacity-80">Completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-start">
                <Link to="/post-job">
                  <button className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 rounded-full font-bold text-xl shadow-lg transition-all duration-200">
                    Post a Job →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Card (original, above spending/side) */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 mb-8">
            <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                action.link ? (
                  <Link key={index} to={action.link}>
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                      <span className="text-blue-600">{action.icon}</span>
                      <div>
                        <h4 className="font-medium text-gray-900">{action.title}</h4>
                        <p className="text-sm text-gray-600">{action.desc}</p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg cursor-default">
                    <span className="text-blue-600">{action.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.desc}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </section>

        {/* Spending Overview + Sidebar (clean, less crowded) */}
        <section className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Main Card */}
            <div className="flex-1 bg-white/60 backdrop-blur-lg border border-white/40 shadow-lg rounded-2xl p-6 mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-900">
                <DollarSign className="h-5 w-5 text-blue-600" /> Spending Overview
              </h3>
              {/* Key Stat */}
              <div className="mb-4">
                <span className="block text-xs text-gray-500 mb-1">Total Spent</span>
                <span className="text-2xl font-bold text-blue-900">{formatCurrency(displaySpendingData.reduce((sum, m) => sum + (m.spending || 0), 0))}</span>
              </div>
              {/* Chart */}
              <div className="bg-white/80 rounded-xl p-2 shadow-inner mb-2">
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={displaySpendingData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis tickFormatter={formatCurrency} stroke="#64748b" fontSize={11} />
                    <Tooltip formatter={formatCurrency} contentStyle={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #0001' }} />
                    <Line type="monotone" dataKey="spending" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: '#2563eb' }} activeDot={{ r: 5, fill: '#1e40af' }} name="Spending" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {/* Show Details Toggle */}
              <ShowDetails formatCurrency={formatCurrency} displaySpendingData={displaySpendingData} />
            </div>
            {/* Sidebar Accordion */}
            <div className="w-full md:w-80 flex-shrink-0">
              <SidebarAccordion
                recentPayments={recentPayments}
                sampleRecentPayments={sampleRecentPayments}
                formatCurrency={formatCurrency}
                budgetTip={budgetTip}
                handleDownloadInvoice={handleDownloadInvoice}
                handleExportCSV={handleExportCSV}
              />
            </div>
          </div>
        </section>

        {/* Your Updates: Recent Activity & Recent Jobs side by side */}
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Your Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-4 w-full max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Recent Activity</span>
                {unreadCount > 0 && (
                  <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </div>
              <ul className="divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <li className="py-2 text-gray-400 text-center">No recent activity</li>
                ) : (
                  notifications.slice(0, 3).map(n => (
                    <li key={n.id} className="py-2 flex items-center gap-2">
                      {getNotificationIcon(n.type)}
                      <span className="text-sm text-gray-800">{n.message}</span>
                      <span className="ml-auto text-xs text-gray-400">{timeAgo(n.created_at)}</span>
                    </li>
                  ))
                )}
              </ul>
              <a href="/client/notifications" className="block text-blue-600 text-xs mt-2 text-right hover:underline">
                View all →
              </a>
            </div>
            {/* Recent Jobs */}
            <div className="bg-white rounded-lg shadow p-4 w-full max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4">Recent Jobs</h3>
              {recentJobs.length === 0 ? (
                <div className="text-gray-400 text-center py-4">No jobs posted yet.</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentJobs.map(job => (
                    <li key={job.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-xs text-gray-500">{formatDate(job.created_at)} • {job.status}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatCurrency(job.budget)}</div>
                        <Link to={`/client/jobs/${job.id}`} className="text-blue-600 hover:underline text-sm ml-4">View</Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
      <MinimalFooter />
    </div>
  );
};

function ShowDetails({ formatCurrency, displaySpendingData }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(o => !o)} className="text-xs text-blue-600 underline mb-2">{open ? 'Hide Details' : 'Show Details'}</button>
      {open && (
        <div className="flex flex-wrap gap-4 mt-2">
          <div className="flex flex-col items-center">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold text-xs mb-1">
              <TrendingUp className="h-3 w-3" /> Avg/Month
            </span>
            <span className="text-base font-bold text-green-800">{formatCurrency(displaySpendingData.reduce((sum, m) => sum + (m.spending || 0), 0) / displaySpendingData.length)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-xs mb-1">
              <Calendar className="h-3 w-3" /> This Month
            </span>
            <span className="text-base font-bold text-yellow-700">{formatCurrency(displaySpendingData.find(m => m.month === new Date().toISOString().slice(0,7))?.spending || 0)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarAccordion({ recentPayments, sampleRecentPayments, formatCurrency, budgetTip, handleDownloadInvoice, handleExportCSV }) {
  const [open, setOpen] = useState('payments');
  return (
    <div className="rounded-2xl bg-white/90 border border-white/60 shadow p-3">
      {/* Recent Payments Accordion */}
      <div>
        <button onClick={() => setOpen(open === 'payments' ? '' : 'payments')} className="w-full flex items-center justify-between py-2 px-2 text-sm font-semibold text-green-900 focus:outline-none">
          <span className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-600" /> Recent Payments</span>
          <span>{open === 'payments' ? '−' : '+'}</span>
        </button>
        {open === 'payments' && (
          <ul className="space-y-2 mb-2">
            {(recentPayments.length > 0 ? recentPayments : sampleRecentPayments).map(payment => (
              <li key={payment.id} className="flex items-center justify-between bg-white/90 rounded-lg px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 text-blue-500" />
                  <span className="font-bold text-gray-800 text-sm">{formatCurrency(payment.amount)}</span>
                  <span className="ml-2 text-xs text-gray-500">{new Date(payment.created_at || payment.date).toLocaleDateString()}</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${payment.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{payment.status || 'Completed'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Budget Tip */}
      <div className="mt-2 mb-2 bg-blue-50 border-l-4 border-blue-400 p-2 rounded-lg flex items-start gap-2">
        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
        <div>
          <span className="font-semibold text-blue-700 text-xs">Budget Tip</span>
          <p className="text-xs text-blue-800 mt-0.5">{budgetTip}</p>
        </div>
      </div>
      {/* Quick Actions Accordion */}
      <div>
        <button onClick={() => setOpen(open === 'actions' ? '' : 'actions')} className="w-full flex items-center justify-between py-2 px-2 text-sm font-semibold text-blue-900 focus:outline-none">
          <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-600" /> Quick Actions</span>
          <span>{open === 'actions' ? '−' : '+'}</span>
        </button>
        {open === 'actions' && (
          <div className="flex flex-col gap-1 mt-2">
            <button onClick={handleDownloadInvoice} className="bg-blue-600 text-white rounded-lg px-3 py-2 font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition flex items-center gap-2 text-xs"><DollarSign className="h-3 w-3" /> Download Invoice</button>
            <button onClick={handleExportCSV} className="bg-gray-200 text-gray-800 rounded-lg px-3 py-2 font-semibold hover:bg-gray-300 focus:ring-2 focus:ring-blue-200 transition flex items-center gap-2 text-xs"><TrendingUp className="h-3 w-3" /> Export CSV</button>
            <a href="/client/payments" className="bg-gray-200 text-gray-800 rounded-lg px-3 py-2 font-semibold hover:bg-gray-300 focus:ring-2 focus:ring-blue-200 transition text-center flex items-center gap-2 text-xs"><Calendar className="h-3 w-3" /> View All Payments</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
