import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Users, ClipboardList, TrendingUp, DollarSign } from 'lucide-react';

interface AffiliateSidebarProps {
  active: 'Overview' | 'Clients' | 'Freelancers' | 'Jobs' | 'Commission Summary';
}

const links = [
  { label: 'Overview', href: '/affiliate/dashboard', icon: <BarChart2 className="h-5 w-5" /> },
  { label: 'Clients', href: '/affiliate/clients', icon: <Users className="h-5 w-5" /> },
  { label: 'Freelancers', href: '/affiliate/freelancers', icon: <ClipboardList className="h-5 w-5" /> },
  { label: 'Jobs', href: '/affiliate/jobs', icon: <TrendingUp className="h-5 w-5" /> },
  { label: 'Commission Summary', href: '/affiliate/commissions', icon: <DollarSign className="h-5 w-5" /> },
];

const AffiliateSidebar: React.FC<AffiliateSidebarProps> = ({ active }) => (
  <aside className="bg-white shadow-lg h-full w-64 flex-shrink-0 flex flex-col py-8 px-4 border-r border-gray-100">
    <div className="mb-8 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">Affiliate</div>
    <nav className="flex-1 flex flex-col gap-2">
      {links.map(link => (
        <Link
          key={link.label}
          to={link.href}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${active === link.label ? 'bg-gradient-to-r from-green-600 to-orange-500 text-white shadow' : 'text-gray-700 hover:bg-green-50'}`}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  </aside>
);

export default AffiliateSidebar; 