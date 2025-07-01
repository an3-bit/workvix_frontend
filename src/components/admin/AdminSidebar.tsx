import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, List, MessageSquare, Star, DollarSign,
  Gift, Briefcase, FileText, Activity, Rss, Settings, Users,
  ClipboardList, Package, ScrollText, Building2, User2, BookUser,
  SquareKanban, FileBadge, LifeBuoy, ChevronDown, ChevronUp, LogOut
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminSidebarProps {
  onNavLinkClick: (path: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavLinkClick }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to toggle the open/close state of a menu
  const toggleMenu = (name: string) => {
    setOpenMenus(prevOpenMenus => ({
      ...prevOpenMenus,
      [name]: !prevOpenMenus[name],
    }));
  };

  // Effect to automatically open the parent menu if a sub-item's path matches the current URL
  React.useEffect(() => {
    menuItems.forEach(item => {
      if (item.subItems) {
        const isSubItemActive = item.subItems.some(subItem =>
          location.pathname.startsWith(subItem.path)
        );
        if (isSubItemActive && !openMenus[item.name]) {
          setOpenMenus(prevOpenMenus => ({
            ...prevOpenMenus,
            [item.name]: true,
          }));
        }
      }
    });
  }, [location.pathname]); // Re-run when the path changes

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
      console.error('Logout error:', error.message);
      toast({
        title: 'Error',
        description: error.message || 'Failed to log out.',
        variant: 'destructive',
      });
    }
  };

  const menuItems = [
    {
      name: 'Overview',
      icon: LayoutDashboard,
      path: '/admin',
    },
    {
      name: 'Jobs',
      icon: Briefcase,
      path: '/admin/jobs',
    },
    {
      name: 'Messages',
      icon: MessageSquare,
      path: '/admin/messages',
    },
    {
      name: 'Feedback',
      icon: Star,
      path: '/admin/feedback',
    },
    {
      name: 'Payments',
      icon: DollarSign,
      path: '/admin/payments',
      subItems: [
        { name: 'All Transactions', path: '/admin/payments/all' },
        { name: 'Payouts', path: '/admin/payments/payouts' },
        { name: 'Deposits', path: '/admin/payments/deposits' },
      ],
    },
    {
      name: 'Coupons',
      icon: Gift,
      path: '/admin/coupons',
    },
    {
      name: 'Users',
      icon: Users,
      path: '/admin/users',
      subItems: [
        { name: 'Clients', path: '/admin/users/clients' },
        { name: 'Freelancers', path: '/admin/users/freelancers' },
        { name: 'Applications', path: '/admin/users/applications' },
        { name: 'Talent Pools', path: '/admin/users/talent-pools' },
      ],
    },
    {
      name: 'Affiliate Marketers',
      icon: Users,
      path: '/admin/affiliate-marketers',
    },
    {
      name: 'Samples',
      icon: ScrollText,
      path: '/admin/samples',
    },
    {
      name: 'News & Announcements',
      icon: Rss,
      path: '/admin/news',
    },
    {
      name: 'Activity Log',
      icon: Activity,
      path: '/admin/activity-log',
    },
    {
      name: 'Support Tickets',
      icon: LifeBuoy,
      path: '/admin/support-tickets',
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/admin/settings',
    },
  ];

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <nav className="w-64 bg-sidebar-background text-sidebar-foreground p-4 flex flex-col overflow-y-auto custom-scrollbar min-h-screen border-r border-sidebar-border shadow-lg">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-sidebar-foreground">Workvix</h2>
      </div>
      <ul className="space-y-1 flex-1 overflow-y-auto max-h-[calc(100vh-100px)] pb-8">
=======
    <nav className="w-64 bg-gray-900 text-white p-4 flex flex-col overflow-y-auto custom-scrollbar min-h-screen border-r border-gray-800 shadow-lg">
=======
    <nav className="w-64 bg-sidebar-background text-sidebar-foreground p-4 flex flex-col overflow-y-auto custom-scrollbar min-h-screen border-r border-sidebar-border shadow-lg">
>>>>>>> 7438431 (admin dashboard)
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-sidebar-foreground">Workvix</h2>
      </div>
      <ul className="space-y-1 flex-1 overflow-y-auto max-h-[calc(100vh-100px)]">
>>>>>>> a02f476 (admin dashboard)
        {menuItems.map((item) => (
          <li key={item.name}>
            {item.subItems ? (
              // If the item has subItems, it becomes a clickable parent
              <div
                className={`flex items-center justify-between space-x-3 p-3 rounded-md transition-colors duration-200 cursor-pointer ${
                  openMenus[item.name] || item.subItems.some(subItem => location.pathname.startsWith(subItem.path))
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                    : 'hover:bg-sidebar-accent text-sidebar-foreground'
                }`}
                onClick={() => {
                  toggleMenu(item.name);
                  onNavLinkClick(item.path); // You might still want to trigger this for analytics or other side effects
                }}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
                {openMenus[item.name] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            ) : (
              // If no subItems, it's a regular NavLink
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                      : 'hover:bg-sidebar-accent text-sidebar-foreground'
                  }`
                }
                onClick={() => onNavLinkClick(item.path)}
                end={item.path === '/admin'}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            )}

            {/* Render sub-items only if the menu is open */}
            {item.subItems && openMenus[item.name] && (
              <ul className="ml-6 mt-1 space-y-1">
                {item.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <NavLink
                      to={subItem.path}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 p-2 rounded-md transition-colors duration-200 ${
                          isActive
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow'
                            : 'hover:bg-sidebar-accent text-sidebar-foreground'
                        }`
                      }
                      onClick={() => onNavLinkClick(subItem.path)}
                    >
                      <span>{subItem.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={handleLogout}
        className="mt-8 flex items-center justify-center gap-2 p-3 w-full rounded-md bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:from-red-600 hover:to-pink-600 transition"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default AdminSidebar;