import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, List, MessageSquare, Star, DollarSign,
  Gift, Briefcase, FileText, Activity, Rss, Settings, Users,
  ClipboardList, Package, ScrollText, Building2, User2, BookUser,
  SquareKanban, FileBadge, LifeBuoy, ChevronDown, ChevronUp // Added ChevronDown and ChevronUp
} from 'lucide-react';

interface AdminSidebarProps {
  onNavLinkClick: (path: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onNavLinkClick }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

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
      subItems: [
        { name: 'All Jobs', path: '/admin/jobs/all' },
        { name: 'Open Jobs', path: '/admin/jobs/open' },
        { name: 'Assigned Jobs', path: '/admin/jobs/assigned' },
        { name: 'Completed Jobs', path: '/admin/jobs/completed' },
        { name: 'Disputed Jobs', path: '/admin/jobs/disputed' },
      ],
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
      subItems: [
        { name: 'System Settings', path: '/admin/settings/system' },
        { name: 'Orders & Payments', path: '/admin/settings/orders-payments' },
        { name: 'Theme Settings', path: '/admin/settings/themes' },
        { name: 'Email Settings', path: '/admin/settings/email' },
      ],
    },
  ];

  return (
    <nav className="w-64 bg-gray-900 text-white p-4 flex flex-col overflow-y-auto custom-scrollbar">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-blue-400">Workvix</h2>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.name}>
            {item.subItems ? (
              // If the item has subItems, it becomes a clickable parent
              <div
                className={`flex items-center justify-between space-x-3 p-3 rounded-md transition-colors duration-200 cursor-pointer ${
                  openMenus[item.name] || item.subItems.some(subItem => location.pathname.startsWith(subItem.path))
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'hover:bg-gray-700 text-gray-300'
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
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'hover:bg-gray-700 text-gray-300'
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
                        `flex items-center space-x-3 p-2 rounded-md transition-colors duration-200 text-sm ${
                          isActive
                            ? 'bg-blue-500 text-white'
                            : 'hover:bg-gray-700 text-gray-400'
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
    </nav>
  );
};

export default AdminSidebar;