import { useState } from 'react';
import { Clock, DollarSign, Tag, MessageSquare, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const JobCard = ({ job }) => {
  const [showContact, setShowContact] = useState(false);
  const [bidding, setBidding] = useState(false);
  const [message, setMessage] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidSubmitted, setBidSubmitted] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Format date to be more readable
  const formatDate = (dateString) => {
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
    window.location.href = '/dashboard'; // Adjust this path as needed
  };

  const startBidding = () => {
    setBidding(true);
    setShowContact(false);
  };

  const handleBidSubmit = () => {
    if (!bidAmount.trim() || !message.trim()) return;
    
    // Store bid in localStorage for demo purposes
    const bids = JSON.parse(localStorage.getItem(`skillforge_bids_${job.id}`) || '[]');
    bids.push({
      id: Date.now().toString(),
      amount: bidAmount,
      message: message,
      timestamp: new Date().toISOString(),
      status: 'pending'
    });
    localStorage.setItem(`skillforge_bids_${job.id}`, JSON.stringify(bids));
    
    setBidSubmitted(true);
  };

  // Get first 100 characters of description and add ellipsis if longer
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Calculate budget display
  const getBudgetDisplay = () => {
    if (job.min_budget && job.max_budget) {
      return `$${job.min_budget} - $${job.max_budget}`;
    }
    if (job.budget) {
      return `$${job.budget}`;
    }
    return 'Negotiable';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        {/* Job Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            {job.status || 'Open'}
          </span>
        </div>
        
        {/* Job Meta */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-400" />
            Posted {formatDate(job.created_at)}
          </div>
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-1 text-gray-400" />
            {job.category || 'Uncategorized'}
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
            {getBudgetDisplay()}
          </div>
        </div>
        
        {/* Job Description */}
        <p className="text-gray-700 mb-6">
          {truncateDescription(job.description)}
        </p>
        
        {/* Action Button */}
        {!showContact && !bidding && !bidSubmitted && (
          <Button 
            className="w-full md:w-auto bg-skillforge-primary hover:bg-skillforge-primary/90"
            onClick={handleContactSupport}
          >
            Contact Support for Order
          </Button>
        )}
      </div>
      
      {/* Contact Support Section */}
      {showContact && (
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Support</h3>
            <button 
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setShowContact(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <p className="text-gray-600 mb-4">
            Our support team will connect you with the client shortly.
          </p>
          
          {notifications.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-blue-700 font-medium">Notification sent to client!</p>
              <p className="text-blue-600">{notifications[0].message}</p>
            </div>
          )}
          
          <Button 
            className="w-full bg-skillforge-secondary hover:bg-skillforge-secondary/90"
            onClick={startBidding}
          >
            Start Bidding Process
          </Button>
        </div>
      )}
      
      {/* Bidding Section */}
      {bidding && !bidSubmitted && (
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Place Your Bid</h3>
            <button 
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setBidding(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-skillforge-primary focus:outline-none"
                  placeholder={job.min_budget ? `Between ${job.min_budget} and ${job.max_budget}` : 'Enter your bid amount'}
                  min={job.min_budget}
                  max={job.max_budget}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message to Client
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-skillforge-primary focus:outline-none"
                placeholder="Explain why you're the best fit for this job and your approach to the project..."
              ></textarea>
            </div>
            
            <Button 
              className="w-full flex items-center justify-center gap-2 bg-skillforge-primary hover:bg-skillforge-primary/90"
              onClick={handleBidSubmit}
              disabled={!bidAmount.trim() || !message.trim()}
            >
              <Send className="h-4 w-4" />
              Submit Bid
            </Button>
          </div>
        </div>
      )}
      
      {/* Bid Submitted Confirmation */}
      {bidSubmitted && (
        <div className="bg-green-50 p-6 border-t border-green-100">
          <div className="flex items-center mb-2">
            <div className="bg-green-100 rounded-full p-1 mr-3">
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Bid Submitted Successfully!</h3>
          </div>
          <p className="text-gray-600">
            Your bid has been sent to the client. You'll be notified when they respond.
          </p>
           <button
          className="mt-4 text-blue-600 hover:underline"
          onClick={() => {handleBackToDashboard()}}
        >
          Back to Dashboard
        </button>
        </div>
       
      )}
    </div>
  );
};

export default JobCard;