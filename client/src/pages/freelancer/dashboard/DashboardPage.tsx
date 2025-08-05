import React, { useRef, useEffect, useState } from 'react';
import { Search, Star, Heart, Play, Bookmark, DollarSign, TrendingUp, Calendar, Users, Briefcase, Bell, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
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

interface FreelancerProfile {
  id: string;
  bio?: string;
  skills?: string[];
  hourly_rate?: number;
  portfolio_links?: string[];
  profile_completed: boolean;
}

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newJobsCount, setNewJobsCount] = useState(0);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [userBids, setUserBids] = useState<string[]>([]);
  const [showProfileReminder, setShowProfileReminder] = useState(false);
  const [stats, setStats] = useState<FreelancerStats>({
    totalEarnings: 0,
    activeBids: 0,
    completedJobs: 0,
    rating: 0
  });

  useEffect(() => {
    if (user && !authLoading) {
      fetchFreelancerProfile();
      fetchUserBids();
      fetchNotifications();
      fetchRecommendedJobs();
      fetchFreelancerStats();
    }
  }, [user, authLoading]);

  // Profile completion reminder timer
  useEffect(() => {
    if (profile && !profile.profile_completed) {
      const timer = setInterval(() => {
        setShowProfileReminder(true);
        toast({
          title: 'Complete Your Profile',
          description: 'Complete your profile to get better job recommendations!',
          variant: 'default',
        });
      }, 60 * 60 * 1000); // 1 hour

      return () => clearInterval(timer);
    }
  }, [profile, toast]);

  const fetchFreelancerProfile = async () => {
    try {
      if (!user) return;

      const profileData = await api.users.getProfile();

      if (profileData) {
        const profileCompleted = !!(
          profileData.bio && 
          profileData.skills && 
          profileData.skills.length > 0 && 
          profileData.hourly_rate
        );

        setProfile({
          ...profileData,
          profile_completed: profileCompleted
        });

        if (!profileCompleted) {
          setShowProfileReminder(true);
        }
      }
    } catch (error) {
      console.error('Error fetching freelancer profile:', error);
    }
  };

  const fetchUserBids = async () => {
    try {
      if (!user) return;

      const bidsData = await api.bids.getAll({ freelancer_id: user.id });

      if (bidsData) {
        setUserBids(bidsData.map(bid => bid.job_id));
      }
    } catch (error) {
      console.error('Error fetching user bids:', error);
    }
  };

  const fetchFreelancerStats = async () => {
    try {
      if (!user) return;

      // Fetch bids for this freelancer
      const bidsData = await api.bids.getAll({ freelancer_id: user.id });
      const ordersData = await api.orders.getAll({ freelancer_id: user.id });

      const activeBids = (bidsData || []).filter(bid => bid.status === 'pending').length;

      // Calculate completed jobs (bids with completed orders)
      const completedOrders = (ordersData || []).filter(order => order.status === 'completed');
      const completedJobs = completedOrders.length;

      // Calculate total earnings from completed orders
      const totalEarnings = completedOrders.reduce((sum, order) => sum + Number(order.amount), 0);

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
      if (!user) return;

      // Fetch notifications
      const notificationsData = await api.notifications.getAll();

      setNotifications(notificationsData || []);
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchRecommendedJobs = async () => {
    try {
      const jobsData = await api.jobs.getAll({ status: 'open' });

      // Filter out jobs the user has already bid on
      const availableJobs = (jobsData || []).filter(job => !userBids.includes(job.id));

      // If profile is completed, recommend based on skills
      if (profile?.profile_completed && profile.skills) {
        const matchingJobs = availableJobs.filter(job => 
          profile.skills?.some(skill => 
            job.title.toLowerCase().includes(skill.toLowerCase()) ||
            job.description.toLowerCase().includes(skill.toLowerCase()) ||
            job.category.toLowerCase().includes(skill.toLowerCase())
          )
        );
        
        // Show matching jobs first, then others
        const otherJobs = availableJobs.filter(job => 
          !profile.skills?.some(skill => 
            job.title.toLowerCase().includes(skill.toLowerCase()) ||
            job.description.toLowerCase().includes(skill.toLowerCase()) ||
            job.category.toLowerCase().includes(skill.toLowerCase())
          )
        );
        
        setRecommendedJobs([...matchingJobs.slice(0, 4), ...otherJobs.slice(0, 2)]);
      } else {
        setRecommendedJobs(availableJobs.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBidOnJob = async (jobId: string) => {
    try {
      if (!user) {
        navigate('/signin');
        return;
      }

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

  // Note: Real-time subscriptions will be implemented later with WebSockets or Server-Sent Events

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
      link: "/bids-details/:bidId"
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

  const markAllNotificationsAsRead = async () => {
    if (!user) return;
    try {
      await api.notifications.markAllAsRead();
      setUnreadCount(0);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        {/* Profile Completion Banner */}
        {showProfileReminder && profile && !profile.profile_completed && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6 mx-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-orange-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    Complete your profile to get better job recommendations!
                  </p>
                  <p className="text-sm text-orange-700">
                    Add your bio, skills, and hourly rate to attract more clients.
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link to="/freelancer/profile">
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                    Complete Profile
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowProfileReminder(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          {/* Background Video Sequence */}
          <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
            <VideoSequenceBackground />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-white">
            <div className="flex flex-col lg:flex-row items-start justify-between">
              <div className="max-w-2xl mb-8">
                {/* Removed inline video, now handled by VideoSequenceBackground */}
                <div className="flex items-center mb-4">
                  <h2 className="text-4xl font-bold">Welcome back, Freelancer!</h2>
                  {profile?.profile_completed && (
                    <CheckCircle className="h-6 w-6 text-green-400 ml-3" />
                  )}
                </div>
                <p className="text-lg opacity-90 mb-6">
                  {profile?.profile_completed 
                    ? "Your profile is complete! Browse personalized job recommendations below."
                    : "Ready to take on new challenges? Complete your profile for better job matches."
                  }
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
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile?.profile_completed ? 'Recommended Jobs for You' : 'Available Jobs'}
                </h2>
                {profile?.profile_completed && (
                  <p className="text-sm text-gray-600 mt-1">
                    Based on your skills: {profile.skills?.join(', ')}
                  </p>
                )}
              </div>
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
                      {profile?.profile_completed && profile.skills?.some(skill => 
                        job.title.toLowerCase().includes(skill.toLowerCase()) ||
                        job.description.toLowerCase().includes(skill.toLowerCase()) ||
                        job.category.toLowerCase().includes(skill.toLowerCase())
                      ) && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          ✓ Skill Match
                        </span>
                      )}
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
                <h3 className="text-xl font-medium text-gray-900 mb-2">No new jobs available</h3>
                <p className="text-gray-600">You've viewed or bid on all available jobs. Check back later for new opportunities!</p>
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
                  {unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
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
                  <Link to="/freelancer/profile" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">
                      {profile?.profile_completed ? 'Update Profile' : 'Complete Profile'}
                    </span>
                    <User className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link to="/freelancer/portfolio" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">Manage Portfolio</span>
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </Link>
                  <Link to="/freelancer/earnings" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium">View Earnings</span>
                    <DollarSign className="h-5 w-5 text-gray-400" />
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

const videoSources = [
  '/freelancer/video 1.mp4',
  '/freelancer/video 2.mp4',
  '/freelancer/video 3.mp4',
];

function VideoSequenceBackground() {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(null);
  const [fade, setFade] = useState(false);
  const videoRefs = [useRef(null), useRef(null)];

  // When a video ends, prepare to crossfade to the next
  const handleEnded = () => {
    setNext((current + 1) % videoSources.length);
  };

  // When next is set, trigger a fast crossfade
  useEffect(() => {
    let timer;
    if (next !== null) {
      setFade(true);
      timer = setTimeout(() => {
        setCurrent(next);
        setNext(null);
        setFade(false);
      }, 200); // 0.2s fade duration
    }
    return () => clearTimeout(timer);
  }, [next]);

  return (
    <div className="w-full h-full absolute inset-0">
      {/* Current Video */}
      <video
        ref={videoRefs[0]}
        src={videoSources[current]}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-200 ${fade ? 'opacity-0' : 'opacity-100'}`}
        style={{ zIndex: 0 }}
      />
      {/* Next Video (for crossfade and preloading) */}
      {next !== null && (
        <video
          ref={videoRefs[1]}
          src={videoSources[next]}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}
          style={{ zIndex: 0 }}
        />
      )}
    </div>
  );
}

export default FreelancerDashboard;
