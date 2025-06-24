import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Clock, DollarSign, User, MessageSquare, Send, ArrowLeft, CheckCircle } from 'lucide-react';
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
  const location = useLocation();
  const { toast } = useToast();
  const [job, setJob] = useState<Job | null>(location.state?.job || null);
  const [existingBid, setExistingBid] = useState<Bid | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [bidData, setBidData] = useState({
    amount: '',
    message: '',
    delivery_time: ''
  });

  useEffect(() => {
    if (!job && jobId) {
      fetchJobDetailsAndBid();
    } else if (jobId && job) {
      // If job is already present from state, just check for existing bid
      checkExistingBidForJob(jobId);
      setLoading(false);
    }
  }, [jobId, job]);

  const fetchJobDetailsAndBid = async () => {
    try {
      // Check if user is authenticated first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // Fetch job details and existing bid simultaneously
      const [jobResult, bidResult] = await Promise.all([
        fetchJobDetails(),
        checkExistingBid(user.id)
      ]);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job information.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchJobDetails = async () => {
    try {
      // First fetch the job details
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (jobError) throw jobError;

      if (!jobData) {
        throw new Error('Job not found');
      }

      // Then fetch the client information separately
      let clientData = null;
      if (jobData.client_id) {
        const { data: clientInfo, error: clientError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', jobData.client_id)
          .single();

        if (!clientError && clientInfo) {
          clientData = clientInfo;
        }
      }

      // Combine the data
      const processedJobData: Job = {
        ...jobData,
        client: clientData
      };
      
      setJob(processedJobData);
      return processedJobData;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  };

  const checkExistingBid = async (userId: string) => {
    try {
      const { data: bidData, error } = await supabase
        .from('bids')
        .select('*')
        .eq('job_id', jobId)
        .eq('freelancer_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }

      if (bidData) {
        setExistingBid(bidData);
        return bidData;
      }
      
      return null;
    } catch (error) {
      console.error('Error checking existing bid:', error);
      return null;
    }
  };

  const checkExistingBidForJob = async (jobId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }
      await checkExistingBid(user.id);
    } catch (error) {
      console.error('Error checking existing bid:', error);
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

      // Get freelancer info for notification
      const { data: freelancerData } = await supabase
        .from('freelancers')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single();

      const freelancerName = freelancerData 
        ? `${freelancerData.first_name} ${freelancerData.last_name}`
        : 'A freelancer';

      // Create notification for client
      if (job?.client_id) {
        await supabase
          .from('notifications')
          .insert([{
            user_id: job.client_id,
            type: 'bid_received',
            message: `${freelancerName} submitted a bid for "${job.title}" - $${bidData.amount}`,
            job_id: jobId,
            bid_id: bidResult.id,
            read: false
          }]);
      }

      // Set the bid as submitted and show success message
      setBidSubmitted(true);
      setExistingBid(bidResult);
      setBidData({ amount: '', message: '', delivery_time: '' });

      toast({
        title: 'Bid Submitted Successfully!',
        description: 'Your bid has been submitted. The client will review your proposal and get back to you.',
      });

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
    navigate(`/chat?job=${jobId}`); 
  };

  const handleBackToJobs = () => {
    navigate('/jobs');
  };

  const handleViewAllBids = () => {
    navigate('/bids-details/:bidId');
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

            {/* Existing Bid, Success Message, or Bid Form */}
            {existingBid && !bidSubmitted ? (
              // Show existing bid information
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        You Already Bidded for This Job
                      </h3>
                      <p className="text-yellow-700 mb-4">
                        You have already submitted a bid for this job. Please browse other jobs to find more opportunities.
                      </p>
                      
                      <div className="bg-white rounded-lg p-4 mb-4 border border-yellow-200">
                        <h4 className="font-medium text-gray-900 mb-2">Your Bid Details:</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Amount:</strong> ${existingBid.amount}</p>
                          <p><strong>Delivery Time:</strong> {existingBid.delivery_time}</p>
                          <p><strong>Status:</strong> {existingBid.status.charAt(0).toUpperCase() + existingBid.status.slice(1)}</p>
                          <p><strong>Submitted:</strong> {new Date(existingBid.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4 border border-yellow-200">
                        <h4 className="font-medium text-gray-900 mb-2">Your Proposal:</h4>
                        <p className="text-gray-700 text-sm">{existingBid.message}</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={handleBackToJobs}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Browse Other Jobs
                        </Button>
                        <Button
                          onClick={handleStartChat}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Chat with Client
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleViewAllBids}
                        >
                          View All My Bids
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : bidSubmitted ? (
              // Show success message after bid submission
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-800 mb-2">
                        Bid Submitted Successfully!
                      </h3>
                      <p className="text-green-700 mb-4">
                        Your bid has been submitted and the client has been notified. The client will review your proposal and get back to you soon.
                      </p>
                      
                      <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                        <h4 className="font-medium text-gray-900 mb-2">What happens next?</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• The client will review your bid along with others</li>
                          <li>• You'll receive a notification if the client is interested</li>
                          <li>• If selected, you can start chatting with the client</li>
                          <li>• Check your notifications regularly for updates</li>
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={handleBackToJobs}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Browse Other Jobs
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleViewAllBids}
                        >
                          View All My Bids
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate('/notifications')}
                        >
                          Check Notifications
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Show bid form for new bids
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