
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, User, Briefcase, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const JobBidsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchJobAndBids = async () => {
      if (!jobId) {
        setError('Job ID not provided.');
        setLoading(false);
        return;
      }

      try {
        // Fetch job details
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (jobError) throw jobError;
        setJob(jobData);

        // Fetch bids for this job with freelancer details
        const { data: bidsData, error: bidsError } = await supabase
          .from('bids')
          .select(`
            *,
            freelancers (
              first_name,
              last_name,
              email
            )
          `)
          .eq('job_id', jobId)
          .order('created_at', { ascending: false });

        if (bidsError) throw bidsError;
        setBids(bidsData || []);
      } catch (err) {
        console.error('Failed to fetch job and bids:', err.message);
        setError('Could not load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndBids();
  }, [jobId]);

  const handleSelectBidder = async (bidId, freelancerId) => {
    try {
      // Update bid status to accepted
      const { error } = await supabase
        .from('bids')
        .update({ status: 'accepted' })
        .eq('id', bidId);

      if (error) throw error;

      toast({
        title: 'Bid Accepted',
        description: 'You have successfully selected this freelancer.',
      });

      navigate(`/checkout/${bidId}`);
    } catch (error) {
      console.error('Error selecting bidder:', error);
      toast({
        title: 'Error',
        description: 'Failed to select bidder. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-lg">Loading job details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">{error}</h2>
          <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
            Back to Dashboard
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
            <div className="bg-blue-600 p-6">
              <h1 className="text-2xl font-bold text-white">{job.title}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-gray-200">
                <span className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {job.category || 'Uncategorized'}
                </span>
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${job.budget || 0}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{job.description || 'No description provided.'}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Bids ({bids.length})</h2>
          
          {bids.length > 0 ? (
            <div className="space-y-6">
              {bids.map((bid) => (
                <div key={bid.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold mr-4">
                        {bid.freelancers?.first_name?.charAt(0) || 'F'}
                        {bid.freelancers?.last_name?.charAt(0) || 'L'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {bid.freelancers?.first_name} {bid.freelancers?.last_name}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                          New Freelancer
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">${bid.amount}</div>
                      <div className="text-sm text-gray-500 flex items-center justify-end mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {bid.delivery_time}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{bid.message}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-gray-600 text-sm">
                      <User className="h-4 w-4 mr-1" />
                      Submitted {new Date(bid.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        onClick={() => navigate(`/chat/${bid.freelancer_id}`)}
                      >
                        Message
                      </Button>
                      {bid.status === 'pending' && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleSelectBidder(bid.id, bid.freelancer_id)}
                        >
                          Select & Proceed
                        </Button>
                      )}
                      {bid.status === 'accepted' && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                          Accepted
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No bids yet</h3>
              <p className="text-gray-600">
                Freelancers haven't started bidding on this job yet. Check back later!
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobBidsPage;
