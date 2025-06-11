import { useState, useEffect } from 'react';
import { Clock, DollarSign, Tag, Search, Filter, Eye, Send, X, AlertCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import NotificationSystem from '@/components/Notification';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

// Job Details Modal Component
const JobDetailsModal = ({ job, isOpen, onClose }) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">{job.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Job Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-4 border-b">
            <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <DollarSign className="h-4 w-4 mr-1" />
              ${job.budget}
            </span>
            <span className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4 mr-1" />
              Posted {new Date(job.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              <Tag className="h-4 w-4 mr-1" />
              {job.category}
            </span>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          {/* Additional Job Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Budget</h4>
              <p className="text-blue-700 text-lg font-bold">${job.budget}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">Category</h4>
              <p className="text-green-700 font-medium">{job.category}</p>
            </div>
          </div>

          {/* Job Status */}
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">Status</h4>
            <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {job.status ? job.status.charAt(0).toUpperCase() + job.status.slice(1) : 'Open'}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Existing Bid Modal Component
const ExistingBidModal = ({ isOpen, onClose, bid, job, onViewAllBids, onStartChat }) => {
  if (!bid || !job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-yellow-800">
                You Already Bid on This Job
              </DialogTitle>
              <DialogDescription className="text-yellow-700">
                You have already submitted a bid for "{job.title}"
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Existing Bid Details */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Your Bid Details:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Amount:</span>
                <p className="text-gray-900 font-bold">${bid.amount}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Delivery Time:</span>
                <p className="text-gray-900">{bid.delivery_time}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Submitted:</span>
                <p className="text-gray-900">{new Date(bid.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Bid Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Your Proposal:</h4>
            <p className="text-gray-700 text-sm leading-relaxed">{bid.message}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button
              onClick={onStartChat}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <MessageSquare className="h-4 w-4" />
              Chat with Client
            </Button>
            <Button
              onClick={onViewAllBids}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View All My Bids
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Enhanced JobCard component with modal functionality
const JobCard = ({ job, onStartBid, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-skillforge-primary cursor-pointer" 
              onClick={() => onViewDetails(job)}>
            {job.title}
          </h3>
          <p className="text-gray-600 mb-3 line-clamp-3">{job.description}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
        <span className="flex items-center">
          <DollarSign className="h-4 w-4 mr-1" />
          ${job.budget}
        </span>
        <span className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {new Date(job.created_at).toLocaleDateString()}
        </span>
        <span className="flex items-center">
          <Tag className="h-4 w-4 mr-1" />
          {job.category}
        </span>
      </div>
      
      <div className="flex gap-3 mt-4">
        <Button 
          onClick={() => onStartBid(job)}
          className="flex items-center gap-2 bg-skillforge-primary hover:bg-skillforge-primary/90"
        >
          <Send className="h-4 w-4" />
          Start Bid
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onViewDetails(job)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </div>
    </div>
  );
};

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingBid, setCheckingBid] = useState(false);
  
  // Modal states
  const [jobDetailsModal, setJobDetailsModal] = useState({ isOpen: false, job: null });
  const [existingBidModal, setExistingBidModal] = useState({ isOpen: false, bid: null, job: null });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load jobs from Supabase
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJobs(data || []);
      setFilteredJobs(data || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data?.map(job => job.category) || [])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch jobs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if user has already bid on a job
  const checkExistingBid = async (jobId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return null;
      }

      const { data: bidData, error } = await supabase
        .from('bids')
        .select('*')
        .eq('job_id', jobId)
        .eq('freelancer_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return bidData;
    } catch (error) {
      console.error('Error checking existing bid:', error);
      return null;
    }
  };

  // Handle Start Bid click
  const handleStartBid = async (job) => {
    setCheckingBid(true);
    
    try {
      const existingBid = await checkExistingBid(job.id);
      
      if (existingBid) {
        // Show existing bid modal
        setExistingBidModal({
          isOpen: true,
          bid: existingBid,
          job: job
        });
      } else {
        // Navigate to bid page
        navigate(`/jobs/${job.id}/bids`);
      }
    } catch (error) {
      console.error('Error handling start bid:', error);
      toast({
        title: 'Error',
        description: 'Failed to check bid status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setCheckingBid(false);
    }
  };

  // Handle View Details click
  const handleViewDetails = (job) => {
    setJobDetailsModal({
      isOpen: true,
      job: job
    });
  };

  // Handle existing bid modal actions
  const handleStartChat = () => {
    const job = existingBidModal.job;
    setExistingBidModal({ isOpen: false, bid: null, job: null });
    navigate(`/chat?job=${job.id}`);
  };

  const handleViewAllBids = () => {
    setExistingBidModal({ isOpen: false, bid: null, job: null });
    navigate('/bids');
  };

  // Set up real-time subscription
  const setupRealtime = () => {
    const subscription = supabase
      .channel('jobs_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jobs' },
        (payload) => {
          // Refresh jobs when there are changes
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  // Initial load and setup real-time
  useEffect(() => {
    fetchJobs();
    const cleanup = setupRealtime();
    return cleanup;
  }, []);

  // Filter jobs when search or category changes
  useEffect(() => {
    let results = jobs;
    
    if (searchTerm) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      results = results.filter(job => job.category === selectedCategory);
    }
    
    setFilteredJobs(results);
  }, [searchTerm, selectedCategory, jobs]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  const navigateToPostJob = () => {
    navigate('/post-job');
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <Nav2 />
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skillforge-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 mt-16">
      <Nav2 />
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
            <p className="text-gray-600 mt-1">Find the perfect project to work on</p>
          </div>
          <Button 
            className="bg-skillforge-primary hover:bg-skillforge-primary/90"
            onClick={navigateToPostJob}
          >
            Post a Job
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Box */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-skillforge-primary focus:outline-none"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            
            {/* Filter Button - for mobile */}
            <div className="md:hidden">
              <Button 
                className="w-full flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
          
          {/* Category Pills */}
          {categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map(category => (
                <div
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                    selectedCategory === category
                      ? 'bg-skillforge-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </div>
              ))}
              {(searchTerm || selectedCategory) && (
                <div
                  onClick={handleClearFilters}
                  className="px-3 py-1 rounded-full text-sm cursor-pointer transition-colors bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Clear Filters
                </div>
              )}
            </div>
          )}
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job}
                onStartBid={handleStartBid}
                onViewDetails={handleViewDetails}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-500 mb-4">
                <Search className="h-12 w-12 mx-auto opacity-30" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                {jobs.length > 0
                  ? "We couldn't find any jobs matching your criteria. Try adjusting your filters."
                  : "There are no jobs posted yet. Be the first to post a job!"}
              </p>
              {jobs.length > 0 && (
                <Button 
                  className="mt-4 bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Loading overlay for bid checking */}
        {checkingBid && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-skillforge-primary"></div>
              <span className="text-gray-700">Checking bid status...</span>
            </div>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        job={jobDetailsModal.job}
        isOpen={jobDetailsModal.isOpen}
        onClose={() => setJobDetailsModal({ isOpen: false, job: null })}
      />

      {/* Existing Bid Modal */}
      <ExistingBidModal
        isOpen={existingBidModal.isOpen}
        onClose={() => setExistingBidModal({ isOpen: false, bid: null, job: null })}
        bid={existingBidModal.bid}
        job={existingBidModal.job}
        onViewAllBids={handleViewAllBids}
        onStartChat={handleStartChat}
      />

      <Footer />
    </div>
  );
};

export default JobsPage;