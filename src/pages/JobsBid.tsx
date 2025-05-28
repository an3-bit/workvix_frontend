import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Clock, User, Briefcase, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const JobBidsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const bidders = MOCK_BIDDERS;

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) {
        setError('Job ID not provided.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (error) throw error;
        setJob(data);
      } catch (err) {
        console.error('Failed to fetch job:', err.message);
        setError('Could not load job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleSelectBidder = (bidderId) => {
    const selected = bidders.find(b => b.id === bidderId);
    if (!selected || !job) return;
    console.log(`Selected ${selected.name} for job ${job.title}`);
    navigate(`/chat/mock-chat-${Date.now()}`);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-lg">Loading job details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">{error}</h2>
          <Button onClick={() => navigate('/dashboard')} className="bg-skillforge-primary hover:bg-skillforge-primary/90">
            Back to Dashboard
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
            <div className="bg-skillforge-secondary p-6">
              <h1 className="text-2xl font-bold text-white">{job.title}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-gray-200">
                <span className="flex items-center">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {job.category || 'Uncategorized'}
                </span>
                <span className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ${job.min_budget || 0} - ${job.max_budget || 0}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{job.description || 'No description provided.'}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4">Bids ({bidders.length})</h2>
          <div className="space-y-6">
            {bidders.map((bidder) => (
              <div key={bidder.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div className="flex items-center mb-4 md:mb-0">
                    <img
                      src={bidder.avatar}
                      alt={bidder.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{bidder.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                        {bidder.rating} ({bidder.review_count} reviews)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-skillforge-primary">${bidder.amount}</div>
                    <div className="text-sm text-gray-500 flex items-center justify-end mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {bidder.delivery_time}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{bidder.message}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {bidder.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600 text-sm">
                    <User className="h-4 w-4 mr-1" />
                    {bidder.completed_jobs} jobs completed
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-skillforge-primary text-skillforge-primary hover:bg-skillforge-primary/10"
                      onClick={() => navigate(`/freelancer/${bidder.freelancer_id}`)}
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
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Mock bidders
const MOCK_BIDDERS = [
  {
    id: 'bid1',
    freelancer_id: 'freelancer1',
    name: 'Alex Johnson',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.9,
    review_count: 124,
    completed_jobs: 78,
    amount: 450,
    delivery_time: '5 days',
    message: "I'm a professional web developer with 8+ years of experience. I've worked on similar projects and can deliver high-quality results within your timeframe.",
    skills: ['React', 'Node.js', 'TypeScript', 'UI/UX'],
  },
  {
    id: 'bid2',
    freelancer_id: 'freelancer2',
    name: 'Samantha Lee',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.7,
    review_count: 86,
    completed_jobs: 52,
    amount: 380,
    delivery_time: '4 days',
    message: "Hello! I've reviewed your job requirements and I'm confident I can deliver exactly what you need. I specialize in creating clean, responsive designs.",
    skills: ['WordPress', 'PHP', 'CSS', 'JavaScript'],
  },
  {
    id: 'bid3',
    freelancer_id: 'freelancer3',
    name: 'Miguel Hernandez',
    avatar: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    rating: 4.8,
    review_count: 103,
    completed_jobs: 65,
    amount: 500,
    delivery_time: '7 days',
    message: "I can offer a comprehensive solution for your project. With my expertise in full-stack development, I'll ensure your website is technically sound.",
    skills: ['Full Stack', 'React', 'MongoDB', 'Express'],
  }
];

export default JobBidsPage;
