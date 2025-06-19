
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
import ChatInterface from "./components/ChartInterface";
import ChatSystem from "./components/chatsystem";

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
const OrderForm = lazy(() => import("./pages/OrderForm"));
const FreelancerNotificationsPage = lazy(() => import("./pages/freelancer/NotificationsPage"));

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
            <Route path="/bids" element={<FreelancerBidsPage />} />
            <Route path="/jobs/:jobId/bids" element={<JobsBid />} />
            <Route path="/checkout/:bidId?" element={<CheckoutPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/freelancer" element={<FreelancerDashboard />} />
            <Route path="/freelancer/profile" element={<FreelancerProfile />} />
            <Route path="/client" element={<ClientDashboard />} />
            <Route path="/client/bids" element={<ClientBidsPage />} />
            <Route path="/order/:bidId" element={<OrderForm />} />
            <Route path="/freelancer/notifications" element={<FreelancerNotifications/>} />
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
            <Route path="/chat-interface" element={<ChatInterface />} />
            <Route
              path="/chat-system"
              element={
                <ChatSystem jobId={null} bidId={null} receiverId={null} />
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
