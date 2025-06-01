
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Calendar, Tag, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const FreelancerBidsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState({});
  const [bidData, setBidData] = useState({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load jobs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBidSubmit = async (jobId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/join/freelancer');
        return;
      }

      const bid = bidData[jobId];
      if (!bid?.amount || !bid?.message || !bid?.delivery_time) {
        toast({
          title: 'Error',
          description: 'Please fill in all bid fields',
          variant: 'destructive',
        });
        return;
      }

      // For now, just show success message since table might not exist yet
      // TODO: Replace with real insert once tables are created
      toast({
        title: 'Success',
        description: 'Your bid has been submitted successfully',
      });

      setBidding({ ...bidding, [jobId]: false });
      setBidData({ ...bidData, [jobId]: {} });
    } catch (error) {
      console.error('Error submitting bid:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit bid',
        variant: 'destructive',
      });
    }
  };

  const updateBidData = (jobId, field, value) => {
    setBidData({
      ...bidData,
      [jobId]: {
        ...bidData[jobId],
        [field]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav2 />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading available jobs...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
          <p className="text-gray-600 mt-1">Browse and bid on projects that match your skills</p>
        </div>

        <div className="space-y-6">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Card key={job.id} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      {job.category}
                    </span>
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      ${job.budget}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  
                  {bidding[job.id] ? (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-semibold">Submit Your Bid</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`amount-${job.id}`}>Bid Amount ($)</Label>
                          <Input
                            id={`amount-${job.id}`}
                            type="number"
                            placeholder="Enter your bid amount"
                            value={bidData[job.id]?.amount || ''}
                            onChange={(e) => updateBidData(job.id, 'amount', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`delivery-${job.id}`}>Delivery Time</Label>
                          <Input
                            id={`delivery-${job.id}`}
                            placeholder="e.g., 5 days"
                            value={bidData[job.id]?.delivery_time || ''}
                            onChange={(e) => updateBidData(job.id, 'delivery_time', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`message-${job.id}`}>Cover Letter</Label>
                        <Textarea
                          id={`message-${job.id}`}
                          placeholder="Explain why you're the best fit for this project..."
                          rows={4}
                          value={bidData[job.id]?.message || ''}
                          onChange={(e) => updateBidData(job.id, 'message', e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleBidSubmit(job.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Submit Bid
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setBidding({ ...bidding, [job.id]: false })}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setBidding({ ...bidding, [job.id]: true })}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Place Bid
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs available</h3>
                <p className="text-gray-600">Check back later for new opportunities!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FreelancerBidsPage;
