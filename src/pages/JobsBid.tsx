import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, User, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  created_at: string;
  client_id: string;
  client?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface Bid {
  id: string;
  amount: number;
  message: string;
  delivery_time: string;
  status: string;
  created_at: string;
}

const JobsBid: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [existingBid, setExistingBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bidData, setBidData] = useState({
    amount: '',
    message: '',
    delivery_time: ''
  });

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
      checkExistingBid();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const { data: jobData, error } = await supabase
        .from('jobs')
        .select(`
          *,
          client:client_id (first_name, last_name, email)
        `)
        .eq('id', jobId)
        .single();

      if (error) throw error;
      
      // Handle the case where client data might be missing
      const processedJobData = {
        ...jobData,
        client: Array.isArray(jobData.client) ? jobData.client[0] : jobData.client
      };
      
      setJob(processedJobData);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch job details.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkExistingBid = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: bidData } = await supabase
        .from('bids')
        .select('*')
        .eq('job_id', jobId)
        .eq('freelancer_id', user.id)
        .single();

      if (bidData) {
        setExistingBid(bidData);
      }
    } catch (error) {
      // No existing bid found, which is fine
      console.log('No existing bid found');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBidData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitBid = async () => {
    if (!bidData.amount || !bidData.message || !bidData.delivery_time) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      const { data: bidResult, error } = await supabase
        .from('bids')
        .insert([{
          job_id: jobId,
          freelancer_id: user.id,
          amount: parseFloat(bidData.amount),
          message: bidData.message,
          delivery_time: bidData.delivery_time,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Create notification for client
      if (job?.client_id) {
        await supabase
          .from('notifications')
          .insert([{
            user_id: job.client_id,
            type: 'bid_received',
            message: `New bid received for "${job.title}" - $${bidData.amount}`,
            job_id: jobId,
            bid_id: bidResult.id,
            read: false
          }]);
      }

      toast({
        title: 'Bid Submitted',
        description: 'Your bid has been submitted successfully. The client will be notified.',
      });

      setExistingBid(bidResult);
      setBidData({ amount: '', message: '', delivery_time: '' });
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit bid. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartChat = () => {
    if (job?.client_id) {
      navigate(`/chat/${job.client_id}?job=${jobId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav2 />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-8">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/jobs')}>Browse Other Jobs</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Job Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${job.budget}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {job.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
                <p className="text-gray-600 leading-relaxed">{job.description}</p>
              </div>

              {job.client && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Client Information</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {job.client?.first_name?.charAt(0)}{job.client?.last_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {job.client?.first_name} {job.client?.last_name}
                      </p>
                      <p className="text-sm text-gray-600">{job.client?.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Existing Bid or Bid Form */}
            {existingBid ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Bid</h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-medium mb-2">Bid Submitted Successfully!</p>
                  <div className="text-sm text-green-700">
                    <p><strong>Amount:</strong> ${existingBid.amount}</p>
                    <p><strong>Delivery Time:</strong> {existingBid.delivery_time}</p>
                    <p><strong>Status:</strong> {existingBid.status.charAt(0).toUpperCase() + existingBid.status.slice(1)}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 font-medium mb-2">Your Proposal</p>
                  <p className="text-blue-700">{existingBid.message}</p>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleStartChat}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Start Chat with Client
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/bids')}
                  >
                    View All My Bids
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Submit Your Bid</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bid Amount ($)
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter your bid amount"
                      value={bidData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Time
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g., 3 days, 1 week, 2 weeks"
                      value={bidData.delivery_time}
                      onChange={(e) => handleInputChange('delivery_time', e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Letter / Proposal
                    </label>
                    <Textarea
                      placeholder="Describe why you're the best fit for this job..."
                      value={bidData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full h-32"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleSubmitBid}
                      disabled={submitting}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {submitting ? 'Submitting...' : 'Submit Bid'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/jobs')}
                    >
                      Back to Jobs
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default JobsBid;
