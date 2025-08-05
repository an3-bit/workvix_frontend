import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Briefcase, DollarSign, User, Clock, MessageSquare, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface NotificationData {
  id: string;
  type: 'new_bid' | 'bid_accepted' | 'payment_sent' | 'message' | 'bid_rejected' | 'job_posted' | 'job_started' | 'job_completed' | 'payment_received' | 'order_paid' | 'new_message' | 'new_offer';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  job_id?: string;
  bid_id?: string;
  chat_id?: string;
  offer_id?: string;
  bid?: {
    id: string;
    job_title: string;
    amount: number;
    freelancer_name: string;
  };
  freelancer?: {
    first_name: string;
    last_name: string;
  };
}

const PAGE_SIZE = 20;

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [selectedBid, setSelectedBid] = useState<NotificationData['bid'] | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');

  const getNotificationTitle = (n: NotificationData): string => {
    switch (n.type) {
      case 'new_bid': return 'New Bid Received';
      case 'bid_accepted': return 'Bid Accepted';
      case 'bid_rejected': return 'Bid Rejected';
      case 'job_posted': return 'Job Posted';
      case 'job_started': return 'Job Started';
      case 'job_completed': return 'Job Completed';
      case 'payment_received': return 'Payment Received';
      case 'order_paid': return 'Order Paid';
      case 'new_message': return 'New Message';
      case 'new_offer': return 'New Offer Received';
      default: return 'Notification';
    }
  };

  const fetchNotifications = useCallback(async (pageNum = 0) => {
    setLoading(true);
    try {
      if (!user) {
        navigate('/signin');
        return;
      }
      // Assuming the API now returns richer notification data including bid and freelancer details
      const notificationsData: NotificationData[] = await api.notifications.getAll(pageNum, PAGE_SIZE);

      // Add title to each notification for display
      const transformedNotifications = notificationsData.map(n => ({
        ...n,
        title: getNotificationTitle(n),
        // Map bid/freelancer data if present (assuming API provides this)
        bid: n.bid_id ? { id: n.bid_id, job_title: n.message.split(' on ')[1]?.split(' with')[0] || 'Unknown Job', amount: parseFloat(n.message.split('$')[1]?.split(' ')[0]) || 0, freelancer_name: n.message.split(' with ')[1] || 'Unknown Freelancer' } : undefined, // Basic parsing example, adjust based on actual API response
        freelancer: n.message.includes('Freelancer:') ? { first_name: n.message.split('Freelancer: ')[1]?.split(' ')[0] || 'Unknown', last_name: n.message.split('Freelancer: ')[1]?.split(' ')[1] || '' } : undefined, // Basic parsing example, adjust based on actual API response
      }));

      setNotifications(prev => pageNum === 0 ? transformedNotifications : [...prev, ...transformedNotifications]);
      setHasMore((notificationsData?.length || 0) === PAGE_SIZE);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch notifications.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, navigate]); // Added navigate to dependencies

  useEffect(() => {
    if (user && !authLoading) {
      fetchNotifications(page);
    }
  }, [user, authLoading, page, fetchNotifications]); // Added fetchNotifications to dependencies

  // Mark all as read on initial load - reconsider if this is the desired UX
  // useEffect(() => {
  //   if (user && !authLoading && notifications.length > 0) {
  //     const markAllAsRead = async () => {
  //       try {
  //         await api.notifications.markAllAsRead();
  //         setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  //       } catch (error) {
  //         console.error('Error marking notifications as read:', error);
  //       }
  //     };
  //     // Only mark as read if there are unread notifications
  //     if (notifications.some(n => !n.read)) {
  //        markAllAsRead();
  //     }
  //   }
  // }, [user, authLoading, notifications]);


  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await api.notifications.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_bid':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'bid_accepted':
      case 'bid_accepted_by_freelancer': // Assuming this type is also possible from API
        return <User className="h-5 w-5 text-green-600" />;
      case 'bid_rejected':
        return <User className="h-5 w-5 text-red-600" />;
      case 'job_posted':
      case 'job_started':
      case 'job_completed':
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case 'payment_received':
      case 'order_paid':
      case 'payment_sent': // Assuming this type is also possible from API
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'new_message':
      case 'message': // Assuming this type is also possible from API
        return <MessageSquare className="h-5 w-5 text-purple-600" />;
      case 'new_offer':
        return <DollarSign className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };


  const handleNotificationClick = async (notification: NotificationData) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    switch (notification.type) {
      case 'new_bid':
        if (notification.bid && notification.bid.id) {
           navigate(`/client/bids?bidId=${notification.bid.id}`); // Navigate to bids page, maybe highlight the bid
        } else if (notification.bid) {
          // Show modal if detailed bid info is in the notification object itself
          setSelectedBid(notification.bid);
          setShowBidModal(true);
        } else {
           navigate(`/client/bids`); // Navigate to general bids page
        }
        break;
      case 'bid_accepted':
      case 'bid_accepted_by_freelancer':
        // Navigate to the specific order/job related to this accepted bid
        // This requires the notification to have a job_id or order_id
        if (notification.job_id) {
           navigate(`/client/jobs/${notification.job_id}`); // Example: Navigate to job details or orders
        } else if (notification.bid_id) {
           navigate(`/client/bids?bidId=${notification.bid_id}`); // Or back to the bid list
        } else {
           navigate('/client/dashboard'); // Default or error handling
        }
        break;
      case 'bid_rejected':
         navigate(`/client/bids`);
        break;
      case 'job_posted':
        if (notification.job_id) {
           navigate(`/client/jobs/${notification.job_id}`);
        } else {
           navigate(`/client/jobs`);
        }
        break;
      case 'job_started':
      case 'job_completed':
      case 'order_paid':
        if (notification.job_id) {
           navigate(`/client/jobs/${notification.job_id}`); // Navigate to job or order details
        } else if (notification.order_id) {
           navigate(`/client/orders/${notification.order_id}`); // Assuming an orders page
        } else {
           navigate('/client/dashboard');
        }
        break;
      case 'payment_received':
      case 'payment_sent':
        if (notification.order_id) {
           navigate(`/client/orders/${notification.order_id}`); // Navigate to order or payments
        } else {
           navigate('/client/payments');
        }
        break;
      case 'new_message':
      case 'message':
        if (notification.chat_id) {
          navigate(`/client/communication/chat?chatId=${notification.chat_id}`);
        } else {
          // Attempt to navigate to a general chat page or show error
           navigate('/client/communication/chat');
        }
        break;
      case 'new_offer':
        if (notification.offer_id) {
          // Navigate to a page to view/manage offers
           navigate(`/client/offers/${notification.offer_id}`); // Assuming an offers page
        } else {
           navigate('/client/dashboard');
        }
        break;
      default:
        // For any other notification type, navigate to the dashboard or a generic page
        navigate('/client/dashboard');
        break;
    }
  };


  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      {/* Bid Details Modal */}
      {showBidModal && selectedBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowBidModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Bid on: {selectedBid.job_title}</h2>
            <p className="mb-2">Bid Amount: <span className="font-semibold text-green-600">${selectedBid.amount}</span></p>
            <p className="mb-2">Freelancer: <span className="font-semibold">{selectedBid.freelancer_name}</span></p>
            <p className="mb-4 text-gray-600">You can review the bid details here.</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowBidModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Payment Confirmation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPaymentModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Payment Confirmation</h2>
            <p className="mb-4 text-gray-600">{paymentMessage}</p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setShowPaymentModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">Stay updated with your latest activity</p>
            </div>

            {notifications.length === 0 && !loading ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No notifications yet</h3>
                <p className="text-gray-600">
                  You'll receive notifications about job opportunities, bids, and messages here.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'border-l-4 border-l-blue-600 bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={`text-sm font-medium ${
                              !notification.read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                {formatTimeAgo(notification.created_at)}
                              </span>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                           {notification.bid && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">
                                  {notification.bid.job_title}
                                </span>
                                <span className="text-sm font-medium text-green-600">
                                  ${notification.bid.amount}
                                </span>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Freelancer: {notification.bid.freelancer_name}
                              </div>
                            </div>
                          )}
                          {notification.freelancer && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-500">
                                Freelancer: {notification.freelancer.first_name} {notification.freelancer.last_name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-8">
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    title="Go to previous page"
                    aria-label="Go to previous page"
                  >
                    Previous
                  </button>
                  <span>Page {page + 1}</span>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50"
                    onClick={() => setPage((p) => hasMore ? p + 1 : p)}
                    disabled={!hasMore || loading} // Disable next if no more data or currently loading
                    title="Go to next page"
                    aria-label="Go to next page"
                  >
                    Next
                  </button>
                </div>
                {loading && notifications.length > 0 && (
                   <div className="flex justify-center mt-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                   </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotificationsPage;