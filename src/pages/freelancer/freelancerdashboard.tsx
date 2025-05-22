import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Briefcase, 
  User, 
  Bell, 
  Settings, 
  LogOut, 
  Search, 
  Star, 
  Clock, 
  DollarSign,
  FileText,
  CheckCircle,
  Award
} from 'lucide-react';

// Types
interface Job {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  budget: number;
  postedDate: string;
  deadline: string;
  status: 'open' | 'in-progress' | 'completed';
  category: string;
  skills: string[];
}

interface Bid {
  id: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  proposedAmount: number;
  bidDate: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface Notification {
  id: string;
  message: string;
  read: boolean;
  date: string;
}

// Mock data
const mockJobs: Job[] = [
  {
    id: 'job1',
    clientId: 'client1',
    clientName: 'John Smith',
    title: 'React Website Development',
    description: 'Need a developer to build a responsive React website with TypeScript.',
    budget: 500,
    postedDate: '2025-05-01',
    deadline: '2025-05-15',
    status: 'open',
    category: 'Web Development',
    skills: ['React', 'TypeScript', 'Responsive Design']
  },
  {
    id: 'job2',
    clientId: 'client2',
    clientName: 'Emily Johnson',
    title: 'E-commerce Platform Integration',
    description: 'Looking to integrate payment gateway and shopping cart functionality into my website.',
    budget: 800,
    postedDate: '2025-05-02',
    deadline: '2025-05-20',
    status: 'open',
    category: 'Web Development',
    skills: ['E-commerce', 'API Integration', 'Payment Gateways']
  },
  {
    id: 'job3',
    clientId: 'client3',
    clientName: 'Michael Brown',
    title: 'Mobile App UI Design',
    description: 'Need a clean, modern UI design for a fitness tracking mobile app.',
    budget: 600,
    postedDate: '2025-05-03',
    deadline: '2025-05-18',
    status: 'open',
    category: 'UI/UX Design',
    skills: ['Mobile Design', 'UI/UX', 'Figma']
  },
  {
    id: 'job4',
    clientId: 'client4',
    clientName: 'Sarah Williams',
    title: 'WordPress Blog Customization',
    description: 'Need to customize an existing WordPress theme for my personal blog.',
    budget: 300,
    postedDate: '2025-05-04',
    deadline: '2025-05-12',
    status: 'open',
    category: 'WordPress',
    skills: ['WordPress', 'CSS', 'PHP']
  },
  {
    id: 'job5',
    clientId: 'client5',
    clientName: 'David Miller',
    title: 'SEO Optimization',
    description: "Looking for an SEO expert to improve my website's search ranking.",
    budget: 450,
    postedDate: '2025-05-05',
    deadline: '2025-05-25',
    status: 'open',
    category: 'Digital Marketing',
    skills: ['SEO', 'Content Marketing', 'Analytics']
  }
];

const mockBids: Bid[] = [
  {
    id: 'bid1',
    jobId: 'job1',
    jobTitle: 'React Website Development',
    clientName: 'John Smith',
    proposedAmount: 480,
    bidDate: '2025-05-02',
    status: 'pending'
  },
  {
    id: 'bid2',
    jobId: 'job3',
    jobTitle: 'Mobile App UI Design',
    clientName: 'Michael Brown',
    proposedAmount: 550,
    bidDate: '2025-05-04',
    status: 'accepted'
  },
  {
    id: 'bid3',
    jobId: 'job5',
    jobTitle: 'SEO Optimization',
    clientName: 'David Miller',
    proposedAmount: 400,
    bidDate: '2025-05-06',
    status: 'pending'
  }
];

const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    message: 'Your bid for "Mobile App UI Design" has been accepted!',
    read: false,
    date: '2025-05-04T14:30:00'
  },
  {
    id: 'notif2',
    message: 'John Smith sent you a message regarding your bid',
    read: true,
    date: '2025-05-03T10:15:00'
  },
  {
    id: 'notif3',
    message: 'New job posted that matches your skills: "E-commerce Platform Integration"',
    read: false,
    date: '2025-05-02T09:45:00'
  }
];

// Components
const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gray-800 text-white h-screen w-64 fixed left-0 top-0 p-5">
      <div className="flex items-center justify-center mb-10">
        <h1 className="text-2xl font-bold">FreelanceHub</h1>
      </div>
      
      <nav>
        <ul className="space-y-4">
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/freelancer')}
            >
              <Briefcase size={20} />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/find-jobs')}
            >
              <Search size={20} />
              <span>Find Jobs</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/freelancer/my-bids')}
            >
              <FileText size={20} />
              <span>My Bids</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/chat')}
            >
              <MessageSquare size={20} />
              <span>Messages</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/freelancer/profile')}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/freelancer/earnings')}
            >
              <DollarSign size={20} />
              <span>Earnings</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/freelancer/settings')}
            >
              <Settings size={20} />
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
            placeholder="Search jobs..." 
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
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {mockNotifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
const FreelancerDashboard: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-100">
        <Header />
        {/* Main dashboard content can go here */}
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">Welcome to your Freelancer Dashboard!</h2>
          {/* Example: List of jobs, bids, stats, etc. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Briefcase size={18} /> Open Jobs
              </h3>
              <ul>
                {mockJobs.map(job => (
                  <li key={job.id} className="mb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{job.title}</span>
                        <span className="ml-2 text-xs text-gray-500">({job.category})</span>
                      </div>
                      <span className="text-green-600 font-semibold">${job.budget}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Deadline: {job.deadline}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <FileText size={18} /> My Bids
              </h3>
              <ul>
                {mockBids.map(bid => (
                  <li key={bid.id} className="mb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{bid.jobTitle}</span>
                        <span className="ml-2 text-xs text-gray-500">({bid.clientName})</span>
                      </div>
                      <span className={`font-semibold ${bid.status === 'accepted' ? 'text-green-600' : bid.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Bid: ${bid.proposedAmount} on {bid.bidDate}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;