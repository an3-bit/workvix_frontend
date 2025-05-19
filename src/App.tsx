
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
          <Route path="/join" element={<Join />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/explore-skills" element={<ExploreSkills />} />
          <Route path="/premium-services" element={<PremiumServices />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/post-job" element={<PostJobForm />} />
          {/* Add more routes as needed */}
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
