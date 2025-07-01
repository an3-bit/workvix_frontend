import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { LogOut, Bell, UserCircle, Search, MessageSquare, Sun, MoonStar } from 'lucide-react';
=======
import { LogOut, Bell, UserCircle, Search, MessageSquare } from 'lucide-react';
>>>>>>> a02f476 (admin dashboard)
=======
import { LogOut, Bell, UserCircle, Search, MessageSquare, Sun, MoonStar } from 'lucide-react';
>>>>>>> 7438431 (admin dashboard)
=======
import { LogOut, Bell, UserCircle, Search, MessageSquare } from 'lucide-react';
>>>>>>> 24970ef (admin dashboard)
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationSystem from '@/components/Notification';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7438431 (admin dashboard)
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
<<<<<<< HEAD
<<<<<<< HEAD
import { useUserProfile } from '../../lib/auth';
=======
>>>>>>> a02f476 (admin dashboard)
=======
import { useTheme } from '@/lib/theme';
>>>>>>> 7438431 (admin dashboard)
=======
>>>>>>> b2a4ea7 (client (profile,dashboard))

interface AdminHeaderProps {
  adminEmail: string | null;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ adminEmail }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearch, setShowSearch] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
<<<<<<< HEAD
  const { profile: admin } = useUserProfile();
=======
  const [admin, setAdmin] = useState<{ name: string; avatar: string | null } | null>(null);
>>>>>>> a02f476 (admin dashboard)
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b2a4ea7 (client (profile,dashboard))

  // Fallbacks for avatar and name
  const avatar = admin?.avatar || '';
  const name = admin?.firstName && admin?.lastName
    ? `${admin.firstName} ${admin.lastName}`
    : admin?.email || 'Admin';

  React.useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (!admin?.id) return;
    const fetchProfileAndNotifications = async () => {
      const { data: notifications } = await supabase
        .from('notifications')
        .select('id, read')
        .eq('id', admin.id);
      setNotificationCount(notifications ? notifications.filter((n: any) => !n.read).length : 0);
      const { data: messages } = await supabase
        .from('messages')
        .select('id, read')
        .eq('id', admin.id);
      setMessageCount(messages ? messages.filter((m: any) => !m.read).length : 0);
    };
    fetchProfileAndNotifications();
  }, [admin?.id]);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      setSearching(true);
      // Always navigate to a universal admin search page
      const target = '/admin/search?query=' + encodeURIComponent(search.trim());
      navigate(target);
      setSearch('');
      setTimeout(() => setSearching(false), 500); // Simulate loading
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      navigate('/admin/login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to log out.',
        variant: 'destructive',
      });
=======
=======
  const { theme, toggleTheme } = useTheme();
>>>>>>> 7438431 (admin dashboard)

  React.useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const fetchProfileAndNotifications = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Fetch admin profile from 'profiles' or 'support_users'
      let name = user.user_metadata?.full_name || user.email || 'Admin';
      let avatar = user.user_metadata?.avatar_url || null;
      // Try to get more profile info from 'profiles' table
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar')
        .eq('id', user.id)
        .single();
      if (profile) {
        name = (profile.first_name && profile.last_name)
          ? `${profile.first_name} ${profile.last_name}`
          : profile.first_name || name;
        avatar = profile.avatar || avatar;
      }
      setAdmin({ name, avatar });
      // Fetch notifications count (replace with real query if available)
      const { data: notifications } = await supabase
        .from('notifications')
        .select('id, read')
        .eq('user_id', user.id);
      setNotificationCount(notifications ? notifications.filter((n: any) => !n.read).length : 0);
      // Fetch messages count (replace with real query if available)
      const { data: messages } = await supabase
        .from('messages')
        .select('id, read')
        .eq('receiver_id', user.id);
      setMessageCount(messages ? messages.filter((m: any) => !m.read).length : 0);
    };
    fetchProfileAndNotifications();
  }, []);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      setSearching(true);
      // Always navigate to a universal admin search page
      const target = '/admin/search?query=' + encodeURIComponent(search.trim());
      navigate(target);
      setSearch('');
      setTimeout(() => setSearching(false), 500); // Simulate loading
>>>>>>> a02f476 (admin dashboard)
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      navigate('/admin/login');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to log out.',
        variant: 'destructive',
      });
    }
  };

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <header className="flex items-center justify-between p-3 border-b border-border bg-background shadow-sm w-full">
      {/* Left: Search bar */}
      <div className="flex items-center gap-2 w-full max-w-md bg-background rounded-full px-3 py-1 border border-border shadow-sm">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search or enter website name"
          className="flex-1 bg-transparent outline-none text-foreground px-2"
=======
    <header className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 shadow-sm w-full">
=======
    <header className="flex items-center justify-between p-3 border-b border-border bg-background shadow-sm w-full">
>>>>>>> 7438431 (admin dashboard)
      {/* Left: Search bar */}
      <div className="flex items-center gap-2 w-full max-w-md bg-background rounded-full px-3 py-1 border border-border shadow-sm">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search or enter website name"
<<<<<<< HEAD
          className="flex-1 bg-transparent outline-none text-gray-900 px-2"
>>>>>>> a02f476 (admin dashboard)
=======
          className="flex-1 bg-transparent outline-none text-foreground px-2"
>>>>>>> 7438431 (admin dashboard)
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          disabled={searching}
        />
<<<<<<< HEAD
<<<<<<< HEAD
        {searching && <span className="ml-2 animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>}
=======
        {searching && <span className="ml-2 animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></span>}
>>>>>>> a02f476 (admin dashboard)
=======
        {searching && <span className="ml-2 animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>}
>>>>>>> 7438431 (admin dashboard)
      </div>
      {/* Right: Icons */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notifications (show unread messages count) */}
        <button
          aria-label="Messages"
<<<<<<< HEAD
<<<<<<< HEAD
          className="relative p-2 rounded-full hover:bg-muted transition"
          onClick={() => navigate('/admin/messages')}
        >
          <Bell className="h-6 w-6 text-blue-600" />
=======
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => navigate('/admin/messages')}
        >
          <MessageSquare className="h-6 w-6 text-blue-600" />
>>>>>>> a02f476 (admin dashboard)
=======
          className="relative p-2 rounded-full hover:bg-muted transition"
          onClick={() => navigate('/admin/messages')}
        >
          <Bell className="h-6 w-6 text-blue-600" />
>>>>>>> 7438431 (admin dashboard)
          {messageCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-xs text-white rounded-full flex items-center justify-center border-2 border-white">{messageCount}</span>
          )}
        </button>
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> b2a4ea7 (client (profile,dashboard))
        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Profile" className="ml-2">
              <Avatar className="h-8 w-8 border-2 border-border shadow-sm">
                {avatar ? (
                  <img src={avatar} alt={name} />
                ) : (
                  <AvatarFallback>
                    {name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                )}
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/admin/settings?tab=profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
=======
        {/* Profile Avatar */}
=======
        {/* Theme Toggle */}
>>>>>>> 7438431 (admin dashboard)
        <button
          aria-label="Toggle dark/light mode"
          className="p-2 rounded-full hover:bg-muted transition"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun className="h-6 w-6 text-yellow-400" /> : <MoonStar className="h-6 w-6 text-gray-700" />}
        </button>
<<<<<<< HEAD
        <span className="hidden md:inline text-gray-900 font-medium ml-2">{admin ? admin.name : ''}</span>
>>>>>>> a02f476 (admin dashboard)
=======
        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Profile" className="ml-2">
              <Avatar className="h-8 w-8 border-2 border-border shadow-sm">
                {admin && admin.avatar ? (
                  <img src={admin.avatar} alt={admin.name} />
                ) : (
                  <AvatarFallback>{(() => {
                    if (admin && admin.name && admin.name.trim() && admin.name.split(' ').length > 1) {
                      // Use first and last name initials
                      return admin.name.split(' ').map(n => n[0] ? n[0][0] : '').join('').toUpperCase();
                    } else if (admin && admin.name && admin.name.includes('@')) {
                      // Extract initials from email
                      const emailName = admin.name.split('@')[0];
                      const parts = emailName.match(/[a-zA-Z]+/g);
                      if (parts && parts.length > 1) {
                        return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
                      } else if (emailName.length > 1) {
                        return `${emailName[0]}${emailName[emailName.length - 1]}`.toUpperCase();
                      } else {
                        return emailName[0].toUpperCase();
                      }
                    } else if (admin && adminEmail && adminEmail.includes('@')) {
                      // Fallback to adminEmail
                      const emailName = adminEmail.split('@')[0];
                      const parts = emailName.match(/[a-zA-Z]+/g);
                      if (parts && parts.length > 1) {
                        return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
                      } else if (emailName.length > 1) {
                        return `${emailName[0]}${emailName[emailName.length - 1]}`.toUpperCase();
                      } else {
                        return emailName[0].toUpperCase();
                      }
                    } else {
                      return 'A';
                    }
                  })()}</AvatarFallback>
                )}
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/admin/settings?tab=profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
>>>>>>> 7438431 (admin dashboard)
      </div>
    </header>
  );
};

export default AdminHeader;
