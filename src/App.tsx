import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BecomeSeller from "./pages/BecomeSeller";
import SignIn from "./pages/SignIn";
import Join from "./pages/Join";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import ExploreSkills from "./pages/ExploreSkills";
import PremiumServices from "./pages/PremiumServices";
import JobsPage from "./pages/JobsPage";
import PostJobForm from "./components/postjob";
import NotificationSystem from "./components/Notification";
import JobCard from "./components/JobCard";
import JobPostedNotification from "./pages/jobspostednotification";
import JobBidsPage from "./pages/JobsBid";
import ChatPage from "./pages/ChatPage";
import ClientDashboard from "./pages/client/clientdashboard";
import FreelancerDashboard from "./pages/freelancer/freelancerdashboard";
import AdminDashboard from "./pages/support/admindash";
import Dashboard from "./pages/home2/home2";
import Logout from "./pages/logout";
import JoinSelection from "./pages/joinselection";
import FreelancerBidsPage from "./pages/FreelancerBidsPage";
import CheckoutPage from "./pages/CheckoutPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path="/join" element={<Join />} /> */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/explore-skills" element={<ExploreSkills />} />
          <Route path="/premium-services" element={<PremiumServices />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/freelancer-jobs" element={<FreelancerBidsPage />} />
          <Route path="/post-job" element={<PostJobForm />} />
          <Route path="/notification" element={<NotificationSystem />} />
          <Route path="/job-card" element={<JobCard job={{}} />} />
          <Route path="/job-posted-notification" element={<JobPostedNotification />} />
          <Route path="/job-bids/:jobId" element={<JobBidsPage />} />
          <Route path="/checkout/:bidId" element={<CheckoutPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logout" element={<Logout />} />
          
          <Route path="/join" element={<JoinSelection />} />
          <Route path="/join/:role" element={<Join />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
