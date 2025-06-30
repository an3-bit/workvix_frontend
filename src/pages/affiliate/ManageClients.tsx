import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
// Reuse AffiliateSidebar from AffiliateDashboard
import AffiliateDashboard from './AffiliateDashboard';

const AffiliateSidebar = AffiliateDashboard?.Sidebar || (({ active }: { active: string }) => null);

const ManageClients: React.FC = () => (
  <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <AffiliateSidebar active="Clients" />
    <main className="flex-1 p-8">
      {/* Topbar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Referred Clients</h1>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Add Client</Button>
      </div>
      {/* Main Content */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">Clients you have referred will appear here.</span>
        </div>
        <div className="text-gray-500">No clients found yet. Start referring to see your clients here!</div>
      </div>
    </main>
  </div>
);
export default ManageClients; 