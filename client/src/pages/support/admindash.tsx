import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  User, 
  Bell, 
  Settings, 
  LogOut, 
  Search, 
  Shield, 
  Activity, 
  DollarSign,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  FileText,
  Sliders
} from 'lucide-react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'freelancer';
  status: 'active' | 'suspended' | 'pending';
  registrationDate: string;
  profileCompleteness: number;
}

interface Job {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  budget: number;
  postedDate: string;
  status: 'active' | 'completed' | 'cancelled' | 'disputed';
  bidCount: number;
}

interface Ticket {
  id: string;
  userId: string;
  userName: string;
  userRole: 'client' | 'freelancer';
  subject: string;
  createdAt: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
}

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userRole: 'client' | 'freelancer';
  amount: number;
  type: 'deposit' | 'withdrawal' | 'fee' | 'payment';
  status: 'completed' | 'pending' | 'failed';
  date: string;
}

interface Notification {
  id: string;
  message: string;
  read: boolean;
  date: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'client',
    status: 'active',
    registrationDate: '2025-01-15',
    profileCompleteness: 85
  },
  {
    id: 'user2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'freelancer',
    status: 'active',
    registrationDate: '2025-02-03',
    profileCompleteness: 100
  },
  {
    id: 'user3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    role: 'client',
    status: 'active',
    registrationDate: '2025-02-18',
    profileCompleteness: 70
  },
  {
    id: 'user4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'freelancer',
    status: 'pending',
    registrationDate: '2025-05-10',
    profileCompleteness: 40
  },
  {
    id: 'user5',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    role: 'client',
    status: 'suspended',
    registrationDate: '2025-03-22',
    profileCompleteness: 90
  }
];

const mockJobs: Job[] = [
  {
    id: 'job1',
    title: 'React Website Development',
    clientName: 'John Smith',
    clientId: 'user1',
    budget: 500,
    postedDate: '2025-05-01',
    status: 'active',
    bidCount: 8
  },
  {
    id: 'job2',
    title: 'Logo Design',
    clientName: 'Michael Brown',
    clientId: 'user3',
    budget: 150,
    postedDate: '2025-05-03',
    status: 'active',
    bidCount: 12
  },
  {
    id: 'job3',
    title: 'WordPress Theme Customization',
    clientName: 'David Wilson',
    clientId: 'user5',
    budget: 300,
    postedDate: '2025-04-28',
    status: 'disputed',
    bidCount: 5
  },
  {
    id: 'job4',
    title: 'Mobile App Development',
    clientName: 'John Smith',
    clientId: 'user1',
    budget: 1200,
    postedDate: '2025-04-15',
    status: 'completed',
    bidCount: 10
  },
  {
    id: 'job5',
    title: 'Content Writing',
    clientName: 'Michael Brown',
    clientId: 'user3',
    budget: 200,
    postedDate: '2025-05-04',
    status: 'cancelled',
    bidCount: 3
  }
];

const mockTickets: Ticket[] = [
  {
    id: 'ticket1',
    userId: 'user2',
    userName: 'Sarah Johnson',
    userRole: 'freelancer',
    subject: 'Payment not received for completed job',
    createdAt: '2025-05-05T09:30:00',
    status: 'open',
    priority: 'high'
  },
  {
    id: 'ticket2',
    userId: 'user1',
    userName: 'John Smith',
    userRole: 'client',
    subject: 'Freelancer not responding to messages',
    createdAt: '2025-05-04T14:45:00',
    status: 'in-progress',
    priority: 'medium'
  },
  {
    id: 'ticket3',
    userId: 'user5',
    userName: 'David Wilson',
    userRole: 'client',
    subject: 'Dispute with freelancer over deliverables',
    createdAt: '2025-05-03T11:20:00',
    status: 'in-progress',
    priority: 'high'
  },
  {
    id: 'ticket4',
    userId: 'user4',
    userName: 'Emily Davis',
    userRole: 'freelancer',
    subject: 'Account verification issue',
    createdAt: '2025-05-02T16:10:00',
    status: 'open',
    priority: 'low'
  },
  {
    id: 'ticket5',
    userId: 'user3',
    userName: 'Michael Brown',
    userRole: 'client',
    subject: 'Need help posting a job',
    createdAt: '2025-05-01T13:05:00',
    status: 'resolved',
    priority: 'medium'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'trans1',
    userId: 'user1',
    userName: 'John Smith',
    userRole: 'client',
    amount: 500,
    type: 'deposit',
    status: 'completed',
    date: '2025-05-01T10:30:00'
  },
  {
    id: 'trans2',
    userId: 'user2',
    userName: 'Sarah Johnson',
    userRole: 'freelancer',
    amount: 450,
    type: 'payment',
    status: 'completed',
    date: '2025-05-02T14:20:00'
  },
  {
    id: 'trans3',
    userId: 'user2',
    userName: 'Sarah Johnson',
    userRole: 'freelancer',
    amount: 400,
    type: 'withdrawal',
    status: 'pending',
    date: '2025-05-03T09:45:00'
  },
  {
    id: 'trans4',
    userId: 'user3',
    userName: 'Michael Brown',
    userRole: 'client',
    amount: 150,
    type: 'deposit',
    status: 'failed',
    date: '2025-05-04T11:15:00'
  },
  {
    id: 'trans5',
    userId: 'user1',
    userName: 'John Smith',
    userRole: 'client',
    amount: 50,
    type: 'fee',
    status: 'completed',
    date: '2025-05-05T13:00:00'
  }
];

const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    message: 'New support ticket: Payment not received for completed job',
    read: false,
    date: '2025-05-05T09:30:00'
  },
  {
    id: 'notif2',
    message: 'Job dispute submitted: WordPress Theme Customization',
    read: false,
    date: '2025-05-04T15:45:00'
  },
  {
    id: 'notif3',
    message: 'New user registration: Emily Davis',
    read: true,
    date: '2025-05-04T09:15:00'
  }
];

// Components
const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 p-5">
      <div className="flex items-center justify-center mb-10">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      
      <nav>
        <ul className="space-y-4">
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/admin')}
            >
              <Activity size={20} />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/admin/users')}
            >
              <Users size={20} />
              <span>Users</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/admin/jobs')}
            >
              <Briefcase size={20} />
              <span>Jobs</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/admin/tickets')}
            >
              <HelpCircle size={20} />
              <span>Support Tickets</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/admin/transactions')}
            >
              <DollarSign size={20} />
              <span>Transactions</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/admin/reports')}
            >
              <FileText size={20} />
              <span>Reports</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/admin/settings')}
            >
              <Sliders size={20} />
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-5 w-full left-0 px-5">
        <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all text-red-400">
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

const Header: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  
  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center ml-64">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <button 
            className="relative" 
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={22} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-10 w-80 bg-white shadow-lg rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Notifications</h3>
              <ul className="space-y-2">
                {mockNotifications.map((notification, index) => (
                  <li key={index} className={`flex items-center space-x-2 ${notification.read ? 'text-gray-500' : 'font-semibold'}`}>
                    <div className="flex-shrink-0">
                      {notification.read ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : (
                        <AlertTriangle size={20} className="text-red-500" />
                      )}
                    </div>
                    <div>
                      <p>{notification.message}</p>
                      <span className="text-sm text-gray-400">{new Date(notification.date).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button className="flex items-center space-x-2">
          <User size={22} className="text-gray-600" />
          <span className="text-gray-600">Admin</span>
        </button>
      </div>
    </header>
  );
};

// Main AdminDashboard component
const AdminDashboard: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-100">
        <Header />
        {/* Main dashboard content placeholder */}
        <main className="p-8 ml-64">
          <h2 className="text-3xl font-bold mb-6">Welcome to the Admin Dashboard</h2>
          <p className="text-gray-700 mb-4">
            Use the sidebar to navigate between different sections of the admin panel.
          </p>
          {/* You can add dashboard widgets, stats, tables, etc. here */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;