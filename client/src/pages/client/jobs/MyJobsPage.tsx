import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  MessageSquare, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';

interface Job {
  id: number;
  client_id: number;
  title: string;
  description: string;
  budget: number;
  min_budget?: number;
  max_budget?: number;
  category: string;
  urgency?: string;
  deadline?: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  created_at: string;
  updated_at: string;
  attachment_url?: string;
  bids_count: number;
  assigned_freelancer_id?: number;
  assigned_freelancer?: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
}

interface JobStats {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  totalSpent: number;
  averageBids: number;
}

const MyJobs: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stats, setStats] = useState<JobStats>({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalSpent: 0,
    averageBids: 0
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, statusFilter, categoryFilter]);

  const fetchJobs = async () => {
    try {
      // In a real app, you'd want to get the client_id from your auth system
      const response = await fetch('http://localhost:5000/jobs');
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const jobsData = await response.json();
      
      // If your backend doesn't provide bids_count and assigned_freelancer,
      // you might need additional API calls here to get that data
      // For now, I'll assume your backend returns all necessary data
      
      setJobs(jobsData);
      calculateStats(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your jobs.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (jobsData: Job[]) => {
    const totalJobs = jobsData.length;
    const activeJobs = jobsData.filter(job => job.status === 'open' || job.status === 'in_progress').length;
    const completedJobs = jobsData.filter(job => job.status === 'completed').length;
    const totalSpent = jobsData
      .filter(job => job.status === 'completed')
      .reduce((sum, job) => sum + job.budget, 0);
    const averageBids = jobsData.length > 0 
      ? jobsData.reduce((sum, job) => sum + (job.bids_count || 0), 0) / jobsData.length 
      : 0;

    setStats({
      totalJobs,
      activeJobs,
      completedJobs,
      totalSpent,
      averageBids: Math.round(averageBids * 10) / 10
    });
  };

  const filterJobs = () => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.category && job.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(job => job.category === categoryFilter);
    }

    setFilteredJobs(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'disputed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <TrendingUp className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'disputed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewJob = (jobId: number) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleViewBids = (jobId: number) => {
    navigate(`/client/bids?job=${jobId}`);
  };

  const handleChatWithFreelancer = (jobId: number, freelancerId: number) => {
    navigate(`/client/chat?job=${jobId}&freelancer=${freelancerId}`);
  };

  const handleCancelJob = async (jobId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/jobs/${jobId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel job');
      }

      toast({
        title: 'Job Cancelled',
        description: 'The job has been cancelled successfully.',
      });

      fetchJobs();
    } catch (error) {
      console.error('Error cancelling job:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel job.',
        variant: 'destructive',
      });
    }
  };

  const categories = [
    'Web Development', 'Mobile Development', 'Design & Creative', 'Writing & Translation',
    'Digital Marketing', 'Video & Animation', 'Music & Audio', 'Programming & Tech',
    'Business', 'Data'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav2 />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
                  <p className="text-gray-600 mt-1">Manage all your posted jobs and track their progress</p>
                </div>
                <Button 
                  onClick={() => navigate('/post-job')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Jobs</p>
                      <p className="text-xl font-bold text-gray-900">{stats.totalJobs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Jobs</p>
                      <p className="text-xl font-bold text-gray-900">{stats.activeJobs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-xl font-bold text-gray-900">{stats.completedJobs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <DollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-xl font-bold text-gray-900">${stats.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-full">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Bids</p>
                      <p className="text-xl font-bold text-gray-900">{stats.averageBids}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="disputed">Disputed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Jobs List */}
            {filteredJobs.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-4">
                    {jobs.length === 0 
                      ? "You haven't posted any jobs yet. Get started by posting your first job!"
                      : "No jobs match your current filters. Try adjusting your search criteria."
                    }
                  </p>
                  {jobs.length === 0 && (
                    <Button onClick={() => navigate('/post-job')}>
                      Post Your First Job
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {job.title}
                              </h3>
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {job.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {getStatusIcon(job.status)}
                              <Badge className={getStatusColor(job.status)}>
                                {job.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Budget</p>
                              <p className="font-semibold text-gray-900">
                                ${job.budget.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Category</p>
                              <p className="font-semibold text-gray-900">{job.category}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Bids</p>
                              <p className="font-semibold text-gray-900">{job.bids_count || 0}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Posted</p>
                              <p className="font-semibold text-gray-900">
                                {new Date(job.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {job.assigned_freelancer && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-4">
                              <p className="text-sm text-blue-800 mb-1">
                                <strong>Assigned to:</strong> {job.assigned_freelancer.first_name} {job.assigned_freelancer.last_name}
                              </p>
                              <p className="text-xs text-blue-600">{job.assigned_freelancer.email}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 lg:flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewJob(job.id)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                          
                          {(job.bids_count || 0) > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewBids(job.id)}
                              className="flex items-center gap-2"
                            >
                              <Users className="h-4 w-4" />
                              View Bids ({job.bids_count || 0})
                            </Button>
                          )}

                          {job.assigned_freelancer && job.assigned_freelancer_id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleChatWithFreelancer(job.id, job.assigned_freelancer_id!)}
                              className="flex items-center gap-2"
                            >
                              <MessageSquare className="h-4 w-4" />
                              Chat
                            </Button>
                          )}

                          {job.status === 'open' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelJob(job.id)}
                              className="flex items-center gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Cancel Job
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MyJobs;