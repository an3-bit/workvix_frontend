
import React, { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Nav2 from '@/components/Nav2';

const FreelancerEarnings = () => {
  const [showBalance, setShowBalance] = useState(true);

  const earningsData = {
    totalEarnings: 2847.50,
    thisMonth: 450.00,
    lastMonth: 680.25,
    pending: 125.00,
    available: 2722.50
  };

  const recentTransactions = [
    {
      id: 1,
      type: 'payment',
      amount: 150.00,
      description: 'Website Design Project',
      client: 'John Doe',
      date: '2025-01-15',
      status: 'completed'
    },
    {
      id: 2,
      type: 'payment',
      amount: 75.00,
      description: 'Logo Design',
      client: 'Sarah Smith',
      date: '2025-01-12',
      status: 'completed'
    },
    {
      id: 3,
      type: 'pending',
      amount: 125.00,
      description: 'Mobile App UI',
      client: 'Tech Corp',
      date: '2025-01-10',
      status: 'pending'
    }
  ];

  const monthlyData = [
    { month: 'Jan', earnings: 450 },
    { month: 'Feb', earnings: 680 },
    { month: 'Mar', earnings: 520 },
    { month: 'Apr', earnings: 750 },
    { month: 'May', earnings: 430 },
    { month: 'Jun', earnings: 890 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Balance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {showBalance ? `$${earningsData.totalEarnings.toFixed(2)}` : '****'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {showBalance ? `$${earningsData.thisMonth.toFixed(2)}` : '****'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {showBalance ? `$${earningsData.available.toFixed(2)}` : '****'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {showBalance ? `$${earningsData.pending.toFixed(2)}` : '****'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'
                      }`} />
                      <div>
                        <h3 className="font-medium">{transaction.description}</h3>
                        <p className="text-sm text-gray-600">Client: {transaction.client}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {showBalance ? `$${transaction.amount.toFixed(2)}` : '****'}
                      </p>
                      <p className={`text-sm capitalize ${
                        transaction.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2">
                    <div 
                      className="bg-blue-500 w-8 rounded-t"
                      style={{ height: `${(data.earnings / 1000) * 200}px` }}
                    />
                    <span className="text-xs text-gray-600">{data.month}</span>
                    <span className="text-xs font-medium">
                      {showBalance ? `$${data.earnings}` : '***'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FreelancerEarnings;
