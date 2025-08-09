import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, MessageCircle, Search, LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// Update type definitions
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'freelancer' | 'admin' | 'affiliate_marketer';
  first_name?: string;
  last_name?: string;
  phone?: string;
}
const Nav2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        // Fetch user profile
        const response = await fetch('http://localhost:5000/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const userData = await response.json();
        setUser(userData);
        // Fetch notifications count
        const notifResponse = await fetch(`http://localhost:5000/notifications/unread/${userData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (notifResponse.ok) {
          const { count } = await notifResponse.json();
          setNotificationCount(count);
        }
        // Fetch unread messages count
        const msgResponse = await fetch(`http://localhost:5000/messages/unread/${userData.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (msgResponse.ok) {
          const { count } = await msgResponse.json();
          setMessageCount(count);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    fetchUserAndNotifications();
    // Setup WebSocket connection for real-time updates
    const ws = new WebSocket('ws://localhost:5000');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'notification') {
        setNotificationCount(prev => prev + 1);
      } else if (data.type === 'message') {
        setMessageCount(prev => prev + 1);
      }
    };
    return () => {
      ws.close();
    };
  }, []);
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };
  const handleLogoClick = () => {
    if (user) {
      switch (user.role) {
        case 'freelancer':
          navigate('/freelancer');
          break;
        case 'client':
          navigate('/client');
          break;
        case 'affiliate_marketer':
          navigate('/affiliate/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      navigate('/');
    }
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
  };
  const getInitials = () => {
    if (user && user.first_name && user.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user && user.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };
  const getUserDisplayName = () => {
    if (user && user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user && user.first_name) {
      return user.first_name;
    }
    if (user && user.email) {
      return user.email || 'User';
    }
    return 'User';
  };
  const handleNotificationClick = () => {
    if (user) {
      switch (user.role) {
        case 'freelancer':
          navigate('/freelancer/notifications');
          break;
        case 'client':
          navigate('/client/notifications');
          break;
        default:
          navigate('/freelancer/notifications'); // fallback
      }
    } else {
      navigate('/freelancer/notifications');
    }
  };
  const shouldShowJobs = () => {
    return user?.role === 'freelancer' &&
           (location.pathname === '/freelancer' || ['/jobs', '/bids'].includes(location.pathname));
  };
  const shouldShowBids = () => {
    return user?.role === 'client' &&
           (location.pathname === '/client' || location.pathname === '/client/bids');
  };
  if (loading) {
    return (
      <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }
  return (
    <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={handleLogoClick}
            className="text-2xl font-bold text-green-600 hover:text-orange-500 transition-colors"
          >
            <span className="text-2xl font-bold text-workvix-primary">work<span className="text-orange-500">vix</span></span>
          </button>
          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              {shouldShowJobs() && (
                <>
                  <Link 
                    to="/jobs" 
                    className={`text-gray-700 hover:text-green-600 transition-colors ${
                      location.pathname === '/jobs' ? 'text-green-600 font-medium' : ''
                    }`}
                  >
                    Jobs
                  </Link>
                  <Link 
                    to="/bids" 
                    className={`text-gray-700 hover:text-green-600 transition-colors ${
                      location.pathname === '/bids' ? 'text-green-600 font-medium' : ''
                    }`}
                  >
                    My Bids
                  </Link>
                </>
              )}
              {shouldShowBids() && (
                <Link 
                  to="/client/bids" 
                  className={`text-gray-700 hover:text-green-600 transition-colors ${
                    location.pathname === '/client/bids' ? 'text-green-600 font-medium' : ''
                  }`}
                >
                  Bids
                </Link>
              )}
              {user.role === 'client' && (
                <Link 
                  to="/orders" 
                  className={`text-gray-700 hover:text-green-600 transition-colors ${
                    location.pathname === '/orders' ? 'text-green-600 font-medium' : ''
                  }`}
                >
                  Orders
                </Link>
              )}
              {user.role === 'freelancer' && (
                <Link 
                  to="/orders" 
                  className={`text-gray-700 hover:text-green-600 transition-colors ${
                    location.pathname === '/orders' ? 'text-green-600 font-medium' : ''
                  }`}
                >
                  Orders
                </Link>
              )}
            </div>
          )}
          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for services..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
            </form>
          </div>
          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <button 
                  onClick={handleNotificationClick}
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </button>
                {/* Messages */}
                <Link 
                  to="/chat"
                  className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  {messageCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {messageCount > 99 ? '99+' : messageCount}
                    </span>
                  )}
                </Link>
                {/* User Avatar Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-600 text-white">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenuItem 
                      onClick={() => {
                        if (user.role === 'freelancer') {
                          navigate('/freelancer/profile');
                        } else if (user.role === 'client') {
                          navigate('/profile');
                        } else {
                          navigate('/dashboard');
                        }
                      }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate('/signin')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/join')}>
                  Join
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Nav2;