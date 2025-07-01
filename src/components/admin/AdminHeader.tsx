import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Bell, UserCircle, Search, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationSystem from '@/components/Notification';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
  const [admin, setAdmin] = useState<{ name: string; avatar: string | null } | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

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
    }
  };

  return (
    <header className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 shadow-sm w-full">
      {/* Left: Search bar */}
      <div className="flex items-center gap-2 w-full max-w-md bg-white rounded-full px-3 py-1 border border-gray-200 shadow-sm">
        <Search className="h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search or enter website name"
          className="flex-1 bg-transparent outline-none text-gray-900 px-2"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          disabled={searching}
        />
        {searching && <span className="ml-2 animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></span>}
      </div>
      {/* Right: Icons */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notifications (show unread messages count) */}
        <button
          aria-label="Messages"
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => navigate('/admin/messages')}
        >
          <MessageSquare className="h-6 w-6 text-blue-600" />
          {messageCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-xs text-white rounded-full flex items-center justify-center border-2 border-white">{messageCount}</span>
          )}
        </button>
        {/* Profile Avatar */}
        <button
          aria-label="Profile"
          className="ml-2"
          onClick={() => navigate('/admin/settings')}
        >
          <Avatar className="h-8 w-8 border-2 border-gray-200 shadow-sm">
            {admin && admin.avatar ? (
              <img src={admin.avatar} alt={admin.name} />
            ) : (
              <AvatarFallback>{admin ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase() : ''}</AvatarFallback>
            )}
          </Avatar>
        </button>
        <span className="hidden md:inline text-gray-900 font-medium ml-2">{admin ? admin.name : ''}</span>
      </div>
    </header>
  );
};

export default AdminHeader;
