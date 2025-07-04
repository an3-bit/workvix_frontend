import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, MessageCircle, Search, LogOut, User, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Nav2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<unknown>(null);
  const [userProfile, setUserProfile] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  // Type guards
  const isUserProfile = (profile: unknown): profile is { user_type?: string; first_name?: string; last_name?: string } => {
    return typeof profile === 'object' && profile !== null;
  };
  const isUser = (u: unknown): u is { id?: string; email?: string } => {
    return typeof u === 'object' && u !== null;
  };

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }
        setUser(user);
        await fetchUserProfile(user.id);
        fetchNotifications(user.id);
        fetchUnreadMessageCount(user.id);
        setupRealtime(user.id);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchUserAndNotifications();
    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  useEffect(() => {
    if (isUser(user) && user.id) {
      fetchNotifications(user.id);
    }
  }, [location, user]);

  useEffect(() => {
    // Listen for profile-updated event
    const handleProfileUpdated = () => {
      if (isUser(user)) fetchUserProfile(user.id);
    };
    window.addEventListener('profile-updated', handleProfileUpdated);
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdated);
    };
  }, [user]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setLoading(false);
    }
  };

  const fetchNotifications = async (uid: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('id, read')
      .eq('user_id', uid);
    if (!error) {
      setNotificationCount(data.filter((n: { read: boolean }) => !n.read).length);
    }
  };

  const fetchUnreadMessageCount = async (uid: string) => {
    const { data: unreadCount, error } = await supabase.rpc('get_unread_message_count', { user_uuid: uid });
    setMessageCount(unreadCount ?? 0);
  };

  const setupRealtime = (uid: string) => {
    const channel = supabase
      .channel('notifications_nav2')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${uid}`
      }, () => {
        fetchNotifications(uid);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
      }, () => {
        fetchUnreadMessageCount(uid);
      })
      .subscribe();
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setUserProfile(null);
      setNotificationCount(0);
      setMessageCount(0);
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
    if (isUserProfile(userProfile)) {
      if (userProfile.user_type === 'freelancer') {
        navigate('/freelancer');
      } else if (userProfile.user_type === 'client') {
        navigate('/client');
      } else {
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

  const getInitials = (profile: unknown) => {
    if (isUserProfile(profile) && profile.first_name && profile.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    if (isUserProfile(profile) && profile.first_name) {
      return profile.first_name.charAt(0).toUpperCase();
    }
    if (isUser(user) && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (isUserProfile(userProfile) && userProfile.first_name && userProfile.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    if (isUserProfile(userProfile) && userProfile.first_name) {
      return userProfile.first_name;
    }
    if (isUser(user) && user.email) {
      return user.email || 'User';
    }
    return 'User';
  };

  const handleNotificationClick = async () => {
    if (isUserProfile(userProfile)) {
      if (userProfile.user_type === 'freelancer') {
        navigate('/freelancer/notifications');
      } else if (userProfile.user_type === 'client') {
        navigate('/client/notifications');
      } else {
        navigate('/freelancer/notifications'); // fallback
      }
    } else {
      navigate('/freelancer/notifications');
    }
  };

  const shouldShowJobs = () => {
    return location.pathname === '/freelancer' || 
           (isUserProfile(userProfile) && userProfile.user_type === 'freelancer' && ['/jobs', '/bids'].includes(location.pathname));
  };

  const shouldShowBids = () => {
    return location.pathname === '/client' || 
           (isUserProfile(userProfile) && userProfile.user_type === 'client' && location.pathname === '/client/bids');
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
             <span className="text-2xl font-bold text-skillforge-primary">work<span className="text-orange-500 text-workvix-primary">vix</span></span>
          </button>

          {/* Navigation Links */}
          {isUser(user) && (
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
            </div>
          )}

          {/* orders */}
          {isUser(user) && isUserProfile(userProfile) && userProfile.user_type === 'client' && (
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/orders" 
                className={`text-gray-700 hover:text-green-600 transition-colors ${
                  location.pathname === '/orders' ? 'text-green-600 font-medium' : ''
                }`}
              >
                Orders
              </Link>
            </div>
          )}

           {/* orders */}
          {isUser(user) && isUserProfile(userProfile) && userProfile.user_type === 'freelancer' && (
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/orders" 
                className={`text-gray-700 hover:text-green-600 transition-colors ${
                  location.pathname === '/orders' ? 'text-green-600 font-medium' : ''
                }`}
              >
                Orders
              </Link>
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
            {isUser(user) ? (
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
                          {getInitials(userProfile)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {isUser(user) && user.email}
                      </p>
                    </div>
                    <DropdownMenuItem 
                      onClick={() => {
                        if (isUserProfile(userProfile) && userProfile.user_type === 'freelancer') {
                          navigate('/freelancer/profile');
                        } else if (isUserProfile(userProfile) && userProfile.user_type === 'client') {
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
