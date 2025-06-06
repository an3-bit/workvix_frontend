
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, Bell, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Nav2 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    checkUser();
    if (user) {
      fetchUnreadNotifications();
      setupNotificationSubscription();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
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

  const setupNotificationSubscription = () => {
    if (!user) return;

    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, () => {
        fetchUnreadNotifications();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center mr-10">
              <span className="text-2xl font-bold text-skillforge-primary">
                work<span className="text-orange-500">vix</span>
              </span>
            </Link>

            {/* Search bar - desktop */}
            <div className="hidden md:flex h-10 max-w-md flex-1 items-center rounded-md border bg-background px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-70" />
              <input 
                type="search" 
                placeholder="What service are you looking for today?" 
                className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" 
              />
              <Button size="sm" className="h-7 bg-skillforge-primary">Search</Button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <>
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
                <Link to="/chat" className="text-gray-600 hover:text-skillforge-primary transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </Link>
              </>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/freelancer" className="text-gray-600 hover:text-skillforge-primary transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = '/signin';
                  }}
                  className="text-gray-600 hover:text-skillforge-primary transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
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
                <Link to="/chat" className="text-gray-600 hover:text-skillforge-primary transition-colors">
                  <MessageCircle className="h-6 w-6" />
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
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search services..."
                  className="h-10 w-full rounded-md border border-input pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-skillforge-primary"
                />
              </div>
              
              {user ? (
                <>
                  <Link 
                    to="/freelancer" 
                    className="block py-2 text-gray-600 hover:text-skillforge-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={async () => {
                      await supabase.auth.signOut();
                      setIsMenuOpen(false);
                      window.location.href = '/signin';
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
