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
    
    const cleanup = setupSubscription();
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
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

    const channel = supabase
      .channel('bids_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'bids'
      }, () => {
        fetchBids();
      })
      .subscribe();

    return channel;
  };

  const createChatRoom = async (jobId: string, clientId: string, freelancerId: string) => {
    try {
      // First, try to create the chat room with the authenticated user
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .insert([{
          job_id: jobId,
          client_id: clientId,
          freelancer_id: freelancerId,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (chatError) {
        console.error('Direct insert failed:', chatError);
        
        // If direct insert fails due to RLS, try using RPC function as fallback
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('create_chat_room', {
            p_job_id: jobId,
            p_client_id: clientId,
            p_freelancer_id: freelancerId
          });

        if (rpcError) {
          throw new Error(`Failed to create chat room: ${rpcError.message}`);
        }
        
        return rpcData;
      }

      return chatData;
    } catch (error) {
      console.error('Error in createChatRoom:', error);
      throw error;
    }
  };

  const handleAcceptBid = async (bid: Bid) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Start a transaction-like operation
      // First, reject all other bids for the same job
      const { error: rejectOthersError } = await supabase
        .from('bids')
        .update({ status: 'rejected' })
        .eq('job_id', bid.job_id)
        .neq('id', bid.id)
        .eq('status', 'pending');

      if (rejectOthersError) {
        console.error('Error rejecting other bids:', rejectOthersError);
        // Don't throw here, continue with accepting the bid
      }

      // Update the selected bid status to accepted
      const { error: bidError } = await supabase
        .from('bids')
        .update({ status: 'accepted' })
        .eq('id', bid.id);

      if (bidError) throw bidError;

      // Update job status to in_progress
      const { error: jobError } = await supabase
        .from('jobs')
        .update({ 
          status: 'in_progress',
          assigned_freelancer_id: bid.freelancer_id
        })
        .eq('id', bid.job_id);

      if (jobError) throw jobError;

      // Try to create chat room
      let chatData = null;
      try {
        chatData = await createChatRoom(bid.job_id, user.id, bid.freelancer_id);
      } catch (chatError) {
        console.error('Chat creation failed:', chatError);
        // Don't fail the entire operation if chat creation fails
        toast({
          title: 'Bid Accepted',
          description: 'Bid accepted successfully, but chat room creation failed. You can try starting a chat later.',
          variant: 'default',
        });
      }

      // Create notification for freelancer
      try {
        await supabase
          .from('notifications')
          .insert([{
            user_id: bid.freelancer_id,
            type: 'bid_accepted',
            message: `Your bid for "${bid.job.title}" has been accepted! You can now start chatting with the client.`,
            bid_id: bid.id,
            job_id: bid.job_id,
            read: false,
            created_at: new Date().toISOString()
          }]);
      } catch (notificationError) {
        console.error('Notification creation failed:', notificationError);
        // Don't fail the operation if notification fails
      }

      // Create notifications for rejected bidders
      try {
        const { data: rejectedBids } = await supabase
          .from('bids')
          .select('freelancer_id, freelancer(first_name)')
          .eq('job_id', bid.job_id)
          .eq('status', 'rejected')
          .neq('id', bid.id);

        if (rejectedBids && rejectedBids.length > 0) {
          const rejectedNotifications = rejectedBids.map(rejectedBid => ({
            user_id: rejectedBid.freelancer_id,
            type: 'bid_rejected',
            message: `Your bid for "${bid.job.title}" was not selected.`,
            job_id: bid.job_id,
            read: false,
            created_at: new Date().toISOString()
          }));

          await supabase
            .from('notifications')
            .insert(rejectedNotifications);
        }
      } catch (rejectedNotificationError) {
        console.error('Rejected notifications failed:', rejectedNotificationError);
      }

      if (chatData) {
        toast({
          title: 'Bid Accepted',
          description: 'The freelancer has been notified and you can now start chatting.',
        });
      }

      fetchBids();
    } catch (error) {
      console.error('Error accepting bid:', error);
      toast({
        title: 'Error',
        description: `Failed to accept bid: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
            bid_id: bid.id,
            job_id: bid.job_id,
            read: false,
            created_at: new Date().toISOString()
          }]);
      } catch (notificationError) {
        console.error('Notification creation failed:', notificationError);
      }

      toast({
        title: 'Bid Rejected',
        description: 'The freelancer has been notified.',
      });

      fetchBids();
    } catch (error) {
      console.error('Error rejecting bid:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject bid',
        variant: 'destructive',
      });
    }
  };

  const handleStartChat = async (bid: Bid) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check if chat already exists
      const { data: existingChat } = await supabase
        .from('chats')
        .select('id')
        .eq('job_id', bid.job_id)
        .eq('freelancer_id', bid.freelancer_id)
        .single();

      if (existingChat) {
        navigate(`/client/chat?chat=${existingChat.id}`);
      } else {
        // Create new chat
        try {
          const chatData = await createChatRoom(bid.job_id, user.id, bid.freelancer_id);
          navigate(`/client/chat?chat=${chatData.id}`);
        } catch (chatError) {
          throw new Error(`Failed to create chat: ${chatError instanceof Error ? chatError.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: 'Error',
        description: `Failed to start chat: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
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
                            className="flex items-center gap-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Start Chat
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