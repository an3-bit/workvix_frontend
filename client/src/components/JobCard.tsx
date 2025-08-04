import { useState } from 'react';
import { Clock, DollarSign, Tag, MessageSquare, Send, X, MapPin, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Job {
  id: string;
  title: string;
  description: string;
  budget?: number;
  min_budget?: number;
  max_budget?: number;
  category?: string;
  status?: string;
  created_at?: string;
  location?: string;
  client?: {
    name?: string;
    rating?: number;
  };
  skills?: string[];
  deadline?: string;
}

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const [showContact, setShowContact] = useState(false);
  const [bidding, setBidding] = useState(false);
  const [message, setMessage] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Format date to be more readable
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  const handleContactSupport = () => {
    setShowContact(true);
    
    // Simulate notification to freelancers
    setTimeout(() => {
      setNotifications([
        {
          id: Date.now(),
          message: "A client is looking for a freelancer for this job!",
          time: new Date().toISOString()
        }
      ]);
    }, 1000);
  };

  const handleBackToDashboard = () => {
    // Navigate back to the dashboard
    window.location.href = '/dashboard';
  };

  const startBidding = () => {
    setBidding(true);
    setShowContact(false);
  };

  const handleBidSubmit = () => {
    if (!bidAmount.trim() || !message.trim()) return;
    
    // Store bid in localStorage for demo purposes
    const bids = JSON.parse(localStorage.getItem(`workvix_bids_${job.id}`) || '[]');
    bids.push({
      id: Date.now().toString(),
      amount: bidAmount,
      message: message,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
          localStorage.setItem(`workvix_bids_${job.id}`, JSON.stringify(bids));
    
    setBidSubmitted(true);
  };

  // Get first 100 characters of description and add ellipsis if longer
  const truncateDescription = (text: string, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Calculate budget display
  const getBudgetDisplay = () => {
    if (job.min_budget && job.max_budget) {
      return `$${job.min_budget.toLocaleString()} - $${job.max_budget.toLocaleString()}`;
    }
    if (job.budget) {
      return `$${job.budget.toLocaleString()}`;
    }
    return 'Negotiable';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-4 sm:p-6">
        {/* Job Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight mb-2">
              {job.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              {job.client?.name && (
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {job.client.name}
                </div>
              )}
              {job.location && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {job.location}
                </div>
              )}
            </div>
          </div>
          <Badge 
            variant={job.status === 'Open' ? 'default' : 'secondary'}
            className="self-start"
          >
            {job.status || 'Open'}
          </Badge>
        </div>
        
        {/* Job Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
            <span className="truncate">{formatDate(job.created_at)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Tag className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
            <span className="truncate">{job.category || 'Uncategorized'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <DollarSign className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
            <span className="truncate">{getBudgetDisplay()}</span>
          </div>
          {job.deadline && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1 text-gray-400 flex-shrink-0" />
              <span className="truncate">{formatDate(job.deadline)}</span>
            </div>
          )}
        </div>
        
        {/* Skills Tags */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        {/* Job Description */}
        <p className="text-gray-700 text-sm sm:text-base mb-6 leading-relaxed">
          {truncateDescription(job.description, 120)}
        </p>
        
        {/* Action Button */}
        {!showContact && !bidding && !bidSubmitted && (
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300"
            onClick={handleContactSupport}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support for Order
          </Button>
        )}
      </div>
      
      {/* Contact Support Section */}
      {showContact && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Support</h3>
            <button 
              className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setShowContact(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-4 text-sm sm:text-base">
            Our support team will connect you with the client shortly.
          </p>
          
          {notifications.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 font-medium text-sm">Notification sent to client!</p>
              <p className="text-blue-600 text-sm">{notifications[0].message}</p>
            </div>
          )}
          
          <Button 
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium py-3 rounded-lg transition-all duration-300"
            onClick={startBidding}
          >
            <Send className="h-4 w-4 mr-2" />
            Start Bidding Process
          </Button>
        </div>
      )}
      
      {/* Bidding Section */}
      {bidding && !bidSubmitted && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Place Your Bid</h3>
            <button 
              className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setBidding(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Your Bid Amount ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="bidAmount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your bid amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="bidMessage" className="block text-sm font-medium text-gray-700 mb-2">
                Proposal Message
              </label>
              <textarea
                id="bidMessage"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder="Describe your approach and why you're the best fit for this project..."
              />
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300"
              onClick={handleBidSubmit}
              disabled={!bidAmount.trim() || !message.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Bid
            </Button>
          </div>
        </div>
      )}
      
      {/* Bid Submitted Success */}
      {bidSubmitted && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6 border-t border-gray-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bid Submitted Successfully!</h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Your bid has been sent to the client. You'll be notified when they respond.
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300"
              onClick={handleBackToDashboard}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;