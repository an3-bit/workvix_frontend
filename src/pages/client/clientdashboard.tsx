import React, { useState, useEffect } from 'react';
import { Search, Users, TrendingUp, DollarSign, Star, Bell, Briefcase, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';

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

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalBids: 0,
    completedJobs: 0,
    inProgressJobs: 0
  });

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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

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

      // Fetch notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

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

      // Calculate stats
      setStats({
        activeJobs: typedJobs.filter(job => job.status === 'open').length,
        totalBids: typedBids.length,
        completedJobs: typedJobs.filter(job => job.status === 'completed').length,
        inProgressJobs: typedJobs.filter(job => job.status === 'in_progress').length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
      icon: <Users className="h-6 w-6" />, 
      title: "View Bids", 
      desc: "Review proposals",
      link: "/client/bids"
    },
    { 
      icon: <DollarSign className="h-6 w-6" />, 
      title: "Payments", 
      desc: "Manage transactions",
      link: "/checkout"
    },
    { 
      icon: <Briefcase className="h-6 w-6" />, 
      title: "My Projects", 
      desc: "Track progress",
      link: "/orders"
    }
  ];

  const recentJobs = jobs.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20 z-0"></div>
          
          <div className="container mx-auto px-4 relative z-10 text-white">
            <div className="flex flex-col lg:flex-row items-start justify-between">
              <div className="max-w-2xl mb-8">
                <h2 className="text-4xl font-bold mb-4">Welcome back, Client!</h2>
                <p className="text-lg opacity-90 mb-6">
                  Manage your projects, review proposals, and find the perfect freelancers for your needs.
                </p>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5" />
                      <div>
                        <p className="text-2xl font-bold">{stats.activeJobs}</p>
                        <p className="text-sm opacity-80">Active Jobs</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <div>
                        <p className="text-2xl font-bold">{stats.totalBids}</p>
                        <p className="text-sm opacity-80">Total Bids</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <div>
                        <p className="text-2xl font-bold">{stats.inProgressJobs}</p>
                        <p className="text-sm opacity-80">In Progress</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5" />
                      <div>
                        <p className="text-2xl font-bold">{stats.completedJobs}</p>
                        <p className="text-sm opacity-80">Completed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="self-start">
                <Link to="/post-job">
                  <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold shadow-md">
                    Post a Job →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.link}>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <span className="text-blue-600">{action.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              {/* Recent Notifications */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Activity
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </h3>
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <div key={notification.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${!notification.read ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <div>
                          <p className="font-medium">{notification.message}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <Link to="/notifications" className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 inline-block">
                  View all notifications →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClientDashboard;
