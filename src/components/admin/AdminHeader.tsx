import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, UserCircle, Search, MessageSquare, Sun, MoonStar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationSystem from '@/components/Notification';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/lib/theme';
import { useUserProfile } from '../../lib/auth';

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
  const { profile: admin } = useUserProfile();
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
    }
  };

  return (
    <header className="flex items-center justify-between p-3 border-b border-border bg-background shadow-sm w-full">
      {/* Left: Search bar */}
      <div className="flex items-center gap-2 w-full max-w-md bg-background rounded-full px-3 py-1 border border-border shadow-sm">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search or enter website name"
          className="flex-1 bg-transparent outline-none text-foreground px-2"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          disabled={searching}
        />
        {searching && <span className="ml-2 animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></span>}
      </div>
      {/* Right: Icons */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notifications (show unread messages count) */}
        <button
          aria-label="Messages"
          className="relative p-2 rounded-full hover:bg-muted transition"
          onClick={() => navigate('/admin/messages')}
        >
          <Bell className="h-6 w-6 text-blue-600" />
          {messageCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-xs text-white rounded-full flex items-center justify-center border-2 border-white">{messageCount}</span>
          )}
        </button>
        {/* Theme Toggle */}
        <button
          aria-label="Toggle dark/light mode"
          className="p-2 rounded-full hover:bg-muted transition"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun className="h-6 w-6 text-yellow-400" /> : <MoonStar className="h-6 w-6 text-gray-700" />}
        </button>
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
      </div>
    </header>
  );
};

export default AdminHeader;
