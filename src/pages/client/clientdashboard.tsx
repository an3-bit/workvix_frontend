import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Briefcase, 
  User, 
  Bell, 
  Search, 
  Star, 
  Clock,
  Plus,
  FileText
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';

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
    avatar_url: string;
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

const ClientDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recentBids, setRecentBids] = useState<Bid[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalBids: 0,
    completedJobs: 0,
    inProgress: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    setupRealtimeSubscriptions();
    
    return () => {
      // Clean up subscriptions when component unmounts
      supabase.removeAllSubscriptions();
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/signin');
        return;
      }

      // Fetch user's jobs
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent bids for user's jobs
      const { data: bidsData } = await supabase
        .from('bids')
        .select(`
          *,
          freelancer:freelancer_id (first_name, last_name, avatar_url),
          job:job_id (title)
        `)
        .in('job_id', jobsData?.map(job => job.id) || [])
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate stats
      const activeJobs = jobsData?.filter(job => job.status === 'open').length || 0;
      const completedJobs = jobsData?.filter(job => job.status === 'completed').length || 0;
      const inProgress = jobsData?.filter(job => job.status === 'in_progress').length || 0;
      const totalBids = bidsData?.length || 0;
      const unread = notificationsData?.filter(n => !n.read).length || 0;

      setJobs(jobsData || []);
      setRecentBids(bidsData || []);
      setNotifications(notificationsData || []);
      setUnreadCount(unread);
      setStats({
        activeJobs,
        totalBids,
        completedJobs,
        inProgress
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Subscription for new bids
    const bidsSubscription = supabase
      .channel('bids_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bids',
        filter: `job_id=in.(${jobs.map(j => j.id).join(',')})`
      }, (payload) => {
        setRecentBids(prev => [payload.new as Bid, ...prev.slice(0, 4)]);
        setStats(prev => ({ ...prev, totalBids: prev.totalBids + 1 }));
        
        // Add notification
        const newNotification = {
          type: 'bid_received',
          message: `New bid received for ${payload.new.job.title}`,
          read: false,
          bid_id: payload.new.id,
          job_id: payload.new.job_id
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        setUnreadCount(prev => prev + 1);
      })
      .subscribe();

    // Subscription for job status changes
    const jobsSubscription = supabase
      .channel('jobs_changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'jobs',
        filter: `client_id=eq.${user.id}`
      }, (payload) => {
        setJobs(prev => prev.map(job => 
          job.id === payload.new.id ? payload.new as Job : job
        ));
        
        // Update stats based on status changes
        if (payload.new.status !== payload.old.status) {
          setStats(prev => {
            let newStats = { ...prev };
            
            // Decrement old status
            if (payload.old.status === 'open') newStats.activeJobs -= 1;
            if (payload.old.status === 'in_progress') newStats.inProgress -= 1;
            if (payload.old.status === 'completed') newStats.completedJobs -= 1;
            
            // Increment new status
            if (payload.new.status === 'open') newStats.activeJobs += 1;
            if (payload.new.status === 'in_progress') newStats.inProgress += 1;
            if (payload.new.status === 'completed') newStats.completedJobs += 1;
            
            return newStats;
          });
          
          // Add notification for status change
          if (payload.new.status === 'in_progress') {
            const newNotification = {
              type: 'job_started',
              message: `Job "${payload.new.title}" has started`,
              read: false,
              job_id: payload.new.id
            };
            setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
            setUnreadCount(prev => prev + 1);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bidsSubscription);
      supabase.removeChannel(jobsSubscription);
    };
  };

  const handleCardClick = (type: string) => {
    switch(type) {
      case 'activeJobs':
        navigate('/client/jobs?status=open');
        break;
      case 'totalBids':
        navigate('/client/bids');
        break;
      case 'completedJobs':
        navigate('/client/jobs?status=completed');
        break;
      case 'inProgress':
        navigate('/client/jobs?status=in_progress');
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      {/* Welcome Section */}
      <div className="bg-white shadow-sm border-b pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-gray-600">Manage your projects and find talented freelancers</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/notifications')}
                className="relative p-2 rounded-full hover:bg-gray-100"
              >
                <Bell className="h-6 w-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => navigate('/post-job')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium"
              >
                <Plus className="h-5 w-5" />
                Post a Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick('activeJobs')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Jobs</p>
                <p className="text-2xl font-semibold mt-1">{stats.activeJobs}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Briefcase size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick('totalBids')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Bids</p>
                <p className="text-2xl font-semibold mt-1">{stats.totalBids}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FileText size={24} className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick('completedJobs')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed Jobs</p>
                <p className="text-2xl font-semibold mt-1">{stats.completedJobs}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Star size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
          
          <div 
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCardClick('inProgress')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">In Progress</p>
                <p className="text-2xl font-semibold mt-1">{stats.inProgress}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock size={24} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs and Bids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Jobs</h2>
                <button
                  onClick={() => navigate('/client/jobs')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {jobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No jobs posted yet</p>
                  <button
                    onClick={() => navigate('/post-job')}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Post your first job
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-500">Budget: ${job.budget}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              job.status === 'open' ? 'bg-green-100 text-green-800' :
                              job.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              job.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {job.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/jobs/${job.id}/bids`)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium ml-4"
                        >
                          View Bids
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Bids */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Bids</h2>
                <button
                  onClick={() => navigate('/client/bids')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentBids.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bids yet</p>
                  <p className="text-sm text-gray-400 mt-2">Bids will appear here when freelancers apply to your jobs</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBids.map((bid) => (
                    <div key={bid.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            {bid.freelancer?.avatar_url ? (
                              <img 
                                src={bid.freelancer.avatar_url} 
                                alt={`${bid.freelancer.first_name} ${bid.freelancer.last_name}`}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {bid.freelancer?.first_name} {bid.freelancer?.last_name}
                              </h3>
                              <p className="text-sm text-gray-600">{bid.job?.title}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{bid.message}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm font-medium text-green-600">${bid.amount}</span>
                            <span className="text-sm text-gray-500">Delivery: {bid.delivery_time}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {bid.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/chat/${bid.freelancer_id}?job=${bid.job_id}`)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium ml-4"
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/post-job')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Post Job</span>
            </button>
            
            <button
              onClick={() => navigate('/client/bids')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">View Bids</span>
            </button>
            
            <button
              onClick={() => navigate('/chat')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium">Messages</span>
            </button>
            
            <button
              onClick={() => navigate('/client/profile')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <User className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientDashboard;