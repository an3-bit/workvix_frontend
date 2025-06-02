
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import { Bell, Clock, DollarSign, User, MessageSquare } from 'lucide-react';

interface NotificationData {
  id: string;
  type: 'job_posted' | 'bid_accepted' | 'payment_received' | 'message';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
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
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // For now, we'll create mock notifications since we don't have a notifications table
      // In a real app, you'd fetch from a notifications table
      const mockNotifications: NotificationData[] = [
        {
          id: '1',
          type: 'job_posted',
          title: 'New Job Posted',
          message: 'A new web development job matching your skills has been posted.',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          job: {
            id: 'job-1',
            title: 'E-commerce Website Development',
            budget: 2500
          }
        },
        {
          id: '2',
          type: 'bid_accepted',
          title: 'Bid Accepted!',
          message: 'Your bid for "Logo Design Project" has been accepted.',
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          read: false,
          job: {
            id: 'job-2',
            title: 'Logo Design Project',
            budget: 500
          },
          client: {
            first_name: 'John',
            last_name: 'Smith'
          }
        },
        {
          id: '3',
          type: 'payment_received',
          title: 'Payment Received',
          message: 'You have received $500 for completing "Mobile App UI Design"',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          read: true
        },
        {
          id: '4',
          type: 'message',
          title: 'New Message',
          message: 'You have a new message from Sarah Johnson regarding your proposal.',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          client: {
            first_name: 'Sarah',
            last_name: 'Johnson'
          }
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
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
      case 'job_posted':
        return <Bell className="h-6 w-6 text-blue-600" />;
      case 'bid_accepted':
        return <User className="h-6 w-6 text-green-600" />;
      case 'payment_received':
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
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.type === 'bid_accepted' && notification.job) {
                          navigate(`/chat/bid-${notification.job.id}`);
                        } else if (notification.type === 'job_posted' && notification.job) {
                          navigate(`/jobs/${notification.job.id}/bid`);
                        }
                      }}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerNotifications;
