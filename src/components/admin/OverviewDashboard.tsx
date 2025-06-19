import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, Briefcase, MessageSquare } from 'lucide-react';

const OverviewDashboard: React.FC = () => {
  // Placeholder data - in a real app, you'd fetch these from Supabase
  const totalSales = 17748;
  const monthlySales = 258.4;
  const thisMonthSoFar = 28; // Assuming this is new revenue this month
  const totalCustomers = 12;
  const totalFreelancers = 5;
  const openJobs = 7;
  const newMessages = 3;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-blue-100">
              ${monthlySales} in last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${thisMonthSoFar}</div>
            <p className="text-xs text-green-100">
              Total earnings so far this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-purple-100">
              Registered clients on Workvix
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-white opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openJobs}</div>
            <p className="text-xs text-orange-100">
              Active jobs awaiting freelancers
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for a list of recent activities */}
            <ul className="space-y-2 text-sm text-gray-700">
              <li>- New job posted: "Build a Custom E-commerce Site"</li>
              <li>- Freelancer John Doe completed job #1234</li>
              <li>- New client registered: Jane Smith</li>
              <li>- Offer accepted for job "Mobile App UI Design"</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Messages</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for latest messages */}
            <ul className="space-y-2 text-sm text-gray-700">
              <li>- From Client A: "Can you provide an update on my job?"</li>
              <li>- From Freelancer B: "I've submitted my proposal for Job #5678."</li>
              <li>- From Client C: "Question about payment process."</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewDashboard;
