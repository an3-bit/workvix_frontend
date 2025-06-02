
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import { DollarSign, TrendingUp, Calendar, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EarningData {
  id: string;
  project_title: string;
  client_name: string;
  amount: number;
  status: 'pending' | 'completed' | 'withdrawn';
  date: string;
  payment_method?: string;
}

interface EarningsStats {
  total_earnings: number;
  pending_earnings: number;
  available_balance: number;
  this_month: number;
  last_month: number;
}

const FreelancerEarnings: React.FC = () => {
  const [earnings, setEarnings] = useState<EarningData[]>([]);
  const [stats, setStats] = useState<EarningsStats>({
    total_earnings: 0,
    pending_earnings: 0,
    available_balance: 0,
    this_month: 0,
    last_month: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      // Mock data for now - in real app, fetch from database
      const mockEarnings: EarningData[] = [
        {
          id: '1',
          project_title: 'E-commerce Website Development',
          client_name: 'John Smith',
          amount: 2500,
          status: 'completed',
          date: '2024-05-28T10:00:00Z',
          payment_method: 'PayPal'
        },
        {
          id: '2',
          project_title: 'Logo Design',
          client_name: 'Sarah Johnson',
          amount: 500,
          status: 'completed',
          date: '2024-05-25T14:30:00Z',
          payment_method: 'Bank Transfer'
        },
        {
          id: '3',
          project_title: 'Mobile App UI Design',
          client_name: 'Tech Startup Inc.',
          amount: 1200,
          status: 'pending',
          date: '2024-05-30T09:15:00Z'
        },
        {
          id: '4',
          project_title: 'WordPress Theme Development',
          client_name: 'Creative Agency',
          amount: 800,
          status: 'completed',
          date: '2024-04-20T16:45:00Z',
          payment_method: 'Stripe'
        },
        {
          id: '5',
          project_title: 'Content Writing',
          client_name: 'Marketing Pro',
          amount: 300,
          status: 'completed',
          date: '2024-04-15T11:20:00Z',
          payment_method: 'PayPal'
        }
      ];

      const completedEarnings = mockEarnings.filter(e => e.status === 'completed');
      const pendingEarnings = mockEarnings.filter(e => e.status === 'pending');
      
      const totalEarnings = completedEarnings.reduce((sum, e) => sum + e.amount, 0);
      const pendingAmount = pendingEarnings.reduce((sum, e) => sum + e.amount, 0);
      
      // Calculate this month and last month earnings
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      const thisMonthEarnings = completedEarnings.filter(e => {
        const earningDate = new Date(e.date);
        return earningDate.getMonth() === currentMonth && earningDate.getFullYear() === currentYear;
      }).reduce((sum, e) => sum + e.amount, 0);
      
      const lastMonthEarnings = completedEarnings.filter(e => {
        const earningDate = new Date(e.date);
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return earningDate.getMonth() === lastMonth && earningDate.getFullYear() === lastMonthYear;
      }).reduce((sum, e) => sum + e.amount, 0);

      setEarnings(mockEarnings);
      setStats({
        total_earnings: totalEarnings,
        pending_earnings: pendingAmount,
        available_balance: totalEarnings - 1000, // Assuming some amount has been withdrawn
        this_month: thisMonthEarnings,
        last_month: lastMonthEarnings
      });
    } catch (error) {
      console.error('Error fetching earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'withdrawn':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredEarnings = earnings.filter(earning => {
    if (selectedPeriod === 'all') return true;
    
    const earningDate = new Date(earning.date);
    const currentDate = new Date();
    
    if (selectedPeriod === 'this_month') {
      return earningDate.getMonth() === currentDate.getMonth() && 
             earningDate.getFullYear() === currentDate.getFullYear();
    }
    
    if (selectedPeriod === 'last_month') {
      const lastMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
      const lastMonthYear = currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();
      return earningDate.getMonth() === lastMonth && 
             earningDate.getFullYear() === lastMonthYear;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav2 />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
                <p className="text-gray-600 mt-2">Track your income and manage withdrawals</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Download className="h-5 w-5 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Earnings</p>
                    <p className="text-2xl font-semibold mt-1">${stats.total_earnings.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Available Balance</p>
                    <p className="text-2xl font-semibold mt-1">${stats.available_balance.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">This Month</p>
                    <p className="text-2xl font-semibold mt-1">${stats.this_month.toLocaleString()}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        {stats.last_month > 0 
                          ? `+${Math.round(((stats.this_month - stats.last_month) / stats.last_month) * 100)}%`
                          : 'New'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Pending</p>
                    <p className="text-2xl font-semibold mt-1">${stats.pending_earnings.toLocaleString()}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Earnings History</h2>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Time</option>
                    <option value="this_month">This Month</option>
                    <option value="last_month">Last Month</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEarnings.map((earning) => (
                      <tr key={earning.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {earning.project_title}
                          </div>
                          {earning.payment_method && (
                            <div className="text-sm text-gray-500">
                              via {earning.payment_method}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {earning.client_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${earning.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(earning.status)}`}>
                            {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(earning.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEarnings.length === 0 && (
                <div className="p-8 text-center">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No earnings yet</h3>
                  <p className="text-gray-500">Start completing projects to see your earnings here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerEarnings;
