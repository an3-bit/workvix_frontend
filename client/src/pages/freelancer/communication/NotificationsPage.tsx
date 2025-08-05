import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { Bell, Clock, DollarSign, User, MessageSquare, Briefcase } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog'; // Assuming Dialog is used for modals
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client'; // Using supabase for real-time
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: string; // Use string as type can be more varied
  title?: string; // Title might be optional based on merged data
  message: string;
  read: boolean;
  created_at: string;
  job_id?: string;
  bid_id?: string;
  chat_id?: string;
  offer_id?: string;
  job?: { // Included from FreelancerNotifications
    id: string;
    title: string;
    budget: number;
  };
  client?: { // Included from FreelancerNotifications
    first_name: string;
    last_name: string;
  };
}

// Define PAGE_SIZE for pagination, assuming FreelancerNotifications didn't have it explicitly
const PAGE_SIZE = 20;

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // Added pagination state
  const [hasMore, setHasMore] = useState(true); // Added pagination state
  const [selectedJob, setSelectedJob] = useState<Notification['job'] | null>(null); // For job modal
  const [showJobModal, setShowJobModal] = useState(false); // For job modal
  const [showPaymentModal, setShowPayment] = useState(false); // For payment modal
  const [paymentMessage, setPaymentMessage] = useState(''); // For payment modal message
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user && !authLoading) {
      fetchNotifications(page);
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
    }
  }, [user, authLoading, page]); // Added page to dependency array

  useEffect(() => {
    // Mark all as read when the page loads, only for authenticated users
    if (user && !authLoading) {
      const markAll = async () => {
        try {
          // Using api.notifications.markAllAsRead as it was present in one file
          await api.notifications.markAllAsRead();
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }
      };
      markAll();
    }
  }, [user, authLoading]); // Dependency array ensures it runs when user/authLoading changes

  const getNotificationTitle = (n: Notification): string => {
    // Merged logic from ClientNotification, adapted for Freelancer types
    switch (n.type) {
      case 'job_posted': return 'New Job Posted';
      case 'bid_accepted': return 'Your Bid Was Accepted!';
      case 'bid_rejected': return 'Bid Not Selected';
      case 'payment_received':
      case 'order_paid': return 'Payment Received';
      case 'new_message': return 'New Message';
      case 'new_offer': return 'New Offer Received';
      default: return n.title || 'Notification';
    }
  };

  const fetchNotifications = async (pageNum = 0) => {
    setLoading(true);
    try {
      if (!user) {
        navigate('/signin');
        setLoading(false);
        return;
      }

      // Using api.notifications.getAll from NotificationsPage.tsx
      // Assuming this API handles pagination if implemented server-side, or we need to adjust it.
      // For now, just fetching all and handling pagination client-side if necessary.
      const notificationsData = await api.notifications.getAll();

      // Transform raw notifications to match Notification interface, handling potential missing fields
      const transformed = (notificationsData || []).map((n: any) => ({
        id: n.id,
        type: n.type,
        title: getNotificationTitle(n), // Use the merged title logic
        message: n.message || '', // Ensure message is a string
        created_at: n.created_at,
        read: n.read,
        job_id: n.job_id,
        bid_id: n.bid_id,
        chat_id: n.chat_id,
        offer_id: n.offer_id,
        job: n.job,
        client: n.client,
      }));

      setNotifications(transformed);
      // Basic client-side pagination simulation if API doesn't handle it
      setHasMore(transformed.length === PAGE_SIZE);

      // Mark all unread notifications as read after fetching and displaying
      try {
        await api.notifications.markAllAsRead();
      } catch (error) {
        console.error('Error marking notifications as read after fetch:', error);
      }

    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return null;

    // Using the channel name from FreelancerNotifications as it includes user_id filter
    const channel = supabase
      .channel('notifications_changes_freelancer')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${currentUser.id}`
      }, () => {
        fetchNotifications(page); // Fetch notifications when a new one arrives
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${currentUser.id}`
      }, () => {
        fetchNotifications(page); // Fetch notifications when one is updated (e.g., read status)
      })
      .subscribe();

    return channel;
  };


  const markAsRead = async (notificationId: string) => {
    try {
      await api.notifications.markAsRead(notificationId);
      // Optimistically update UI
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read.',
        variant: 'destructive',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_posted':
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case 'bid_accepted':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'bid_rejected':
        return <User className="h-5 w-5 text-red-600" />;
      case 'payment_received':
      case 'order_paid':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'new_message':
        return <MessageSquare className="h-5 w-5 text-purple-600" />;
      case 'new_offer':
        return <DollarSign className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTimeAgo = (dateString: string): React.ReactNode => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) {
      const mins = Math.floor(diff / 60);
      return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
    }
    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    if (diff < 604800) {
      const days = Math.floor(diff / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    // Otherwise, show date
    return date.toLocaleDateString();
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id); // Use the consolidated markAsRead
    }

    // Navigate based on notification type and available IDs (merged logic)
    switch (notification.type) {
      case 'job_posted':
        if (notification.job && notification.job.id) {
          navigate(`/jobs/${notification.job.id}`, { state: { job: notification.job, notification } });
        } else {
           // Fallback or show job details in a modal if job data is in notification
           setSelectedJob(notification.job || null); // Set selected job for modal
           setShowJobModal(true); // Show job details modal
        }
        break;
      case 'bid_accepted':
        // Assuming navigation to chat or orders page
        navigate('/chat', { state: { client: notification.client, job: notification.job, notification } });
        break;
      case 'bid_rejected':
        // Navigate back to job details or bids page
        if (notification.job_id) {
           navigate(`/jobs/${notification.job_id}/bids`);
        } else {
           navigate('/freelancer/bids'); // Navigate to general bids page if job_id is missing
        }
        break;
      case 'payment_received':
      case 'order_paid':
        setPaymentMessage(notification.message);
        setShowPayment(true); // Show payment confirmation modal
        break;
      case 'new_message':
      case 'new_offer': // Assuming new offer also goes to chat
        if (notification.chat_id) {
          navigate(`/chat?chat=${notification.chat_id}`);
        } else if (notification.client) {
           // If chat_id is missing but client info is there, navigate to chat with client info
           navigate('/chat', { state: { client: notification.client, notification } });
        } else {
          toast({
            title: 'Error',
            description: 'This message/offer notification is missing a chat link.',
            variant: 'destructive',
          });
        }
        break;
      default:
        // Default navigation, maybe to the dashboard or a generic notifications page
        navigate('/freelancer/dashboard');
        break;
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

      {/* Modals (from FreelancerNotifications) */}
      {/* Job Details Modal */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowJobModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Job: {selectedJob.title}</h2>
            <p className="mb-2">Budget: <span className="font-semibold text-green-600">${selectedJob.budget}</span></p>
            {/* Add more job details if available in the notification data */}
            <p className="mb-4 text-gray-600">Review the job details to decide if you want to bid.</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => {
                setShowJobModal(false);
                // Potentially navigate to the job page to bid
                if (selectedJob.id) {
                  navigate(`/jobs/${selectedJob.id}/bids`);
                }
              }}
            >
              View Job
            </button>
          </div>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPayment(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Payment Received</h2>
            <p className="mb-4 text-gray-600">{paymentMessage}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowPayment(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}


      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600 mt-1">Stay updated with your freelancing activities</p>
                </div>
                {/* Mark all as read button from FreelancerNotifications */}
                 <button
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={async () => {
                    if (!user) return;
                    // Using supabase call from FreelancerNotifications for mark all as read
                    const { error } = await supabase
                      .from('notifications')
                      .update({ read: true })
                      .eq('user_id', user.id)
                      .eq('read', false);
                    if (!error) {
                      fetchNotifications(page); // Refetch to update UI
                      window.dispatchEvent(new Event('notifications-updated')); // Dispatch event if needed elsewhere
                      toast({ title: 'All notifications marked as Read', description: 'You have no unread notifications.', variant: 'success' });
                    } else {
                       toast({ title: 'Error', description: 'Failed to mark all notifications as read.', variant: 'destructive' });
                    }
                  }}
                >
                  Mark all as read
                </button>
              </div>

              <div className="divide-y divide-gray-200">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                    <p className="text-gray-500">You'll see notifications about jobs, bids, and messages here.</p>
                  </div>
                ) : (
                  // Display notifications (structure from FreelancerNotifications)
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                      tabIndex={0}
                      role="button"
                      onKeyPress={e => { if (e.key === 'Enter') handleNotificationClick(notification); }}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className={`text-sm ${!notification.read ? 'font-bold text-gray-900' : 'font-normal text-gray-700'}`}>
                              {notification.title} {/* Using the generated title */}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {formatTimeAgo(notification.created_at)}
                              </span>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full inline-block"></span>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>

                          {notification.job && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">
                                  {notification.job.title}
                                </span>
                                <span className="text-sm font-medium text-green-600">
                                  ${notification.job.budget}
                                </span>
                              </div>
                            </div>
                          )}

                          {notification.client && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">
                                From: {notification.client.first_name} {notification.client.last_name}
                              </span>
                            </div>
                          )}
                           {/* Additional badges/spans from the second file */}
                            {notification.type === 'job_posted' && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Click to view job and place bid
                                </span>
                              </div>
                            )}
                            {notification.type === 'new_message' && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  Click to open chat
                                </span>
                              </div>
                            )}
                            {notification.type === 'bid_accepted' && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Bid accepted - Click to chat
                                </span>
                              </div>
                            )}
                            {notification.type === 'bid_rejected' && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Bid not selected
                                </span>
                              </div>
                            )}
                             {notification.type === 'new_offer' && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  New offer received
                                </span>
                              </div>
                            )}
                             {notification.type === 'order_paid' && (
                              <div className="mt-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Order complete
                                </span>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
             {/* Pagination controls (from NotificationsPage.tsx) */}
             {notifications.length > 0 && ( // Only show pagination if there are notifications
                <div className="flex justify-between items-center mt-8">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0 || loading} // Disable while loading or on first page
                    title="Go to previous page"
                    aria-label="Go to previous page"
                  >
                    Previous
                  </button>
                  <span>Page {page + 1}</span>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50"
                    onClick={() => setPage((p) => hasMore ? p + 1 : p)}
                    disabled={!hasMore || loading} // Disable while loading or if no more pages
                    title="Go to next page"
                    aria-label="Go to next page"
                  >
                    Next
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotificationsPage;