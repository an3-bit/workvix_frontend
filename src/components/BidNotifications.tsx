
import { useState, useEffect } from 'react';
import { Bell, X, User, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface BidNotification {
  id: string;
  bid: {
    id: string;
    amount: number;
    delivery_time: string;
    message: string;
    created_at: string;
    freelancer: {
      first_name: string;
      last_name: string;
    };
    job: {
      title: string;
    };
  };
  read: boolean;
}

const BidNotifications = () => {
  const [notifications, setNotifications] = useState<BidNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBidNotifications();
    
    // Set up real-time subscription for new bids
    const channel = supabase
      .channel('bid-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids'
        },
        (payload) => {
          console.log('New bid received:', payload);
          fetchBidNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBidNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get bids for jobs posted by this client
      const { data: bidsData, error } = await supabase
        .from('bids')
        .select(`
          id,
          amount,
          delivery_time,
          message,
          created_at,
          freelancer:freelancers(first_name, last_name),
          job:jobs!inner(title, client_id)
        `)
        .eq('job.client_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching bid notifications:', error);
        return;
      }

      // Transform data for notifications
      const notifications = bidsData?.map(bid => ({
        id: `bid-${bid.id}`,
        bid,
        read: false // In a real app, you'd track this in the database
      })) || [];

      setNotifications(notifications);
      setUnreadCount(notifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error:', error);
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
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleNotificationClick = (notification: BidNotification) => {
    markAsRead(notification.id);
    // Navigate to chat with the freelancer
    navigate(`/chat/bid-${notification.bid.id}`);
    setShowNotifications(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto border">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-900">New Bid Notifications</h3>
            <button
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setShowNotifications(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No new bid notifications
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-skillforge-primary rounded-full flex items-center justify-center text-white font-medium">
                      {notification.bid.freelancer?.first_name?.[0] || 'F'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          New Bid Received
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.bid.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.bid.freelancer?.first_name} {notification.bid.freelancer?.last_name} 
                        {' '}bid on "{notification.bid.job?.title}"
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <DollarSign className="h-3 w-3 mr-1" />
                          ${notification.bid.amount}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.bid.delivery_time}
                        </div>
                      </div>
                      
                      {!notification.read && (
                        <Badge className="mt-2 bg-blue-100 text-blue-800">
                          New
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BidNotifications;
