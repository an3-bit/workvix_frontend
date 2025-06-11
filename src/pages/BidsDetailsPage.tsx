import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Trash2, 
  Eye, 
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

interface BidWithJob {
  id: string;
  amount: number;
  message: string;
  delivery_time: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: string;
  job_id: string;
  job: {
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
  };
}

const BidsDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bids, setBids] = useState<BidWithJob[]>([]);
  const [filteredBids, setFilteredBids] = useState<BidWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [removingBid, setRemovingBid] = useState<string | null>(null);

  useEffect(() => {
    fetchUserBids();
  }, []);

  useEffect(() => {
    filterBids();
  }, [bids, statusFilter]);

  const fetchUserBids = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // Fetch bids with job information
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select(`
          *,
          jobs:job_id (
            id,
            title,
            description,
            budget,
            category,
            created_at,
            client_id
          )
        `)
        .eq('freelancer_id', user.id)
        .order('created_at', { ascending: false });

      if (bidsError) throw bidsError;

      if (bidsData) {
        // Fetch client information for each job
        const bidsWithClientInfo = await Promise.all(
          bidsData.map(async (bid) => {
            if (bid.jobs?.client_id) {
              const { data: clientData } = await supabase
                .from('profiles')
                .select('first_name, last_name, email')
                .eq('id', bid.jobs.client_id)
                .single();

              return {
                ...bid,
                job: {
                  ...bid.jobs,
                  client: clientData
                }
              };
            }
            return {
              ...bid,
              job: bid.jobs
            };
          })
        );

        setBids(bidsWithClientInfo);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your bids. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBids = () => {
    if (statusFilter === 'all') {
      setFilteredBids(bids);
    } else {
      setFilteredBids(bids.filter(bid => bid.status === statusFilter));
    }
  };

  const handleChatWithClient = (jobId: string) => {
    navigate(`/chat?job=${jobId}`);
  };

  const handleRemoveBid = async (bidId: string, jobTitle: string) => {
    setRemovingBid(bidId);
    try {
      const { error } = await supabase
        .from('bids')
        .delete()
        .eq('id', bidId);

      if (error) throw error;

      // Remove the bid from local state
      setBids(prevBids => prevBids.filter(bid => bid.id !== bidId));
      
      toast({
        title: 'Bid Removed',
        description: `Your bid for "${jobTitle}" has been removed successfully.`,
      });
    } catch (error) {
      console.error('Error removing bid:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove bid. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRemovingBid(null);
    }
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'withdrawn':
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav2 />
        <div className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
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
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Bids</h1>
                  <p className="text-gray-600 mt-1">Track and manage all your submitted bids</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/jobs')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Browse Jobs
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Bids</p>
                      <p className="text-xl font-bold text-gray-900">{bids.length}</p>
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
                      <p className="text-sm text-gray-600">Pending</p>
                      <p className="text-xl font-bold text-gray-900">
                        {bids.filter(bid => bid.status === 'pending').length}
                      </p>
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
                      <p className="text-sm text-gray-600">Accepted</p>
                      <p className="text-xl font-bold text-gray-900">
                        {bids.filter(bid => bid.status === 'accepted').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rejected</p>
                      <p className="text-xl font-bold text-gray-900">
                        {bids.filter(bid => bid.status === 'rejected').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-gray-600" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bids</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bids List */}
            {filteredBids.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {statusFilter === 'all' ? 'No Bids Yet' : `No ${statusFilter} Bids`}
                </h3>
                <p className="text-gray-600 mb-6">
                  {statusFilter === 'all' 
                    ? 'Start bidding on jobs to see them here.'
                    : `You don't have any ${statusFilter} bids at the moment.`
                  }
                </p>
                <Button onClick={() => navigate('/jobs')}>
                  Browse Available Jobs
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBids.map((bid) => (
                  <Card key={bid.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left section - Job info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {bid.job?.title}
                              </h3>
                              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                                {bid.job?.description}
                              </p>
                              
                              {/* Job details */}
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  Job Budget: ${bid.job?.budget}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Posted: {new Date(bid.job?.created_at).toLocaleDateString()}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {bid.job?.category}
                                </Badge>
                              </div>

                              {/* Client info */}
                              {bid.job?.client && (
                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                                    {bid.job.client.first_name?.charAt(0)}{bid.job.client.last_name?.charAt(0)}
                                  </div>
                                  <span>
                                    {bid.job.client.first_name} {bid.job.client.last_name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right section - Bid details and actions */}
                        <div className="lg:w-80 lg:flex-shrink-0">
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2 mb-3">
                              {getStatusIcon(bid.status)}
                              <Badge className={`text-xs ${getStatusColor(bid.status)}`}>
                                {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Your Bid:</span>
                                <span className="font-semibold text-gray-900">${bid.amount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Delivery:</span>
                                <span className="text-gray-900">{bid.delivery_time}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Submitted:</span>
                                <span className="text-gray-900">{new Date(bid.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {/* Proposal preview */}
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-600 mb-1">Proposal:</p>
                              <p className="text-sm text-gray-900 line-clamp-3">
                                {bid.message}
                              </p>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleViewJob(bid.job_id)}
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View Job
                            </Button>

                            {(bid.status === 'accepted' || bid.status === 'pending') && (
                              <Button
                                size="sm"
                                onClick={() => handleChatWithClient(bid.job_id)}
                                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                              >
                                <MessageSquare className="h-4 w-4" />
                                Chat
                              </Button>
                            )}

                            {bid.status === 'pending' && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="flex items-center gap-1"
                                    disabled={removingBid === bid.id}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    {removingBid === bid.id ? 'Removing...' : 'Remove'}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Remove Bid</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove your bid for "{bid.job?.title}"? 
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleRemoveBid(bid.id, bid.job?.title || 'this job')}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Remove Bid
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
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

export default BidsDetailsPage;