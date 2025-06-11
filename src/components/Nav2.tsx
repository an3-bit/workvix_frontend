import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, Bell, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Nav2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserRole();
      fetchUnreadNotifications();
      fetchUnreadMessages();
      setupNotificationSubscription();
      setupMessagesSubscription();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchUserRole = async () => {
  if (!user) return;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    
    if (data && data.user_type) {
      setUserRole(data.user_type);
      console.log('User role set to:', data.user_type); // Debug log
    } else {
      console.warn('No user_type found for user:', user.id);
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
    // You might want to set a default role here if appropriate
    // setUserRole('client'); // or 'freelancer' depending on your needs
  }
};

  const fetchUnreadNotifications = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', user.id)
        .eq('read', false);

      setUnreadCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadMessages = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('messages')
        .select('id')
        .or(`and(receiver_id.eq.${user.id},read.eq.false),and(sender_id.eq.${user.id},read.eq.false)`)
        .order('created_at', { ascending: false });

      setUnreadMessagesCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  };

  const setupNotificationSubscription = () => {
    if (!user) return;

    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchUnreadNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  const setupMessagesSubscription = () => {
    if (!user) return;

    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `or(and(receiver_id.eq.${user.id},read.eq.false),and(sender_id.eq.${user.id},read.eq.false))`
      }, () => {
        fetchUnreadMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getInitials = (user) => {
    if (user?.user_metadata?.first_name && user?.user_metadata?.last_name) {
      return `${user.user_metadata.first_name.charAt(0)}${user.user_metadata.last_name.charAt(0)}`;
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  const handleLogoClick = () => {
    {navigate(userRole === 'freelancer' ? '/freelancer' : '/client')};
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center">
            {/* Logo */}
            <button onClick={handleLogoClick} className="flex items-center mr-10">
              <span className="text-2xl font-bold text-skillforge-primary">
                work<span className="text-orange-500">vix</span>
              </span>
            </button>

            {/* Search bar - desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex h-10 max-w-md flex-1 items-center rounded-md border bg-background px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-70" />
              <input 
                type="search" 
                placeholder="What service are you looking for today?" 
                className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" size="sm" className="h-7 bg-skillforge-primary">Search</Button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
                {userRole === 'freelancer' && (
                  <Link 
                    to="/jobs" 
                    className="text-gray-600 hover:text-skillforge-primary transition-colors"
                  >
                    Jobs
                  </Link>
                )}
                {userRole === 'client' && (
                  <Link 
                    to="/client/bids" 
                    className="text-gray-600 hover:text-skillforge-primary transition-colors"
                  >
                    Bids
                  </Link>
                )}
                
                <Link 
                  to="/orders" 
                  className="text-gray-600 hover:text-skillforge-primary transition-colors"
                >
                  Orders
                </Link>
                
                <Link 
                  to="/freelancer/notifications" 
                  className="relative text-gray-600 hover:text-skillforge-primary transition-colors"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                
                <Link 
                  to="/client/chat" 
                  className="relative text-gray-600 hover:text-skillforge-primary transition-colors"
                >
                  <MessageCircle className="h-6 w-6" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </span>
                  )}
                </Link>
                
                {/* User Avatar Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                        <AvatarFallback className="bg-skillforge-primary text-white">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(userRole === 'freelancer' ? '/freelancer/profile' : '/client/profile')}>
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(userRole === 'freelancer' ? '/freelancer' : '/client')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            
            {!user && (
              <>
                <Link to="/signin" className="text-gray-600 hover:text-skillforge-primary transition-colors">
                  Sign In
                </Link>
                <Link to="/join">
                  <Button className="bg-skillforge-primary hover:bg-skillforge-primary/90">Join</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {user && (
              <>
                <Link 
                  to="/freelancer/notifications" 
                  className="relative text-gray-600 hover:text-skillforge-primary transition-colors"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/client/chat" 
                  className="relative text-gray-600 hover:text-skillforge-primary transition-colors"
                >
                  <MessageCircle className="h-6 w-6" />
                  {unreadMessagesCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            <button onClick={toggleMenu} className="text-gray-600 hover:text-skillforge-primary">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 py-2 bg-white shadow-lg rounded-md animate-fade-in">
            <div className="px-4 py-2">
              <form onSubmit={handleSearch} className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search services..."
                  className="h-10 w-full rounded-md border border-input pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-skillforge-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              
              {user ? (
                <>
                  <div className="flex items-center space-x-3 mb-4 p-2 bg-gray-50 rounded-md">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                      <AvatarFallback className="bg-skillforge-primary text-white">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  
                  {userRole === 'freelancer' && (
                    <Link 
                      to="/freelancer/jobs" 
                      className="block py-2 text-gray-600 hover:text-skillforge-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Jobs
                    </Link>
                  )}
                  {userRole === 'client' && (
                    <Link 
                      to="/client/bids" 
                      className="block py-2 text-gray-600 hover:text-skillforge-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Bids
                    </Link>
                  )}
                  
                  <Link 
                    to="/orders" 
                    className="block py-2 text-gray-600 hover:text-skillforge-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  
                  <Link 
                    to={userRole === 'freelancer' ? '/freelancer/profile' : '/client/profile'} 
                    className="block py-2 text-gray-600 hover:text-skillforge-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link 
                    to={userRole === 'freelancer' ? '/freelancer' : '/client'} 
                    className="block py-2 text-gray-600 hover:text-skillforge-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-gray-600 hover:text-skillforge-primary w-full text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/signin" 
                    className="block py-2 text-gray-600 hover:text-skillforge-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/join" 
                    className="block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Button className="w-full bg-skillforge-primary hover:bg-skillforge-primary/90 mt-2">
                      Join
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Nav2;