import { useState, useEffect, useRef } from 'react';
import { Clock, DollarSign, Tag, Search, Filter, Eye, Send, X, AlertCircle, MessageSquare, ArrowRight, MapPin, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import NotificationSystem from '@/components/Notification';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

// Job Details Modal Component
const JobDetailsModal = ({ job, isOpen, onClose }) => {
  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{job.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Job Meta Information */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 pb-4 border-b">
            <span className="flex items-center bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              ${job.budget}
            </span>
            <span className="flex items-center bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Posted {new Date(job.created_at).toLocaleDateString()}
            </span>
            <span className="flex items-center bg-purple-100 text-purple-800 px-2 sm:px-3 py-1 rounded-full">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              {job.category}
            </span>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">{job.description}</p>
            </div>
          </div>

          {/* Additional Job Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Budget</h4>
              <p className="text-blue-700 text-lg sm:text-xl font-bold">${job.budget}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Category</h4>
              <p className="text-green-700 font-medium text-sm sm:text-base">{job.category}</p>
            </div>
          </div>

          {/* Job Status */}
          <div className="bg-yellow-50 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-yellow-900 mb-2 text-sm sm:text-base">Status</h4>
            <span className="bg-yellow-200 text-yellow-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
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
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
            <div>
              <DialogTitle className="text-lg sm:text-xl font-semibold text-yellow-800">
                You Already Bid on This Job
              </DialogTitle>
              <DialogDescription className="text-yellow-700 text-sm sm:text-base">
                You have already submitted a bid for "{job.title}"
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Existing Bid Details */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Your Bid Details:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Your Proposal:</h4>
            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{bid.message}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              onClick={onStartChat}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-sm sm:text-base"
            >
              <MessageSquare className="h-4 w-4" />
              Chat with Client
            </Button>
            <Button
              onClick={onViewAllBids}
              variant="outline"
              className="flex items-center gap-2 text-sm sm:text-base"
            >
              <Eye className="h-4 w-4" />
              View All My Bids
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="text-sm sm:text-base"
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2" 
              onClick={() => onViewDetails(job)}>
            {job.title}
          </h3>
          <p className="text-gray-600 mb-3 line-clamp-3 text-sm sm:text-base">{job.description}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4">
        <span className="flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full">
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          ${job.budget}
        </span>
        <span className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          {new Date(job.created_at).toLocaleDateString()}
        </span>
        <span className="flex items-center bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
          <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          {job.category}
        </span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button 
          onClick={() => onStartBid(job)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm sm:text-base transition-all duration-300 transform hover:scale-105"
        >
          <Send className="h-4 w-4" />
          Start Bid
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onViewDetails(job)}
          className="flex items-center gap-2 text-sm sm:text-base"
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [jobDetailsModal, setJobDetailsModal] = useState({ isOpen: false, job: null });
  const [existingBidModal, setExistingBidModal] = useState({ isOpen: false, bid: null, job: null });
  const [checkingBid, setCheckingBid] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  let searchTimeout = useRef<number | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
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
        title: "Error",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkExistingBid = async (jobId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return null;
      }

      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('job_id', jobId)
        .eq('freelancer_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking existing bid:', error);
      }

      return data;
    } catch (error) {
      console.error('Error checking existing bid:', error);
      return null;
    }
  };

  const handleStartBid = async (job) => {
    setCheckingBid(true);
    try {
      const existingBid = await checkExistingBid(job.id);
      
      if (existingBid) {
        setExistingBidModal({
          isOpen: true,
          bid: existingBid,
          job: job
        });
      } else {
        navigate(`/jobs/${job.id}/bid`);
      }
    } catch (error) {
      console.error('Error handling bid start:', error);
    } finally {
      setCheckingBid(false);
    }
  };

  const handleViewDetails = (job) => {
    setJobDetailsModal({ isOpen: true, job });
  };

  const handleStartChat = () => {
    // Navigate to chat or open chat modal
    navigate('/chat');
    setExistingBidModal({ isOpen: false, bid: null, job: null });
  };

  const handleViewAllBids = () => {
    navigate('/freelancer-bids');
    setExistingBidModal({ isOpen: false, bid: null, job: null });
  };

  const setupRealtime = () => {
    const channel = supabase
      .channel('jobs_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'jobs' },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <Nav2 />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center py-12 sm:py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm sm:text-base">Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <Nav2 />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Browse Jobs</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Find the perfect project to work on</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={navigateToPostJob}
          >
            <span className="text-sm sm:text-base">Post a Job</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Box */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for services..."
                className="search-input rounded-l-md border-r-0"
                style={{ minWidth: 0 }}
                value={searchQuery}
                onChange={async (e) => {
                  const value = e.target.value;
                  setSearchQuery(value);

                  // Debounce: clear previous timeout
                  if (searchTimeout.current) clearTimeout(searchTimeout.current);

                  if (value.trim() === '') {
                    setSearchResults([]);
                    setShowResults(false);
                    return;
                  }

                  // Debounce search by 300ms
                  searchTimeout.current = window.setTimeout(async () => {
                    setSearchLoading(true);
                    setShowResults(true);
                    // Query jobs table for title/description match
                    const { data, error } = await supabase
                      .from('jobs')
                      .select('*')
                      .or(`title.ilike.%${value}%,description.ilike.%${value}%`)
                      .limit(5);

                    setSearchLoading(false);
                    if (!error && data) {
                      setSearchResults(data);
                    } else {
                      setSearchResults([]);
                    }
                  }, 300);
                }}
                onFocus={() => {
                  if (searchResults.length > 0) setShowResults(true);
                }}
                onBlur={() => {
                  setTimeout(() => setShowResults(false), 200); // Delay to allow click
                }}
              />
            </div>
            
            {/* Filter Button - for mobile */}
            <div className="lg:hidden">
              <Button 
                className="w-full flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 py-3"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
          
          {/* Category Pills */}
          {categories.length > 0 && (
            <div className={`mt-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`px-3 py-2 rounded-full text-xs sm:text-sm cursor-pointer transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={handleClearFilters}
                    className="px-3 py-2 rounded-full text-xs sm:text-sm cursor-pointer transition-colors bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Jobs List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
            <div className="col-span-full bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto opacity-30" />
              </div>
              <h3 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                {jobs.length > 0
                  ? "We couldn't find any jobs matching your criteria. Try adjusting your filters."
                  : "There are no jobs posted yet. Be the first to post a job!"}
              </p>
              {jobs.length > 0 && (
                <Button 
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm sm:text-base"
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
            <div className="bg-white rounded-xl p-6 flex items-center gap-3 shadow-xl">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 text-sm sm:text-base">Checking bid status...</span>
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

      {showResults && (
        <div className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 rounded-b-md shadow-lg max-h-64 overflow-y-auto">
          {searchLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map(job => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="block px-4 py-2 hover:bg-gray-100 text-gray-800"
                onClick={() => setShowResults(false)}
              >
                <div className="font-medium">{job.title}</div>
                <div className="text-xs text-gray-500">{job.description?.slice(0, 60)}...</div>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No results found.</div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default JobsPage;