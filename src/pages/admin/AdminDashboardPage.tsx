import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed useNavigate as it's not directly used here for navigation logic
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


interface AdminDashboardPageProps {
  adminEmail: string; // Passed from AdminProtectedRoute
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ adminEmail }) => {
  // State to track the active sidebar link, not strictly needed with NavLink but good for complex logic
  const [activePath, setActivePath] = useState(window.location.pathname);

  const handleNavLinkClick = (path: string) => {
    setActivePath(path);
    // NavLink handles navigation, so no need for navigate(path) here
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar onNavLinkClick={handleNavLinkClick} />
      <div className="flex-1 flex flex-col">
        <AdminHeader adminEmail={adminEmail} />
        <main className="flex-1 overflow-y-auto p-4">
          <Routes>
            {/* Main Dashboard Overview */}
            <Route path="/" element={<OverviewDashboard />} />

            {/* Job Management */}
            <Route path="/jobs/*" element={<ManageJobs />} /> {/* Wildcard for /jobs/all, /jobs/open etc. if ManageJobs handles sub-views internally */}
            {/* If you wanted separate components for job statuses:
            <Route path="/jobs/all" element={<ManageJobs status="all" />} />
            <Route path="/jobs/open" element={<ManageJobs status="open" />} />
            ... */}

            {/* User Management */}
            <Route path="/users/clients" element={<ManageClients />} />
            <Route path="/users/freelancers" element={<ManageFreelancers />} />
            <Route path="/users/applications" element={<ManageFreelancerApplications />} />
            <Route path="/users/talent-pools" element={<h2 className="text-2xl p-6">Talent Pools (View Freelancers, Filtered)</h2>} /> {/* Placeholder */}

            {/* Core Features Management */}
            <Route path="/messages" element={<ManageMessages />} />
            <Route path="/feedback" element={<ManageFeedback />} />
            <Route path="/coupons" element={<ManageCoupons />} />
            <Route path="/samples" element={<ManageSamples />} />
            <Route path="/news" element={<ManageNews />} />
            <Route path="/support-tickets" element={<ManageSupportTickets />} />
            
            {/* Payments Management */}
            <Route path="/payments/*" element={<ManagePayments />} /> {/* Wildcard for sub-pages like /payments/all, /payments/payouts etc. */}

            {/* Settings */}
            <Route path="/settings/system" element={<SystemSettings />} />
            <Route path="/settings/orders-payments" element={<h2 className="text-2xl p-6">Orders & Payments Settings (Coming Soon!)</h2>} />
            <Route path="/settings/themes" element={<h2 className="text-2xl p-6">Theme Settings (Coming Soon!)</h2>} />
            <Route path="/settings/email" element={<h2 className="text-2xl p-6">Email Settings (Coming Soon!)</h2>} />

            {/* Activity Log (read-only) */}
            <Route path="/activity-log" element={<h2 className="text-2xl p-6">Activity Log (Coming Soon!)</h2>} />

            {/* Catch-all for unknown admin sub-routes */}
            <Route path="*" element={<h1 className="text-center mt-20 text-3xl font-bold text-gray-700">Admin Sub-Page Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
