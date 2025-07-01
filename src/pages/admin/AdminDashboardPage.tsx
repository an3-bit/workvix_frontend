import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Removed useNavigate as it's not directly used here for navigation logic
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import OverviewDashboard from '@/components/admin/OverviewDashboard';
import ManageJobs from '@/components/admin/ManageJobs';
import ManageClients from '@/components/admin/ManageClients';
import ManageFreelancers from '@/components/admin/ManageFreelancers';
import ManagePayments from '@/components/admin/ManagePayments';

// New Admin Management Components
import ManageMessages from '@/components/admin/ManageMessages';
import ManageFeedback from '@/components/admin/ManageFeedback';
import ManageCoupons from '@/components/admin/ManageCoupons';
import ManageFreelancerApplications from '@/components/admin/ManageFreelancerApplications';
import ManageSamples from '@/components/admin/ManageSamples';
import ManageNews from '@/components/admin/ManageNews';
import ManageSupportTickets from '@/components/admin/ManageSupportTickets';
import SystemSettings from '@/components/admin/SystemSettings'; // Example for settings
import ManageAffiliateMarketers from './ManageAffiliateMarketers';
import { Menu } from 'lucide-react';
import ActivityLog from '@/components/admin/ActivityLog';


interface AdminDashboardPageProps {
  adminEmail: string; // Passed from AdminProtectedRoute
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ adminEmail }) => {
  // State to track the active sidebar link, not strictly needed with NavLink but good for complex logic
  const [activePath, setActivePath] = useState(window.location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavLinkClick = (path: string) => {
    setActivePath(path);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex w-full min-h-screen">
        {/* Sidebar for desktop, drawer for mobile */}
        <div className="hidden md:block fixed top-0 left-0 h-full z-30">
          <AdminSidebar onNavLinkClick={handleNavLinkClick} />
        </div>
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative z-50 w-64 max-w-full h-full bg-gray-900 shadow-xl">
              <AdminSidebar onNavLinkClick={handleNavLinkClick} />
            </div>
          </div>
        )}
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-h-screen md:ml-64">
          {/* Header with menu button for mobile */}
          <div className="sticky top-0 z-30">
            <div className="md:hidden flex items-center bg-white border-b border-gray-100 shadow-sm h-16 px-4">
              <button
                className="p-2 rounded-md text-gray-700 hover:bg-gray-200 focus:outline-none mr-2"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              <span className="text-xl font-bold text-blue-600">Admin Panel</span>
            </div>
            <div className="hidden md:block">
              <AdminHeader adminEmail={adminEmail} />
            </div>
          </div>
          <main className="flex-1 overflow-y-auto p-2 sm:p-4 w-full">
            <Routes>
              <Route path="/" element={<OverviewDashboard />} />
              <Route path="/jobs" element={<ManageJobs />} />
              <Route path="/users/clients" element={<ManageClients />} />
              <Route path="/users/freelancers" element={<ManageFreelancers />} />
              <Route path="/users/applications" element={<ManageFreelancerApplications />} />
              <Route path="/users/talent-pools" element={<h2 className="text-2xl p-6">Talent Pools (View Freelancers, Filtered)</h2>} />
              <Route path="/messages" element={<ManageMessages />} />
              <Route path="/feedback" element={<ManageFeedback />} />
              <Route path="/coupons" element={<ManageCoupons />} />
              <Route path="/samples" element={<ManageSamples />} />
              <Route path="/news" element={<ManageNews />} />
              <Route path="/support-tickets" element={<ManageSupportTickets />} />
              <Route path="/payments/*" element={<ManagePayments />} />
              <Route path="/settings" element={<SystemSettings />} />
              <Route path="/settings/system" element={<Navigate to="/settings" replace />} />
              <Route path="/settings/orders-payments" element={<Navigate to="/settings" replace />} />
              <Route path="/settings/themes" element={<Navigate to="/settings" replace />} />
              <Route path="/settings/email" element={<Navigate to="/settings" replace />} />
              <Route path="/settings/notifications" element={<Navigate to="/settings" replace />} />
              <Route path="/activity-log" element={<ActivityLog />} />
              <Route path="/affiliate-marketers" element={<ManageAffiliateMarketers />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
