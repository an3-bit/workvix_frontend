import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FreelancerDashboard from "./pages/freelancer/freelancerdashboard";
import ClientDashboard from "./pages/client/clientdashboard";
import PremiumServices from "./pages/PremiumServices";
import BecomeSeller from "./pages/BecomeSeller";
import JobPostedNotification from "./pages/jobspostednotification";
import ResetPassword from "./pages/reset_password/resetpassword";
import ChatPage from "./pages/ChatPage";
import ClientChatPage from "./pages/client/ClientChatPage";
import BidsDetailsPage from "./pages/BidsDetailsPage";
import ChatSystem from "./components/chat/ChatSystem";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLogin from "./components/admin/AdminLogin";
import { AffiliateLayout } from "./pages/affiliate/AffiliateDashboard";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import ProfileSettings from './pages/client/ProfileSettings';
import Payments from './pages/client/Payments';
=======
<<<<<<< HEAD
=======
>>>>>>> e25df71 (admin dashboard)
import AuthGuard from "./components/AuthGuard";
=======
import { ThemeProvider } from '@/lib/theme';
>>>>>>> 089fd42 (admin dashboard)
<<<<<<< HEAD
>>>>>>> 7438431 (admin dashboard)
=======
import AuthGuard from "./components/AuthGuard";
>>>>>>> dc1b46d (Refactor database queries to use maybeSingle() for safer data retrieval)
=======
>>>>>>> e25df71 (admin dashboard)

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
<<<<<<< HEAD
<<<<<<< HEAD
const AffiliateSignIn = lazy(() => import("./pages/AffiliateSignIn"));
const JobDetailsPage = lazy(() => import("./pages/JobDetailsPage"));
=======
=======
>>>>>>> 9b83c4a (Refactor database queries to use maybeSingle() for safer data retrieval)
const ServicesPage = lazy(() => import("./components/services"));
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 5a4df94 (new service page and updates on services and hero section.)
=======
const Projects = lazy(() => import("./pages/Projects"));
>>>>>>> 29548a0 (New updates on projects page)
=======
const Projects = lazy(() => import("./pages/projects"));
>>>>>>> 87ff80f (affilliate marketer)

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
<<<<<<< HEAD
            <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
            <Route path="/bids" element={<FreelancerBidsPage />} />
=======
>>>>>>> 5a4df94 (new service page and updates on services and hero section.)
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
<<<<<<< HEAD
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
=======
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
=======
const AffiliateSignIn = lazy(() => import("./pages/AffiliateSignIn"));
const JobDetailsPage = lazy(() => import("./pages/JobDetailsPage"));

const App = () => (
  <ThemeProvider>
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
>>>>>>> 3c73a1e (Refactor database queries to use maybeSingle() for safer data retrieval)
>>>>>>> 9b83c4a (Refactor database queries to use maybeSingle() for safer data retrieval)

<<<<<<< HEAD
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
           </Routes>
=======
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
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
>>>>>>> 5a4df94 (new service page and updates on services and hero section.)
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
