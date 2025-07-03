import React, { useState, useEffect } from 'react';
import { Bell, Briefcase, DollarSign, User, Clock, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
  job_id?: string;
  bid_id?: string;
  chat_id?: string;
  offer_id?: string;
}

const PAGE_SIZE = 20;
const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchNotifications = async (pageNum = 0) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }
      const from = pageNum * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data: notificationsData, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(from, to);
      if (error) throw error;
      setNotifications(notificationsData || []);
      setHasMore((notificationsData?.length || 0) === PAGE_SIZE);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const channel = supabase
      .channel('notifications_changes_client')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchNotifications();
      })
      .subscribe();
    return channel;
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bid_received':
        return <DollarSign className="h-5 w-5 text-blue-600" />;
      case 'bid_accepted':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'bid_rejected':
        return <User className="h-5 w-5 text-red-600" />;
      case 'job_posted':
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case 'job_started':
        return <Briefcase className="h-5 w-5 text-green-600" />;
      case 'job_completed':
        return <Briefcase className="h-5 w-5 text-green-600" />;
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

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Navigate based on notification type and available IDs
    if (notification.type === 'bid_received' && notification.bid_id) {
      navigate(`/client/bids`);
    } else if (notification.type === 'bid_accepted' && notification.bid_id) {
      navigate('/orders');
    } else if (notification.type === 'bid_rejected' && notification.bid_id) {
      navigate(`/client/bids`);
    } else if (notification.type === 'job_posted' && notification.job_id) {
      navigate(`/jobs/${notification.job_id}/bids`);
    } else if (notification.type === 'new_message' && notification.chat_id) {
      navigate(`/client/chat?chat=${notification.chat_id}`);
    } else if (notification.type === 'new_offer' && notification.chat_id) {
      navigate(`/client/chat?chat=${notification.chat_id}`);
    } else if (notification.type === 'order_paid') {
      navigate('/orders');
    } else if (notification.type === 'new_message') {
      toast({
        title: 'Error',
        description: 'This message notification is missing a chat link.',
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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600 mt-2">Stay updated with your latest activity</p>
            </div>
            {notifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No notifications yet</h3>
                <p className="text-gray-600">
                  You'll receive notifications about job opportunities and bid updates here.
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
                          <p className={`${!notification.read ? 'font-medium' : ''} text-gray-900`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            {new Date(notification.created_at).toLocaleString()}
                          </div>
                          {notification.type === 'bid_received' && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                New bid received
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
                  >
                    Previous
                  </button>
                  <span>Page {page + 1}</span>
                  <button
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50"
                    onClick={() => setPage((p) => hasMore ? p + 1 : p)}
                    disabled={!hasMore}
                  >
                    Next
                  </button>
                </div>
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