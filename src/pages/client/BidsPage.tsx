import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Star, Clock, MessageSquare, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

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
    email: string;
    bio?: string;
    skills?: string[];
  };
  job: {
    title: string;
    description: string;
    budget: number;
  };
}

const BidsPage: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchBids();
    const setupSubscription = async () => {
      const subscription = await setupRealtimeSubscription();
      
      return () => {
        if (subscription) {
          supabase.removeChannel(subscription);
        }
      };
    };
    
    const cleanup = setupSubscription();
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, []);

  const fetchBids = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // First get all job IDs for this client
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('id')
        .eq('client_id', user.id);

      if (!jobsData || jobsData.length === 0) {
        setBids([]);
        setLoading(false);
        return;
      }

      const jobIds = jobsData.map(job => job.id);

      const { data: bidsData, error } = await supabase
        .from('bids')
        .select(`
          *,
          freelancer:freelancer_id (first_name, last_name, email, bio, skills),
          job:job_id (title, description, budget)
        `)
        .in('job_id', jobIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure proper typing
      const typedBids = (bidsData || []).map(bid => ({
        ...bid,
        status: bid.status as 'pending' | 'accepted' | 'rejected'
      })) as Bid[];
      
      setBids(typedBids);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch bids. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const channel = supabase
      .channel('bids_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bids'
      }, () => {
        fetchBids();
      })
      .subscribe();

    return channel;
  };

  const handleBidAction = async (bidId: string, action: 'accept' | 'reject') => {
    try {
      const status = action === 'accept' ? 'accepted' : 'rejected';
      
      const { error } = await supabase
        .from('bids')
        .update({ status })
        .eq('id', bidId);

      if (error) throw error;

      toast({
        title: `Bid ${action}ed`,
        description: `You have successfully ${action}ed this bid.`,
      });

      if (action === 'accept') {
        navigate(`/checkout/${bidId}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing bid:`, error);
      toast({
        title: 'Error',
        description: `Failed to ${action} bid. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const filteredBids = bids.filter(bid => 
    filter === 'all' || bid.status === filter
  );

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
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Bids Received</h1>
            <p className="text-gray-600 mt-2">Manage proposals from freelancers</p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="flex border-b">
              {['all', 'pending', 'accepted', 'rejected'].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption as any)}
                  className={`px-6 py-3 font-medium capitalize ${
                    filter === filterOption
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filterOption} ({bids.filter(b => filterOption === 'all' || b.status === filterOption).length})
                </button>
              ))}
            </div>
          </div>

          {/* Bids List */}
          {filteredBids.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="max-w-md mx-auto">
                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No bids yet</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'Bids from freelancers will appear here when they apply to your jobs.'
                    : `No ${filter} bids found.`
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBids.map((bid) => (
                <div key={bid.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {bid.job?.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {bid.delivery_time}
                        </span>
                        <span className="font-medium text-green-600">${bid.amount}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {bid.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {bid.freelancer?.first_name?.charAt(0)}{bid.freelancer?.last_name?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {bid.freelancer?.first_name} {bid.freelancer?.last_name}
                            </h4>
                            <div className="flex items-center mt-1">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                              <span className="text-sm text-gray-600">New Freelancer</span>
                            </div>
                            {bid.freelancer?.skills && bid.freelancer.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {bid.freelancer.skills.slice(0, 3).map((skill, index) => (
                                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/chat/${bid.freelancer_id}?job=${bid.job_id}`)}
                              className="flex items-center gap-1"
                            >
                              <MessageSquare className="h-4 w-4" />
                              Chat
                            </Button>
                            {bid.status === 'pending' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleBidAction(bid.id, 'reject')}
                                  className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  <X className="h-4 w-4" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleBidAction(bid.id, 'accept')}
                                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                  Accept
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 mt-3">{bid.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BidsPage;
