import { useState, useEffect } from 'react';
import { Clock, DollarSign, Tag, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import JobCard from '@/components/JobCard';
import NotificationSystem from '@/components/Notification';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  // Load jobs on component mount
  useEffect(() => {
    const loadedJobs = JSON.parse(localStorage.getItem('skillforgeJobs') || '[]');
    setJobs(loadedJobs);
    setFilteredJobs(loadedJobs);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(loadedJobs.map(job => job.category))];
    setCategories(uniqueCategories);
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

  // Simulate navigation to the job posting page
  const navigateToPostJob = () => {
    console.log('Navigating to post job page');
    // In a real app with react-router: navigate('/post-job')
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
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
              <JobCard key={job.id} job={job} />
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
      </div>
    </div>
  );
};

export default JobsPage;