import React, { useState, useEffect, useRef } from 'react';
import { Search, DollarSign, Briefcase, Clock, Users, Bell, User, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import Nav2 from '@/components/Nav2';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: number;
  title: string;
  description: string;
  budget: number;
  category: string;
  created_at: string;
  status: string;
}

const FreelancerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableJobs();
  }, []);

  const fetchAvailableJobs = async () => {
    try {
      const response = await fetch('http://localhost:5000/jobs?status=open');
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const jobsData = await response.json();
      setJobs(jobsData.slice(0, 6)); // Show first 6 available jobs
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load available jobs',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBidOnJob = (jobId: number) => {
    navigate(`/jobs/${jobId}/bids`);
  };

  const quickActions = [
    { 
      icon: <Search className="h-6 w-6" />, 
      title: "Browse Jobs", 
      desc: "Find new opportunities",
      link: "/jobs"
    },
    { 
      icon: <Users className="h-6 w-6" />, 
      title: "My Proposals", 
      desc: "Track your bids",
      link: "/bids-details"
    },
    { 
      icon: <DollarSign className="h-6 w-6" />, 
      title: "Earnings", 
      desc: "View your income",
      link: "/freelancer/earnings"
    },
    { 
      icon: <Briefcase className="h-6 w-6" />, 
      title: "Portfolio", 
      desc: "Showcase your work",
      link: "/freelancer/portfolio"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        {/* Hero Section with Video Background */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <VideoSequenceBackground />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-black/20"></div>
          <div className="container mx-auto px-4 relative z-10 text-white">
            <div className="flex flex-col lg:flex-row items-start justify-between">
              <div className="max-w-2xl mb-8">
                <h2 className="text-4xl font-bold mb-4">Welcome, Freelancer!</h2>
                <p className="text-lg opacity-90 mb-6">
                  Browse available jobs below and submit your proposals
                </p>
                
                {/* Simple Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5" />
                      <div>
                        <p className="text-2xl font-bold">{jobs.length}</p>
                        <p className="text-sm opacity-80">Available Jobs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="self-start">
                <Link to="/jobs">
                  <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full font-semibold shadow-md">
                    Browse All Jobs →
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.link}>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <span className="text-blue-600">{action.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Available Jobs */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
              <Link to="/jobs" className="text-blue-600 hover:text-blue-800 font-medium">
                View All Jobs →
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading jobs...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {job.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {job.category}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-green-600">${job.budget}</span>
                      <span className="text-sm text-gray-500">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New opportunity</span>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleBidOnJob(job.id)}
                      >
                        Start Bid
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && jobs.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs available</h3>
                <p className="text-gray-600">Check back later for new opportunities!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

const videoSources = [
  '/freelancer/video1.mp4',
  '/freelancer/video2.mp4',
  '/freelancer/video3.mp4',
];

function VideoSequenceBackground() {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  const [fade, setFade] = useState(false);
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];

  // When a video ends, prepare to crossfade to the next
  const handleEnded = () => {
    setNext((current + 1) % videoSources.length);
  };

  // When next is set, trigger a fast crossfade
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (next !== null) {
      setFade(true);
      timer = setTimeout(() => {
        setCurrent(next);
        setNext(null);
        setFade(false);
      }, 200); // 0.2s fade duration
    }
    return () => clearTimeout(timer);
  }, [next]);

  return (
    <div className="w-full h-full absolute inset-0">
      {/* Current Video */}
      <video
        ref={videoRefs[0]}
        src={videoSources[current]}
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-200 ${fade ? 'opacity-0' : 'opacity-100'}`}
        style={{ zIndex: 0 }}
      />
      {/* Next Video (for crossfade and preloading) */}
      {next !== null && (
        <video
          ref={videoRefs[1]}
          src={videoSources[next]}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-200 ${fade ? 'opacity-100' : 'opacity-0'}`}
          style={{ zIndex: 0 }}
        />
      )}
    </div>
  );
}

export default FreelancerDashboard;