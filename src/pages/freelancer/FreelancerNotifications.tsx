import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav2 from '@/components/Nav2';
import { Bell, Clock, DollarSign, User, MessageSquare, Briefcase } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import Footer from '@/components/Footer';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  job_id?: string;
  bid_id?: string;
  chat_id?: string;
  offer_id?: string;
  job?: {
    id: string;
    title: string;
    budget: number;
  };
  client?: {
    first_name: string;
    last_name: string;
  };
}

const FreelancerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Notification['job'] | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
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

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }
      const { data: notificationsData, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setNotifications(notificationsData || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const setupRealtimeSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const channel = supabase
      .channel('notifications_changes_freelancer')
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
      if (user && user.id) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
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



  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notification.id);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    }
    switch (notification.type) {
      case 'job_posted':
        if (notification.job && notification.job.id) {
          navigate(`/jobs/${notification.job.id}`, { state: { job: notification.job, notification } });
        } else if (notification.job) {
          setSelectedJob(notification.job);
          setShowJobModal(true);
        }
        break;
      case 'bid_accepted':
        navigate('/chat', { state: { client: notification.client, job: notification.job, notification } });
        break;
      case 'payment_received':
        setPaymentMessage(notification.message);
        setShowPaymentModal(true);
        break;
      case 'message':
        if (notification.client) {
          navigate('/chat', { state: { client: notification.client, notification } });
        } else {
          navigate('/chat', { state: { notification } });
        }
        break;
      default:
        navigate('/chat', { state: { notification } });
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

  function formatTimeAgo(created_at: string): React.ReactNode {
    const now = new Date();
    const date = new Date(created_at);
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
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">Stay updated with your freelancing activities</p>
              </div>

              <div className="divide-y divide-gray-200">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                    <p className="text-gray-500">You'll see notifications about jobs, bids, and messages here.</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
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
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
                              New message
                            </span>
                          </div>
                        )}
                        {notification.type === 'new_offer' && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              New offer
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
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                  </div>
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

export default FreelancerNotifications;
