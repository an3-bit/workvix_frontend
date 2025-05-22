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
  DollarSign 
} from 'lucide-react';

// Types
interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  postedDate: string;
  deadline: string;
  status: 'active' | 'completed' | 'cancelled';
  bidsCount: number;
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
    title: 'React Website Development',
    description: 'Need a developer to build a responsive React website with TypeScript.',
    budget: 500,
    postedDate: '2025-05-01',
    deadline: '2025-05-15',
    status: 'active',
    bidsCount: 8
  },
  {
    id: 'job2',
    title: 'Logo Design',
    description: 'Looking for a creative designer to create a modern logo for my startup.',
    budget: 150,
    postedDate: '2025-05-03',
    deadline: '2025-05-10',
    status: 'active',
    bidsCount: 12
  },
  {
    id: 'job3',
    title: 'Content Writing for Blog',
    description: 'Need SEO-friendly content for my technology blog.',
    budget: 200,
    postedDate: '2025-04-28',
    deadline: '2025-05-20',
    status: 'active',
    bidsCount: 5
  }
];

const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    message: 'John Doe has placed a bid on your "React Website Development" job',
    read: false,
    date: '2025-05-05T10:30:00'
  },
  {
    id: 'notif2',
    message: 'Sarah Smith sent you a message',
    read: true,
    date: '2025-05-04T15:45:00'
  },
  {
    id: 'notif3',
    message: 'Your job "Logo Design" has 3 new bids',
    read: false,
    date: '2025-05-04T09:15:00'
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
              onClick={() => navigate('/client')}
            >
              <Briefcase size={20} />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/post-job')}
            >
              <Briefcase size={20} />
              <span>Post a Job</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/client/jobs')}
            >
              <Briefcase size={20} />
              <span>My Jobs</span>
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
              onClick={() => navigate('/client/profile')}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </li>
          <li>
            <button 
              className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all"
              onClick={() => navigate('/client/settings')}
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
              <div className="p-2 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            <User size={20} className="text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-sm">John Smith</p>
            <p className="text-xs text-gray-500">Client</p>
          </div>
        </div>
      </div>
    </header>
  );
};

const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Active Jobs</p>
            <p className="text-2xl font-semibold mt-1">3</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Briefcase size={24} className="text-blue-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Bids</p>
            <p className="text-2xl font-semibold mt-1">25</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <DollarSign size={24} className="text-green-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Completed Jobs</p>
            <p className="text-2xl font-semibold mt-1">12</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <Star size={24} className="text-purple-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">In Progress</p>
            <p className="text-2xl font-semibold mt-1">2</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-full">
            <Clock size={24} className="text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

const JobsList: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">My Jobs</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bids</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{job.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${job.budget}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(job.postedDate).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(job.deadline).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${job.status === 'active' ? 'bg-green-100 text-green-800' : 
                      job.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'}`}
                  >
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.bidsCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => navigate(`/client/view-bids/${job.id}`)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    View Bids
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ClientDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  
  useEffect(() => {
    // In a real app, you would fetch jobs from an API
    setJobs(mockJobs);
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <StatsCards />
          <JobsList jobs={jobs} />
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;