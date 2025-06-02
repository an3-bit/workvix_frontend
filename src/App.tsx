
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FreelancerDashboard from "./pages/freelancer/freelancerdashboard";
import ClientDashboard from "./pages/client/clientdashboard";

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
const ChatPage = lazy(() => import("./pages/ChatPage"));


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
            <Route path="/checkout/:bidId" element={<CheckoutPage />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
            <Route path="/freelancer" element={<FreelancerDashboard />} />
            <Route path="/client" element={<ClientDashboard />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
