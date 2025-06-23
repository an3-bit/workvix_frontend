import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Calendar, User, MessageSquare, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
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
    skills?: string[];
    hourly_rate?: number;
  };
  job: {
    title: string;
    budget: number;
    category: string;
  };
}

const ClientBidsPage: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // State to manage loading for individual chat initiation to prevent multiple clicks
  const [chatInitiatingBidId, setChatInitiatingBidId] = useState<string | null>(null);

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
    
    // Call setupSubscription and handle its return
    let cleanupFn: (() => void) | undefined;
    setupSubscription().then(fn => {
        cleanupFn = fn;
    });

    return () => {
        if (cleanupFn) {
            cleanupFn();
        }
    };
  }, []);

  const fetchBids = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // Get client's jobs first
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('client_id', user.id);

      if (jobsError) throw jobsError;

      if (!jobsData || jobsData.length === 0) {
        setLoading(false);
        return;
      }

      const jobIds = jobsData.map(job => job.id);

      // Fetch bids for client's jobs
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select(`
          *,
          freelancer:freelancer_id (
            first_name,
            last_name,
            email,
            skills,
            hourly_rate
          ),
          job:job_id (
            title,
            budget,
            category
          )
        `)
        .in('job_id', jobIds)
        .order('created_at', { ascending: false });

      if (bidsError) throw bidsError;

      // Type the data properly
      const typedBids = (bidsData || []).map(bid => ({
        ...bid,
        status: bid.status as 'pending' | 'accepted' | 'rejected'
      })) as Bid[];

      setBids(typedBids);
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch bids',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Use a unique channel name if this page is often mounted/unmounted
    const channel = supabase
      .channel('bids_changes_client_page')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bids'
      }, (payload) => {
        // Only re-fetch if the new bid is relevant to this client's jobs
        // (i.e., for a job they posted)
        const newBid = payload.new as Bid;
        const relevantJobIds = bids.map(b => b.job_id); // Get current job IDs
        if (relevantJobIds.includes(newBid.job_id)) {
            fetchBids(); // Re-fetch to update list
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE', // Listen for status updates
        schema: 'public',
        table: 'bids'
      }, (payload) => {
        const updatedBid = payload.new as Bid;
        setBids(prevBids => prevBids.map(bid => 
            bid.id === updatedBid.id ? updatedBid : bid
        ));
      })
      .subscribe();

    return channel;
  };

  const handleAcceptBid = async (bid: Bid) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Start a transaction-like operation
      // First, reject all other bids for the same job (pending bids only)
      const { error: rejectOthersError } = await supabase
        .from('bids')
        .update({ status: 'rejected' })
        .eq('job_id', bid.job_id)
        .neq('id', bid.id)
        .eq('status', 'pending'); // Only reject other pending bids

      if (rejectOthersError) {
        console.error('Error rejecting other bids:', rejectOthersError);
        // Do not throw here, continue with accepting the bid
      }

      // Update the selected bid status to accepted
      const { error: bidUpdateError } = await supabase
        .from('bids')
        .update({ status: 'accepted' })
        .eq('id', bid.id);

      if (bidUpdateError) throw bidUpdateError;

      // Update job status to in_progress and assign freelancer
      const { error: jobUpdateError } = await supabase
        .from('jobs')
        .update({ 
          status: 'in_progress',
          assigned_freelancer_id: bid.freelancer_id
        })
        .eq('id', bid.job_id);

      if (jobUpdateError) throw jobUpdateError;

      // Create notification for freelancer
      try {
        await supabase
          .from('notifications')
          .insert([{
            user_id: bid.freelancer_id,
            type: 'bid_accepted',
            message: `Your bid for "${bid.job.title}" has been accepted!`,
            metadata: { bid_id: bid.id, job_id: bid.job_id },
            read: false,
          }]);
      } catch (notificationError) {
        console.error('Notification for accepted bid failed:', notificationError);
      }

      // Ensure chat exists for this job/client/freelancer
      const { data: existingChat, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .eq('job_id', bid.job_id)
        .eq('client_id', user.id)
        .eq('freelancer_id', bid.freelancer_id)
        .single();
      if (!existingChat) {
        // Create chat
        await supabase
          .from('chats')
          .insert([{
            job_id: bid.job_id,
            client_id: user.id,
            freelancer_id: bid.freelancer_id
          }]);
      }

      toast({
        title: 'Bid Accepted',
        description: 'The freelancer has been notified and a chat has been created.',
      });
      fetchBids();
    } catch (error: any) {
      console.error('Error accepting bid:', error);
      toast({
        title: 'Error',
        description: `Failed to accept bid: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleRejectBid = async (bid: Bid) => {
    try {
      // Update bid status to rejected
      const { error } = await supabase
        .from('bids')
        .update({ status: 'rejected' })
        .eq('id', bid.id);

      if (error) throw error;

      // Create notification for freelancer
      try {
        await supabase
          .from('notifications')
          .insert([{
            user_id: bid.freelancer_id,
            type: 'bid_rejected',
            message: `Your bid for "${bid.job.title}" was not selected.`,
            metadata: { bid_id: bid.id, job_id: bid.job_id },
            read: false,
          }]);
      } catch (notificationError) {
        console.error('Notification creation failed:', notificationError);
      }

      toast({
        title: 'Bid Rejected',
        description: 'The freelancer has been notified.',
      });

      fetchBids();
    } catch (error: any) {
      console.error('Error rejecting bid:', error);
      toast({
        title: 'Error',
        description: `Failed to reject bid: ${error.message}`,
        variant: 'destructive',
      });
    }
  };

  const handleStartChat = async (bid: Bid) => {
    setChatInitiatingBidId(bid.id); // Set loading state for this specific bid button
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !bid.job_id || !bid.freelancer_id) {
        toast({
          title: 'Error',
          description: 'Missing user, job, or freelancer information to start chat.',
          variant: 'destructive',
        });
        return;
      }

      // Check if a chat already exists for this job, client, and freelancer
      const { data: existingChat, error: existingChatError } = await supabase
        .from('chats')
        .select('id')
        .eq('job_id', bid.job_id)
        .eq('client_id', user.id)
        .eq('freelancer_id', bid.freelancer_id)
        .single();

      if (existingChatError && existingChatError.code !== 'PGRST116') { // PGRST116 means "no rows found"
        // This is a real error other than "not found"
        throw existingChatError;
      }

      let chatId: string;
      if (existingChat) {
        // Chat exists, use its ID
        chatId = existingChat.id;
        toast({
            title: 'Chat Found',
            description: 'Continuing existing conversation.',
        });
      } else {
        // No existing chat, create a new one
        const { data: newChat, error: newChatError } = await supabase
          .from('chats')
          .insert({
            job_id: bid.job_id,
            client_id: user.id,
            freelancer_id: bid.freelancer_id,
            created_at: new Date().toISOString(), // Ensure created_at is set for ordering
            updated_at: new Date().toISOString(), // Ensure updated_at is set
          })
          .select('id')
          .single();

        if (newChatError) {
          // This is where RLS errors often manifest if direct insert is not allowed
          console.error("Error creating new chat:", newChatError.message);
          if (newChatError.code === '42501') { // PostgreSQL permission denied error code
            toast({
              title: 'Permission Denied',
              description: 'You do not have permission to create a chat. Please check RLS policies on `chats` table.',
              variant: 'destructive',
            });
          }
          throw newChatError; // Re-throw to be caught by outer catch block
        }
        chatId = newChat.id;
        toast({
            title: 'New Chat Started',
            description: 'You can now message the freelancer.',
        });
      }

      // Navigate to the chat page with the actual chat ID
      navigate(`/client/chat?chat=${chatId}`);

    } catch (error: any) {
      console.error('Detailed error starting chat:', error);
      toast({
        title: 'Chat Error',
        description: `Failed to start chat: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setChatInitiatingBidId(null); // Reset loading state
    }
  };

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
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Bids Received</h1>
              <p className="text-gray-600 mt-2">Review proposals from talented freelancers</p>
            </div>

            {bids.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No bids yet</h3>
                  <p className="text-gray-600">
                    Once freelancers start bidding on your jobs, they'll appear here.
                  </p>
                  <Button className="mt-4" onClick={() => navigate('/post-job')}>
                    Post a New Job
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {bids.map((bid) => (
                  <Card key={bid.id} className="shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{bid.job.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <Badge variant="outline">{bid.job.category}</Badge>
                            <span className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Budget: ${bid.job.budget}
                            </span>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            bid.status === 'accepted' ? 'default' :
                            bid.status === 'rejected' ? 'destructive' : 'secondary'
                          }
                        >
                          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Freelancer Info */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                              {bid.freelancer.first_name.charAt(0)}{bid.freelancer.last_name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {bid.freelancer.first_name} {bid.freelancer.last_name}
                              </h4>
                              <p className="text-sm text-gray-600">{bid.freelancer.email}</p>
                              {bid.freelancer.hourly_rate && (
                                <p className="text-sm text-gray-600">
                                  ${bid.freelancer.hourly_rate}/hour
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {bid.freelancer.skills && bid.freelancer.skills.length > 0 && (
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2">Skills</h5>
                              <div className="flex flex-wrap gap-2">
                                {bid.freelancer.skills.slice(0, 5).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bid Details */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">Bid Amount</h5>
                              <p className="text-2xl font-bold text-green-600">${bid.amount}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 mb-1">Delivery Time</h5>
                              <p className="text-gray-600">{bid.delivery_time}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className="font-medium text-gray-900 mb-2">Proposal</h5>
                            <p className="text-gray-600 text-sm leading-relaxed">{bid.message}</p>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            Submitted {new Date(bid.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6 pt-4 border-t">
                        {bid.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleAcceptBid(bid)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Accept Bid
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleRejectBid(bid)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {bid.status === 'accepted' && (
                          <Button
                            onClick={() => handleStartChat(bid)}
                            disabled={chatInitiatingBidId === bid.id} // Disable button while chat is initiating
                            className="flex items-center gap-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            {chatInitiatingBidId === bid.id ? 'Starting Chat...' : 'Start Chat'}
                          </Button>
                        )}
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

export default ClientBidsPage;