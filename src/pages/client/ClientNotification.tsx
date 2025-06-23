import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav2 from '@/components/Nav2';
import { Bell, Clock, DollarSign, User, MessageSquare, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface NotificationData {
  id: string;
  type: 'new_bid' | 'bid_accepted_by_freelancer' | 'payment_sent' | 'message';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
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

const ClientNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBid, setSelectedBid] = useState<NotificationData['bid'] | null>(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      setLoading(true);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      if (currentUser) {
        await fetchNotifications(currentUser.id);
      } else {
        setNotifications([]);
      }
      setLoading(false);
    };
    fetchUserAndNotifications();
  }, []);

  const getNotificationTitle = (n: any) => {
    switch (n.type) {
      case 'new_bid': return 'New Bid Received';
      case 'bid_accepted_by_freelancer': return 'Bid Accepted by Freelancer';
      case 'payment_sent': return 'Payment Sent';
      case 'message': return 'New Message';
      default: return 'Notification';
    }
  };

  const fetchNotifications = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      // Transform raw notifications to match NotificationData interface
      const transformed = (data || []).map((n: any) => ({
        id: n.id,
        type: n.type,
        title: getNotificationTitle(n),
        message: n.message || '',
        created_at: n.created_at,
        read: n.read,
        bid: n.bid_id ? { id: n.bid_id, job_title: n.job_title || '', amount: n.bid_amount || 0, freelancer_name: n.freelancer_name || '' } : undefined,
        freelancer: n.freelancer_first_name ? { first_name: n.freelancer_first_name, last_name: n.freelancer_last_name } : undefined,
      }));
      setNotifications(transformed);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_bid':
        return <FileText className="h-6 w-6 text-blue-600" />;
      case 'bid_accepted_by_freelancer':
        return <User className="h-6 w-6 text-green-600" />;
      case 'payment_sent':
        return <DollarSign className="h-6 w-6 text-green-600" />;
      case 'message':
        return <MessageSquare className="h-6 w-6 text-purple-600" />;
      default:
        return <Bell className="h-6 w-6 text-gray-600" />;
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
      // Mark as read in backend
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notification.id);
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
    }
    switch (notification.type) {
      case 'new_bid':
        if (notification.bid && notification.bid.id) {
          navigate('/chat', { state: { bid: notification.bid, freelancer: notification.freelancer, notification } });
        } else if (notification.bid) {
          setSelectedBid(notification.bid);
          setShowBidModal(true);
        }
        break;
      case 'bid_accepted_by_freelancer':
        navigate('/chat', { state: { freelancer: notification.freelancer, bid: notification.bid, notification } });
        break;
      case 'payment_sent':
        setPaymentMessage(notification.message);
        setShowPaymentModal(true);
        break;
      case 'message':
        if (notification.freelancer) {
          navigate('/chat', { state: { freelancer: notification.freelancer, notification } });
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
      <div className="min-h-screen bg-gray-50">
        <Nav2 />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
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
            <p className="mb-4 text-gray-600">You can review the bid details here. (Extend as needed.)</p>
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
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">Stay updated with your job postings and freelancer activities</p>
              </div>
              <div className="divide-y divide-gray-200">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                    <p className="text-gray-500">You'll see notifications about bids, payments, and messages here.</p>
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
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientNotification;
