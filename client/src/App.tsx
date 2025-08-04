import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

// Lazy load all other pages/components
const FreelancerDashboard = lazy(() => import("./pages/freelancer/freelancerdashboard"));
const ClientDashboard = lazy(() => import("./pages/client/clientdashboard"));
const PremiumServices = lazy(() => import("./pages/PremiumServices"));
const BecomeSeller = lazy(() => import("./pages/BecomeSeller"));
const JobPostedNotification = lazy(() => import("./pages/jobspostednotification"));
const ResetPassword = lazy(() => import("./pages/reset_password/resetpassword"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const ClientChatPage = lazy(() => import("./pages/client/ClientChatPage"));
const BidsDetailsPage = lazy(() => import("./pages/BidsDetailsPage"));
const ChatSystem = lazy(() => import("./components/chat/ChatSystem"));
const AdminProtectedRoute = lazy(() => import("./components/admin/AdminProtectedRoute"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminLogin = lazy(() => import("./components/admin/AdminLogin"));
const AffiliateLayout = lazy(() => import("./pages/affiliate/AffiliateDashboard").then(mod => ({ default: mod.AffiliateLayout })));
const ProfileSettings = lazy(() => import('./pages/client/ProfileSettings'));
const Payments = lazy(() => import('./pages/client/Payments'));
const AuthGuard = lazy(() => import("./components/AuthGuard"));

const queryClient = new QueryClient();

// Lazy load components
const SignIn = lazy(() => import("./pages/SignIn"));
const Join = lazy(() => import("./pages/Join"));
const JoinSelection = lazy(() => import("./pages/joinselection"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const JobsPage = lazy(() => import("./pages/JobsPage"));
const FreelancerBidsPage = lazy(() => import("./pages/FreelancerBidsPage"));
const JobsBid = lazy(() => import("./pages/JobsBid"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const UpgradeToProPage = lazy(() => import("./pages/UpgradeToProPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const WorkVixGoPage = lazy(() => import("./pages/WorkVixGoPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));
const PostJobForm = lazy(() => import("./components/postjob"));
const FreelancerNotifications = lazy(() => import("./pages/freelancer/FreelancerNotifications"));
const FreelancerPortfolio = lazy(() => import("./pages/freelancer/FreelancerPortfolio"));
const FreelancerEarnings = lazy(() => import("./pages/freelancer/FreelancerEarnings"));
const FreelancerProfile = lazy(() => import("./pages/freelancer/FreelancerProfile"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const ExploreSkills = lazy(() => import("./pages/ExploreSkills"));
const ClientBidsPage = lazy(() => import("./pages/client/BidsPage"));
const ClientMyJobs = lazy(() => import("./pages/client/MyJobs"));
const OrderForm = lazy(() => import("./pages/OrderForm"));
const FreelancerNotificationsPage = lazy(() => import("./pages/freelancer/NotificationsPage"));
const ClientNotification = lazy(() => import("./pages/client/ClientNotification"));
const AffiliateRegister = lazy(() => import("./pages/AffiliateRegister"));
const AffiliateDashboard = lazy(() => import("./pages/affiliate/AffiliateDashboard"));
const AffiliateManageClients = lazy(() => import("./pages/affiliate/ManageClients"));
const AffiliateManageFreelancers = lazy(() => import("./pages/affiliate/ManageFreelancers"));
const AffiliateManageJobs = lazy(() => import("./pages/affiliate/ManageJobs"));
const AffiliateCommissionSummary = lazy(() => import("./pages/affiliate/CommissionSummary"));
const AdminManageAffiliateMarketers = lazy(() => import("./pages/admin/ManageAffiliateMarketers"));
const AffiliateSignIn = lazy(() => import("./pages/AffiliateSignIn"));
const JobDetailsPage = lazy(() => import("./pages/JobDetailsPage"));
const ServicesPage = lazy(() => import("./components/services"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Help = lazy(() => import("./pages/Help"));
const Trust = lazy(() => import("./pages/Trust"));
const PlaceholderPage = lazy(() => import("./pages/PlaceholderPage"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
            <Route path="/freelancer/notifications" element={<FreelancerNotifications/>} />
            <Route path="/client/notifications" element={<ClientNotification />} />
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
            <Route path="/job-posted-notification" element={<JobPostedNotification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
                  <AdminDashboardPage adminEmail="" />
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
            <Route path="/affiliate" element={<AffiliateLayout active="" />}>
              <Route path="dashboard" element={<AffiliateDashboard />} />
              <Route path="clients" element={<AffiliateManageClients />} />
              <Route path="freelancers" element={<AffiliateManageFreelancers />} />
              <Route path="jobs" element={<AffiliateManageJobs />} />
              <Route path="commissions" element={<AffiliateCommissionSummary />} />
              <Route index element={<AffiliateDashboard />} />
            </Route>
            <Route path="/admin/affiliate-marketers" element={<AdminManageAffiliateMarketers />} />
            <Route path="/affiliate/signin" element={<AffiliateSignIn />} />
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
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
