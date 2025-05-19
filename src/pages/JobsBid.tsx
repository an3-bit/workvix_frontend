import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, MessageSquare, User, Briefcase, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock data for bidders - in a real app, this would come from your backend
const MOCK_BIDDERS = [
  {
    id: 'bid1',
    freelancerId: 'freelancer1',
    name: 'Alex Johnson',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&h=80&w=80',
    rating: 4.9,
    reviewCount: 124,
    completedJobs: 78,
    amount: 450,
    deliveryTime: '5 days',
    message: "I'm a professional web developer with 8+ years of experience. I've worked on similar projects and can deliver high-quality results within your timeframe. Let's discuss your requirements in detail.",
    skills: ['React', 'Node.js', 'TypeScript', 'UI/UX'],
  },
  {
    id: 'bid2',
    freelancerId: 'freelancer2',
    name: 'Samantha Lee',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&h=80&w=80',
    rating: 4.7,
    reviewCount: 86,
    completedJobs: 52,
    amount: 380,
    deliveryTime: '4 days',
    message: "Hello! I've reviewed your job requirements and I'm confident I can deliver exactly what you need. I specialize in creating clean, responsive designs with a focus on user experience.",
    skills: ['WordPress', 'PHP', 'CSS', 'JavaScript'],
  },
  {
    id: 'bid3',
    freelancerId: 'freelancer3',
    name: 'Miguel Hernandez',
    avatar: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&h=80&w=80',
    rating: 4.8,
    reviewCount: 103,
    completedJobs: 65,
    amount: 500,
    deliveryTime: '7 days',
    message: "I can offer a comprehensive solution for your project. With my expertise in full-stack development, I'll ensure your website is not only visually appealing but also technically sound and optimized for performance.",
    skills: ['Full Stack', 'React', 'MongoDB', 'Express'],
  }
];

const JobBidsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [bidders, setBidders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get job details from localStorage
    const jobs = JSON.parse(localStorage.getItem('skillforgeJobs') || '[]');
    const currentJob = jobs.find(job => job.id === jobId);
    
    if (currentJob) {
      setJob(currentJob);
      
      // In a real app, you would fetch actual bids from your backend
      // For now, we'll use mock data
      setBidders(MOCK_BIDDERS);
      
      // Check if there are saved bids in localStorage
      const savedBids = JSON.parse(localStorage.getItem(`skillforgeJobBids_${jobId}`) || 'null');
      if (savedBids) {
        setBidders(savedBids);
      } else {
        // Save mock bids to localStorage for persistence
        localStorage.setItem(`skillforgeJobBids_${jobId}`, JSON.stringify(MOCK_BIDDERS));
      }
    } else {
      // If job not found, redirect to dashboard
      navigate('/dashboard');
    }
    
    setLoading(false);
  }, [jobId, navigate]);

  const handleSelectBidder = (bidderId) => {
    // Find the selected bidder
    const selectedBidder = bidders.find(bidder => bidder.id === bidderId);
    
    if (selectedBidder && job) {
      // In a real app, you would update the job status in your backend
      // For now, we'll update in localStorage
      
      // Get all jobs
      const jobs = JSON.parse(localStorage.getItem('skillforgeJobs') || '[]');
      
      // Find and update the current job
      const updatedJobs = jobs.map(j => {
        if (j.id === job.id) {
          return {
            ...j,
            status: 'awarded',
            awardedTo: {
              id: selectedBidder.freelancerId,
              name: selectedBidder.name,
              bidAmount: selectedBidder.amount
            }
          };
        }
        return j;
      });
      
      // Save updated jobs
      localStorage.setItem('skillforgeJobs', JSON.stringify(updatedJobs));
      
      // Create a new chat or navigate to existing chat
      const chats = JSON.parse(localStorage.getItem('skillforgeChats') || '[]');
      
      // Check if a chat already exists
      const existingChatIndex = chats.findIndex(
        chat => chat.jobId === job.id && chat.freelancerId === selectedBidder.freelancerId
      );
      
      let chatId;
      
      if (existingChatIndex >= 0) {
        // Use existing chat
        chatId = chats[existingChatIndex].id;
      } else {
        // Create new chat
        chatId = `chat_${Date.now()}`;
        const newChat = {
          id: chatId,
          jobId: job.id,
          jobTitle: job.title,
          clientId: 'current_user_id', // In a real app, this would be the actual client ID
          freelancerId: selectedBidder.freelancerId,
          freelancerName: selectedBidder.name,
          createdAt: new Date().toISOString(),
          messages: [
            {
              id: `msg_${Date.now()}`,
              sender: 'system',
              content: `Chat started for job: ${job.title}`,
              timestamp: new Date().toISOString()
            }
          ]
        };
        
        chats.push(newChat);
        localStorage.setItem('skillforgeChats', JSON.stringify(chats));
      }
      
      // Navigate to chat
      navigate(`/chat/${chatId}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
          <p className="text-lg">Loading bids...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Job Summary */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-skillforge-secondary p-6">
              <h1 className="text-2xl font-bold text-white">{job.title}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-gray-200">
                <span className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {job.category}
                </span>
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${job.minBudget} - ${job.maxBudget}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{job.description}</p>
            </div>
          </div>
          
          {/* Bids Section */}
          <h2 className="text-xl font-bold mb-4">Bids ({bidders.length})</h2>
          
          {bidders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-lg text-gray-600">
                No bids yet. Check back soon as professionals review your job.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {bidders.map((bidder) => (
                <div key={bidder.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex items-center mb-4 md:mb-0">
                        <img 
                          src={bidder.avatar} 
                          alt={bidder.name} 
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <div>
                          <h3 className="text-lg font-semibold">{bidder.name}</h3>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                            <span className="text-gray-700 mr-2">{bidder.rating}</span>
                            <span className="text-gray-500">({bidder.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="text-xl font-bold text-skillforge-primary">${bidder.amount}</div>
                        <div className="flex items-center text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {bidder.deliveryTime}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-700">{bidder.message}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {bidder.skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        <span>{bidder.completedJobs} jobs completed</span>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-skillforge-primary text-skillforge-primary hover:bg-skillforge-primary/10"
                          onClick={() => navigate(`/freelancer/${bidder.freelancerId}`)}
                        >
                          View Profile
                        </Button>
                        
                        <Button
                          size="sm"
                          className="bg-skillforge-primary hover:bg-skillforge-primary/90"
                          onClick={() => handleSelectBidder(bidder.id)}
                        >
                          Select & Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobBidsPage;