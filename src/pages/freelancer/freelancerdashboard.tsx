
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Briefcase, 
  User, 
  Bell, 
  Settings, 
  LogOut, 
  Search, 
  Star, 
  Clock, 
  DollarSign,
  FileText,
  CheckCircle,
  Award,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';

// Types
interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  created_at: string;
  category: string;
  client: {
    first_name: string;
    last_name: string;
  };
}

interface Bid {
  id: string;
  amount: number;
  message: string;
  delivery_time: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  job: {
    title: string;
    client: {
      first_name: string;
      last_name: string;
    };
  };
}

const FreelancerDashboard: React.FC = () => {
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [myBids, setMyBids] = useState<Bid[]>([]);
  const [stats, setStats] = useState({
    totalBids: 0,
    acceptedBids: 0,
    pendingBids: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/signin');
        return;
      }

      // Fetch available jobs (not posted by current user and not already bid on)
      const { data: jobsData } = await supabase
        .from('jobs')
        .select(`
          *,
          client:client_id (first_name, last_name)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch user's bids
      const { data: bidsData } = await supabase
        .from('bids')
        .select(`
          *,
          job:job_id (
            title,
            client:client_id (first_name, last_name)
          )
        `)
        .eq('freelancer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Calculate stats
      const totalBids = bidsData?.length || 0;
      const acceptedBids = bidsData?.filter(bid => bid.status === 'accepted').length || 0;
      const pendingBids = bidsData?.filter(bid => bid.status === 'pending').length || 0;
      const totalEarnings = bidsData?.filter(bid => bid.status === 'accepted')
        .reduce((sum, bid) => sum + Number(bid.amount), 0) || 0;

      setAvailableJobs(jobsData || []);
      setMyBids(bidsData || []);
      setStats({
        totalBids,
        acceptedBids,
        pendingBids,
        totalEarnings
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
              <p className="text-gray-600">Find great projects and grow your freelance business</p>
            </div>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium"
            >
              <Search className="h-5 w-5" />
              Browse Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Bids</p>
                <p className="text-2xl font-semibold mt-1">{stats.totalBids}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FileText size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Accepted Bids</p>
                <p className="text-2xl font-semibold mt-1">{stats.acceptedBids}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pending Bids</p>
                <p className="text-2xl font-semibold mt-1">{stats.pendingBids}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Earnings</p>
                <p className="text-2xl font-semibold mt-1">${stats.totalEarnings}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <DollarSign size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Available Jobs and My Bids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Jobs */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Latest Jobs</h2>
                <button
                  onClick={() => navigate('/jobs')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {availableJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No jobs available</p>
                  <p className="text-sm text-gray-400 mt-2">Check back later for new opportunities</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{job.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-500">
                              By: {job.client?.first_name} {job.client?.last_name}
                            </span>
                            <span className="text-sm font-medium text-green-600">Budget: ${job.budget}</span>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {job.category}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/jobs/${job.id}/bid`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium ml-4"
                        >
                          Bid Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* My Bids */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">My Bids</h2>
                <button
                  onClick={() => navigate('/bids')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
            </div>
            <div className="p-6">
              {myBids.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bids yet</p>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Browse jobs to start bidding
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {myBids.map((bid) => (
                    <div key={bid.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{bid.job?.title}</h3>
                          <p className="text-sm text-gray-600">
                            Client: {bid.job?.client?.first_name} {bid.job?.client?.last_name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{bid.message}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm font-medium text-green-600">Your bid: ${bid.amount}</span>
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
              onClick={() => navigate('/jobs')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Search className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium">Browse Jobs</span>
            </button>
            
            <button
              onClick={() => navigate('/bids')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium">My Bids</span>
            </button>
            
            <button
              onClick={() => navigate('/chat')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium">Messages</span>
            </button>
            
            <button
              onClick={() => navigate('/freelancer/profile')}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <User className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
