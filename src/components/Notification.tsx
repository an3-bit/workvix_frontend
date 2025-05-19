import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on component mount
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('skillforge_notifications') || '[]');
    setNotifications(storedNotifications);
    
    // Count unread notifications
    const unread = storedNotifications.filter(notification => !notification.read).length;
    setUnreadCount(unread);
    
    // Set up interval to check for new notifications
    const intervalId = setInterval(checkForNewNotifications, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Check for new notifications (simulated)
  const checkForNewNotifications = () => {
    // In a real app, this would make an API call
    // For demo purposes, we'll randomly add notifications occasionally
    if (Math.random() < 0.1) { // 10% chance to add a notification
      addRandomNotification();
    }
  };

  // Add a random notification (for demonstration)
  const addRandomNotification = () => {
    const notificationTypes = [
      {
        title: "New Job Available",
        message: "A new job matching your skills has been posted!",
        type: "job"
      },
      {
        title: "Bid Status Update",
        message: "Your bid has been reviewed by the client.",
        type: "bid"
      },
      {
        title: "Message Received",
        message: "You have a new message from a client.",
        type: "message"
      }
    ];
    
    const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    const newNotification = {
      id: Date.now().toString(),
      title: randomType.title,
      message: randomType.message,
      type: randomType.type,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    setUnreadCount(unreadCount + 1);
    
    // Save to localStorage
    localStorage.setItem('skillforge_notifications', JSON.stringify(updatedNotifications));
    
    // Show notification alert
    if (window.Notification && Notification.permission === "granted") {
      new Notification(randomType.title, {
        body: randomType.message
      });
    }
  };

  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    
    // Mark all as read when opening
    if (!showNotifications) {
      markAllAsRead();
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    
    // Save to localStorage
    localStorage.setItem('skillforge_notifications', JSON.stringify(updatedNotifications));
  };

  // Mark a single notification as read
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === id && !notification.read) {
        setUnreadCount(unreadCount - 1);
        return { ...notification, read: true };
      }
      return notification;
    });
    
    setNotifications(updatedNotifications);
    
    // Save to localStorage
    localStorage.setItem('skillforge_notifications', JSON.stringify(updatedNotifications));
  };

  // Delete a notification
  const deleteNotification = (id) => {
    const notification = notifications.find(n => n.id === id);
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    
    // Update unread count if needed
    if (notification && !notification.read) {
      setUnreadCount(unreadCount - 1);
    }
    
    setNotifications(updatedNotifications);
    
    // Save to localStorage
    localStorage.setItem('skillforge_notifications', JSON.stringify(updatedNotifications));
  };

  // Format time
  const formatTime = (timestamp) => {
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
        onClick={toggleNotifications}
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
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium text-gray-900">Notifications</h3>
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </button>
              )}
              <button
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowNotifications(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  
                  {/* Action buttons based on notification type */}
                  <div className="mt-2 flex justify-between items-center">
                    {notification.type === 'job' && (
                      <Button 
                        className="text-xs py-1 px-2 h-auto bg-skillforge-primary hover:bg-skillforge-primary/90"
                      >
                        View Job
                      </Button>
                    )}
                    
                    {notification.type === 'bid' && (
                      <Button 
                        className="text-xs py-1 px-2 h-auto bg-skillforge-secondary hover:bg-skillforge-secondary/90"
                      >
                        Check Status
                      </Button>
                    )}
                    
                    {notification.type === 'message' && (
                      <Button 
                        className="text-xs py-1 px-2 h-auto bg-blue-600 hover:bg-blue-700"
                      >
                        Reply
                      </Button>
                    )}
                    
                    <button
                      className="text-xs text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    >
                      Dismiss
                    </button>
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

export default NotificationSystem;