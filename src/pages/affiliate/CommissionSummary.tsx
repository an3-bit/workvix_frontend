import React from 'react';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AffiliateDashboard from './AffiliateDashboard';

const AffiliateSidebar = AffiliateDashboard?.Sidebar || (({ active }: { active: string }) => null);

const CommissionSummary: React.FC = () => (
  <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <AffiliateSidebar active="Commission Summary" />
    <main className="flex-1 p-8">
      {/* Topbar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Commission Summary</h1>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Withdraw</Button>
      </div>
      {/* Main Content */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="h-6 w-6 text-green-600" />
          <span className="text-lg font-semibold text-gray-900">Your commission history will appear here.</span>
        </div>
        <div className="text-gray-500">No commissions found yet. Start referring to earn commissions!</div>
      </div>
    </main>
  </div>
);
export default CommissionSummary; 