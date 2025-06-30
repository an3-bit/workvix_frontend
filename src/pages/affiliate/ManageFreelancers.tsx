import React from 'react';
import { ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AffiliateDashboard from './AffiliateDashboard';

const AffiliateSidebar = AffiliateDashboard?.Sidebar || (({ active }: { active: string }) => null);

const ManageFreelancers: React.FC = () => (
  <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <AffiliateSidebar active="Freelancers" />
    <main className="flex-1 p-8">
      {/* Topbar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Referred Freelancers</h1>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Add Freelancer</Button>
      </div>
      {/* Main Content */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <ClipboardList className="h-6 w-6 text-purple-600" />
          <span className="text-lg font-semibold text-gray-900">Freelancers you have referred will appear here.</span>
        </div>
        <div className="text-gray-500">No freelancers found yet. Start referring to see your freelancers here!</div>
      </div>
    </main>
  </div>
);
export default ManageFreelancers; 