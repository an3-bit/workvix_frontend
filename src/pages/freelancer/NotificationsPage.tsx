
import React, { useState, useEffect } from 'react';
import { Bell, Briefcase, DollarSign, User, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
  job_id?: string;
  bid_id?: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const subscription = setupRealtimeSubscription();
    
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
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
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const channel = supabase
      .channel('notifications_changes')
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
      case 'job_posted':
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case 'bid_accepted':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'bid_rejected':
        return <User className="h-5 w-5 text-red-600" />;
      case 'payment_received':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    if (notification.type === 'job_posted' && notification.job_id) {
      navigate(`/jobs/${notification.job_id}/bids`);
    } else if (notification.type === 'bid_accepted' && notification.bid_id) {
      navigate('/orders');
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
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'border-l-4 border-l-blue-600' : ''
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

export default NotificationsPage;
