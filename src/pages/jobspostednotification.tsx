import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Nav2 from '@/components/Nav2'; // import your logged-in navbar
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const JobPostedNotification = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchSessionAndJob = async () => {
      // Get session info
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);

      try {
        // Fetch the most recent job from Supabase
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          setJob(data);
        } else {
          navigate('/post-job');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        // Fallback to localStorage if Supabase fails
        const jobs = JSON.parse(localStorage.getItem('skillforgeJobs') || '[]');
        if (jobs.length > 0) {
          const latestJob = jobs.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          setJob(latestJob);
        } else {
          navigate('/post-job');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndJob();
  }, [navigate]);

  const handleViewBids = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate('/signin');
    } else if (job?.id) {
      navigate('/client/bids');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        {isLoggedIn ? <Nav2 /> : <Navbar />}
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
          <p className="text-lg">Loading job details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      {isLoggedIn ? <Nav2 /> : <Navbar />}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Thank you for choosing workvix!
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Your job has been posted successfully and is now awaiting professional bids.
              You can select the best bidder for your needs.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h2 className="font-semibold text-xl mb-2 text-gray-700">Job Details</h2>
              <p className="font-medium text-gray-800">{job.title}</p>
              <div className="flex justify-between mt-2 text-gray-600">
                <span>Category: {job.category}</span>
                <span>
                  Budget: ${job.min_budget || job.minBudget} - ${job.max_budget || job.maxBudget}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleViewBids}
                className="w-full py-3 bg-skillforge-primary hover:bg-skillforge-primary/90"
              >
                View Bids
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobPostedNotification;
