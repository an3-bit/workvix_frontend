
import React from 'react';
import { Search, Star, Heart, Play, Bookmark, DollarSign, TrendingUp, Calendar, Users, Briefcase, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  created_at: string;
  client_id: string;
}

interface FreelancerStats {
  totalEarnings: number;
  activeBids: number;
  completedJobs: number;
  rating: number;
}

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [newJobsCount, setNewJobsCount] = useState(0);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<FreelancerStats>({
    totalEarnings: 0,
    activeBids: 0,
    completedJobs: 0,
    rating: 0
  });

  useEffect(() => {
    fetchNotifications();
    fetchRecommendedJobs();
    fetchFreelancerStats();
    
    const setupSubscriptions = async () => {
      const subscriptions = await setupRealtimeSubscriptions();
      
      return () => {
        if (subscriptions) {
          subscriptions.forEach(subscription => {
            if (subscription) {
              supabase.removeChannel(subscription);
            }
          });
        }
      };
    };
    
    const cleanup = setupSubscriptions();
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, []);

  const fetchFreelancerStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch active bids count
      const { data: bidsData } = await supabase
        .from('bids')
        .select('id, status, amount')
        .eq('freelancer_id', user.id);

      const activeBids = (bidsData || []).filter(bid => bid.status === 'pending').length;

      // Fetch completed jobs (accepted bids)
      const completedBids = (bidsData || []).filter(bid => bid.status === 'accepted');
      const completedJobs = completedBids.length;

      // Calculate total earnings from completed jobs
      const totalEarnings = completedBids.reduce((sum, bid) => sum + Number(bid.amount), 0);

      // For now, set a default rating (you can implement a proper rating system later)
      const rating = completedJobs > 0 ? 4.5 : 0;

      setStats({
        totalEarnings,
        activeBids,
        completedJobs,
        rating
      });
    } catch (error) {
      console.error('Error fetching freelancer stats:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(5);

      setNotifications(notificationsData || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchRecommendedJobs = async () => {
    try {
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setRecommendedJobs(jobsData || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBidOnJob = async (jobId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // Navigate to bid submission page with job ID
      navigate(`/jobs/${jobId}/bids`);
      
      toast({
        title: 'Ready to bid',
        description: 'You can now submit your proposal for this job.',
      });
    } catch (error) {
      console.error('Error handling bid:', error);
      toast({
        title: 'Error',
        description: 'Failed to process bid. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const setupRealtimeSubscriptions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Listen for new jobs being posted
    const jobsSubscription = supabase
      .channel('new_jobs')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'jobs'
      }, async (payload) => {
        setNewJobsCount(prev => prev + 1);
        
        // Create notification for freelancer about new job
        await supabase
          .from('notifications')
          .insert([{
            user_id: user.id,
            type: 'job_posted',
            message: `New job posted: ${payload.new.title}`,
            job_id: payload.new.id,
            read: false
          }]);
        
        fetchNotifications();
        fetchRecommendedJobs();
      })
      .subscribe();

    // Listen for bid status changes
    const bidsSubscription = supabase
      .channel('bid_updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'bids',
        filter: `freelancer_id=eq.${user.id}`
      }, async (payload) => {
        if (payload.new.status !== payload.old.status) {
          const message = payload.new.status === 'accepted' 
            ? 'Your bid has been accepted!' 
            : 'Your bid has been rejected.';
          
          await supabase
            .from('notifications')
            .insert([{
              user_id: user.id,
              type: `bid_${payload.new.status}`,
              message,
              bid_id: payload.new.id,
              read: false
            }]);
          
          fetchNotifications();
          fetchFreelancerStats(); // Refresh stats when bid status changes
        }
      })
      .subscribe();

    return [jobsSubscription, bidsSubscription];
  };

  const quickActions = [
    { 
      icon: <Search className="h-6 w-6" />, 
      title: "Browse Jobs", 
      desc: "Find new opportunities",
      link: "/jobs"
    },
    { 
      icon: <Users className="h-6 w-6" />, 
      title: "My Proposals", 
      desc: "Track your bids",
      link: "/bids"
    },
    { 
      icon: <DollarSign className="h-6 w-6" />, 
      title: "Earnings", 
      desc: "View your income",
      link: "/freelancer/earnings"
    },
    { 
      icon: <Briefcase className="h-6 w-6" />, 
      title: "Portfolio", 
      desc: "Showcase your work",
      link: "/freelancer/portfolio"
    }
  ];

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
                <h2 className="text-4xl font-bold mb-4">Welcome back, Freelancer!</h2>
                <p className="text-lg opacity-90 mb-6">
                  Ready to take on new challenges? Browse the latest opportunities and grow your business.
                </p>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <div>
                        <p className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
                        <p className="text-sm opacity-80">Total Earned</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <div>
                        <p className="text-2xl font-bold">{stats.activeBids}</p>
                        <p className="text-sm opacity-80">Active Bids</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5" />
                      <div>
                        <p className="text-2xl font-bold">{stats.completedJobs}</p>
                        <p className="text-sm opacity-80">Completed</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5" />
                      <div>
                        <p className="text-2xl font-bold">{stats.rating.toFixed(1)}</p>
                        <p className="text-sm opacity-80">Rating</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="self-start">
                <Link to="/jobs">
                  <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold shadow-md relative">
                    Browse Jobs 
                    {newJobsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {newJobsCount}
                      </span>
                    )}
                    →
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

        {/* Recommended Jobs */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Available Jobs for You</h2>
              <Link to="/jobs" className="text-blue-600 hover:text-blue-800 font-medium">
                View All Jobs →
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading jobs...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {job.title}
                      </h3>
                      <button className="text-gray-400 hover:text-red-500">
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {job.category}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-green-600">${job.budget}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New opportunity</span>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleBidOnJob(job.id)}
                      >
                        Start Bid
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && recommendedJobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs available</h3>
                <p className="text-gray-600">Check back later for new opportunities!</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Activity & Notifications */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Notifications
                  {notifications.length > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </h3>
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No new notifications</p>
                  ) : (
                    notifications.slice(0, 3).map((notification, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
                <Link to="/freelancer/notifications" className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 inline-block">
                  View all notifications →
                </Link>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <Link to="/freelancer/portfolio" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">Manage Portfolio</span>
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link to="/freelancer/earnings" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">View Earnings</span>
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link to="/profile" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">Update Profile</span>
                    <Users className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link to="/upgrade" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">Upgrade to Pro</span>
                    <Star className="h-5 w-5 text-gray-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
