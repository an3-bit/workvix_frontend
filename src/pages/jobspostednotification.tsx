import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
const JobPostedNotification = () => {
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    // Get all jobs and find the most recently posted one
    const jobs = JSON.parse(localStorage.getItem('skillforgeJobs') || '[]');
    if (jobs.length > 0) {
      // Sort by creation date (newest first) and get the first one
      const latestJob = jobs.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      setJob(latestJob);
    } else {
      // If no jobs found, redirect to post job page
      navigate('/post-job');
    }
  }, [navigate]);

  const handleViewBids = () => {
    if (job) {
      navigate(`/job-bids/${job.id}`);
    }
  };

  if (!job) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Thank you for choosing SkillForge!
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
                <span>Budget: ${job.minBudget} - ${job.maxBudget}</span>
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