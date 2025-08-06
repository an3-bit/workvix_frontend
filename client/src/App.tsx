import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/general/Index";
import ButtonWithLocationCheck from "./components/ButtonWithLocationCheck";
// Lazy load all other pages/components
const FreelancerDashboard = lazy(() => import("./pages/freelancer/dashboard/DashboardPage"));
const ClientDashboard = lazy(() => import("./pages/client/clientdashboard")); // Renamed to clientdashboard.tsx
const PremiumServices = lazy(() => import("./pages/general/PremiumServices"));
const BecomeSeller = lazy(() => import("./pages/general/BecomeSeller"));
const ClientChatPage = lazy(() => import("./pages/client/communication/ChatPage")); // Renamed from ClientChatPage.tsx
const ChatSystem = lazy(() => import("./components/chat/ChatSystem"));
const AdminProtectedRoute = lazy(() => import("./components/admin/AdminProtectedRoute"));
const AdminDashboardPage = lazy(() => import("./pages/admin/dashboard/DashboardPage")); // Renamed from AdminDashboardPage.tsx
const AdminLogin = lazy(() => import("./components/admin/AdminLogin"));
const AffiliateLayout = lazy(() => import("./pages/affiliate/AffiliateDashboard").then(mod => ({ default: mod.AffiliateLayout })));
const ProfileSettings = lazy(() => import('./pages/client/settings/ProfileSettingsPage')); // Renamed from ProfileSettings.tsx
const Payments = lazy(() => import('./pages/client/payments/PaymentsPage')); // Renamed from Payments.tsx


const queryClient = new QueryClient();

// Lazy load components
const SignIn = lazy(() => import("./pages/general/SignIn"));
const Join = lazy(() => import("./pages/general/Join"));
const JoinSelection = lazy(() => import("./pages/general/joinselection"));
const Dashboard = lazy(() => import("./pages/general/Dashboard"));
const JobsPage = lazy(() => import("./pages/general/JobsPage"));
const FreelancerBidsPage = lazy(() => import("./pages/general/FreelancerBidsPage"));
const JobsBid = lazy(() => import("./pages/general/JobsBid"));
const CheckoutPage = lazy(() => import("./pages/general/CheckoutPage"));
const UpgradeToProPage = lazy(() => import("./pages/general/UpgradeToProPage"));
const OrdersPage = lazy(() => import("./pages/general/OrdersPage"));
const WorkVixGoPage = lazy(() => import("./pages/general/WorkVixGoPage"));
const WishlistPage = lazy(() => import("./pages/general/WishlistPage"));
const PostJobForm = lazy(() => import("./components/postjob"));
const FreelancerNotifications = lazy(() => import("./pages/freelancer/communication/NotificationsPage")); // Consolidated notification page
const FreelancerPortfolio = lazy(() => import("./pages/freelancer/portfolio/PortfolioPage")); // Renamed from FreelancerPortfolio.tsx
const FreelancerEarnings = lazy(() => import("./pages/freelancer/earnings/EarningsPage")); // Renamed from FreelancerEarnings.tsx
const FreelancerProfile = lazy(() => import("./pages/freelancer/portfolio/ProfilePage")); // Renamed from FreelancerProfile.tsx
const Blog = lazy(() => import("./pages/general/Blog"));
const BlogPost = lazy(() => import("./pages/general/BlogPost"));
const ExploreSkills = lazy(() => import("./pages/general/ExploreSkills"));
const ClientBidsPage = lazy(() => import("./pages/client/bids/BidsPage"));
const ClientMyJobs = lazy(() => import("./pages/client/jobs/MyJobsPage")); // Renamed from MyJobs.tsx
const OrderForm = lazy(() => import("./pages/general/OrderForm"));
const AffiliateDashboard = lazy(() => import('./pages/affiliate/AffiliateDashboard').then(mod => ({ default: mod.AffiliateDashboard }))); // Renamed from AffiliateDashboard.tsx
const ChatPage = lazy(() => import('./pages/general/ChatPage'));
const AffiliateManageClients = lazy(() => import("./pages/affiliate/ManageClients"));
const AffiliateManageFreelancers = lazy(() => import("./pages/affiliate/ManageFreelancers"));
const AffiliateManageJobs = lazy(() => import("./pages/affiliate/ManageJobs"));
const JobDetailsPage = lazy(() => import("./pages/general/JobDetailsPage"));
const BidsDetailsPage = lazy(() => import("./pages/general/BidsDetailsPage"));
const ServicesPage = lazy(() => import("./components/services"));
const Privacy = lazy(() => import("./pages/general/Privacy"));
const Terms = lazy(() => import("./pages/general/Terms"));
const Help = lazy(() => import("./pages/general/Help"));
const Trust = lazy(() => import("./pages/general/Trust"));
const PlaceholderPage = lazy(() => import("./pages/general/PlaceholderPage"));
const AffiliateRegister = lazy(() => import("./pages/affiliate/AffiliateRegister"));
const AffiliateSignIn = lazy(() => import("./pages/affiliate/AffiliateSignIn").then(module => ({ default: module.default })));

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
          <BrowserRouter>
        {/* BrowserRouter removed as it's handled in main.tsx or higher level */}
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/join" element={<JoinSelection />} />
              <Route path="/joinselection" element={<JoinSelection />} />
              <Route path="/join/:role" element={<Join />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
              <Route path="/bids" element={<FreelancerBidsPage />} />
              <Route path="/jobs/:jobId/bids" element={<JobsBid />} />
              <Route path="/checkout/:bidId?" element={<CheckoutPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/freelancer" element={<FreelancerDashboard />} />
              <Route path="/freelancer/profile" element={<FreelancerProfile />} />
              <Route path="/client" element={<ClientDashboard />} />
              <Route path="/client/bids" element={<ClientBidsPage />} />
              <Route path="/client/jobs" element={<ClientMyJobs />} />
              <Route path="/order/:bidId" element={<OrderForm />} />
              <Route path="/freelancer/notifications" element={<FreelancerNotifications />} />
              <Route path="/client/notifications" element={<ClientBidsPage />} /> {/* Update this route as needed based on where client notifications should go */}
              <Route path="/upgrade" element={<UpgradeToProPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/pro" element={<WorkVixGoPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/post-job" element={<PostJobForm />} />
              <Route path="/freelancer/portfolio" element={<FreelancerPortfolio />} />
              <Route path="/freelancer/earnings" element={<FreelancerEarnings />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/explore-skills" element={<ExploreSkills />} />
              <Route path="/premium-services" element={<PremiumServices />} />
              <Route path="/become-seller" element={<BecomeSeller />} />
              {/* <Route path="/job-posted-notification" element={<JobPostedNotification />} /> Corrected import path */}
              {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/client/chat" element={<ClientChatPage />} />
              <Route path="/bids-details/:bidId" element={<BidsDetailsPage />} />
              <Route path="/chat-interface" element={<ChatSystem jobId={null} bidId={null} receiverId={null} />} />
              {/* Admin Specific Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              {/* Protected Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboardPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/chat-system"
                element={
                  <ChatSystem jobId={null} bidId={null} receiverId={null} />
                }
              />
              <Route path="/affiliate/register" element={<AffiliateRegister />} />
              {/* Affiliate Sign-in Route */}
              <Route path="/affiliate/signin" element={<AffiliateSignIn />} />
              <Route path="/affiliate" element={<AffiliateLayout active="" />}>
                <Route path="dashboard" element={<AffiliateDashboard />} />
                <Route path="clients" element={<AffiliateManageClients />} />
                <Route path="freelancers" element={<AffiliateManageFreelancers />} />
                <Route path="jobs" element={<AffiliateManageJobs />} />
                {/* <Route path="commissions" element={<AffiliateCommissionSummary />} /> */}
                <Route index element={<AffiliateDashboard />} />
              </Route>
              {/* <Route path="/admin/affiliate-marketers" element={<AdminManageAffiliateMarketers />} /> */}
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/client/payments" element={<Payments />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/help" element={<Help />} />
              <Route path="/trust" element={<Trust />} />
              <Route path="/careers" element={<PlaceholderPage />} />
              <Route path="/press" element={<PlaceholderPage />} />
              <Route path="/partnerships" element={<PlaceholderPage />} />
              <Route path="/ip" element={<PlaceholderPage />} />
              <Route path="/investors" element={<PlaceholderPage />} />
              <Route path="/success-stories" element={<PlaceholderPage />} />
              <Route path="/community" element={<PlaceholderPage />} />
              <Route path="/forum" element={<PlaceholderPage />} />
              <Route path="/events" element={<PlaceholderPage />} />
              <Route path="/influencers" element={<PlaceholderPage />} />
              <Route path="/cookies" element={<PlaceholderPage />} />
              <Route path="/accessibility" element={<PlaceholderPage />} />
          </Routes>
          <ButtonWithLocationCheck />
          </Suspense>
          </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

