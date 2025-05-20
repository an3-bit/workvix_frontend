import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Send, 
  FileText, 
  DollarSign, 
  ChevronLeft, 
  Star, 
  ChevronDown, 
  Search, 
  Paperclip, 
  Smile, 
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chat, setChat] = useState(null);
  const [job, setJob] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [searchText, setSearchText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Get all chats from localStorage
    const allChats = JSON.parse(localStorage.getItem('skillforgeChats') || '[]');
    setChats(allChats);
    
    // Get current chat
    const currentChat = allChats.find(c => c.id === chatId);
    
    if (currentChat) {
      setChat(currentChat);
      
      // Get related job
      const jobs = JSON.parse(localStorage.getItem('skillforgeJobs') || '[]');
      const relatedJob = jobs.find(j => j.id === currentChat.jobId);
      
      if (relatedJob) {
        setJob(relatedJob);
      }
    } else {
      // If chat not found, redirect to dashboard
      navigate('/');
    }
    
    setLoading(false);
  }, [chatId, navigate]);
  
  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !chat) return;
    
    // Create new message
    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: 'client', // In a real app, this would be determined by user type
      content: messageText,
      timestamp: new Date().toISOString()
    };
    
    // Update local state
    const updatedChat = {
      ...chat,
      messages: [...chat.messages, newMessage]
    };
    
    setChat(updatedChat);
    
    // Update in localStorage
    const allChats = JSON.parse(localStorage.getItem('skillforgeChats') || '[]');
    const updatedChats = allChats.map(c => c.id === chatId ? updatedChat : c);
    localStorage.setItem('skillforgeChats', JSON.stringify(updatedChats));
    setChats(updatedChats);
    
    // Clear input
    setMessageText('');
    
    // Simulate response from freelancer after 1.5 seconds
    setTimeout(() => {
      let responseContent = '';
      
      // Different responses based on message count
      const messageCount = updatedChat.messages.filter(m => m.sender !== 'system').length;
      
      if (messageCount === 1) {
        responseContent = `Hi there! Thanks for selecting me for your project. I've looked through the details of your ${job?.title} job and I'm excited to get started. When would you like to begin?`;
      } else if (messageCount === 3) {
        responseContent = `Great! Based on your requirements, I think we can complete this within ${job ? Math.ceil((Number(job.maxBudget) - Number(job.minBudget)) / 3) : 5} days. Does that timeline work for you?`;
      } else if (messageCount === 5) {
        responseContent = `Perfect! Let's discuss the payment. For this project, I can offer a fixed price of $${job?.maxBudget || '450'} with milestones at 50% and 100% completion. How does that sound?`;
      } else if (messageCount === 7) {
        responseContent = `Excellent! I'll start working on it right away. I'll send you the first draft by ${new Date(Date.now() + 2*24*60*60*1000).toLocaleDateString()}. Feel free to reach out if you have any questions in the meantime.`;
      } else {
        responseContent = `Thanks for your message! I'll work on this and get back to you soon. Let me know if you need anything else.`;
      }
      
      const responseMessage = {
        id: `msg_${Date.now()}`,
        sender: 'freelancer',
        content: responseContent,
        timestamp: new Date().toISOString()
      };
      
      // Update local state
      const chatWithResponse = {
        ...updatedChat,
        messages: [...updatedChat.messages, responseMessage]
      };
      
      setChat(chatWithResponse);
      
      // Update in localStorage
      const chatsAfterResponse = JSON.parse(localStorage.getItem('skillforgeChats') || '[]');
      const updatedChatsAfterResponse = chatsAfterResponse.map(c => 
        c.id === chatId ? chatWithResponse : c
      );
      localStorage.setItem('skillforgeChats', JSON.stringify(updatedChatsAfterResponse));
      setChats(updatedChatsAfterResponse);
    }, 1500);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatLastSeen = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60); // diff in minutes
    
    if (diff < 60) {
      return `Last seen ${diff} minutes ago`;
    }
    
    return `Last seen ${formatTime(timestamp)} local time`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const switchToChat = (id) => {
    navigate(`/chat/${id}`);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
          <p className="text-lg">Loading chat...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!chat) return null;

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex container mx-auto py-6 px-0">
        {/* Sidebar */}
        <div className="w-72 border-r bg-white flex flex-col overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold">All messages</h2>
              <ChevronDown className="ml-1 h-4 w-4" />
            </div>
            <div className="text-gray-500">
              <Search className="h-5 w-5" />
            </div>
          </div>
          
          {/* Search Input */}
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Neo Button */}
          <div className="p-4 border-b">
            <button 
              className="bg-gradient-to-r from-purple-700 to-purple-900 w-full py-2 rounded-md text-white font-medium flex items-center justify-center"
              onClick={() => navigate('/neo')}
            >
              <span className="mr-2">•</span>
              Talk to SkillForge AI assistant
            </button>
          </div>
          
          {/* Chat List */}
          <div className="flex-grow overflow-y-auto">
            {chats.map((chatItem) => (
              <div 
                key={chatItem.id}
                onClick={() => switchToChat(chatItem.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${chatItem.id === chatId ? 'bg-gray-100' : ''}`}
              >
                <div className="flex items-start">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                      {chatItem.freelancerName.charAt(0)}
                    </div>
                    {chatItem.isOnline && (
                      <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-3 h-3 border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-sm">{chatItem.freelancerName}</div>
                      <div className="text-xs text-gray-500">{formatTime(chatItem.messages[chatItem.messages.length - 1]?.timestamp || chatItem.createdAt)}</div>
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {chatItem.messages[chatItem.messages.length - 1]?.content || "No messages yet"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className="flex-grow flex flex-col">
          {/* Chat Header */}
          <div className="border-b p-4 flex items-center justify-between bg-white">
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  {chat.freelancerName.charAt(0)}
                </div>
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-3 h-3 border-2 border-white"></div>
              </div>
              
              <div>
                <div className="flex items-center">
                  <h1 className="text-base font-semibold">{chat.freelancerName}</h1>
                  <div className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full">@{chat.freelancerUsername || 'username'}</div>
                </div>
                <p className="text-xs text-gray-500">{formatLastSeen(chat.messages[chat.messages.length - 1]?.timestamp || chat.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
                onClick={() => navigate(`/job/${job?.id}`)}
              >
                <Star className="h-3 w-3 mr-1 text-yellow-400" />
                <span>5 (57)</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
              >
                <FileText className="h-3 w-3 mr-1" />
                <span>Order details</span>
              </Button>
              
              <div className="text-gray-500">
                <MoreHorizontal className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          {/* Chat Details Box */}
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="text-sm font-medium mb-1">{job?.title || 'Frontend Development Project'}</div>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-2">From: United States</span>
                    <span>On Fiverr since Feb 2025</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
                >
                  <span>As a client</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
                >
                  <span>As a freelancer</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-white">
            {chat.messages.map((message, index) => {
              // Check if we need to show date label (first message or date change)
              const showDateLabel = index === 0 || (
                formatDate(message.timestamp) !== formatDate(chat.messages[index - 1]?.timestamp)
              );
              
              return (
                <div key={message.id}>
                  {showDateLabel && (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  {message.sender === 'system' ? (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                        {message.content}
                      </span>
                    </div>
                  ) : (
                    <div className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'} mb-4`}>
                      {message.sender !== 'client' && (
                        <div className="mr-3">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">
                            {chat.freelancerName.charAt(0)}
                          </div>
                        </div>
                      )}
                      <div className={`max-w-[70%] ${
                        message.sender === 'client' 
                          ? 'bg-green-500 text-white rounded-l-2xl rounded-br-2xl' 
                          : 'bg-gray-100 text-gray-800 rounded-r-2xl rounded-bl-2xl'
                      } px-4 py-3`}>
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'client' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.sender === 'client' && (
                        <div className="ml-3">
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                            T
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:bg-gray-100 rounded-full"
              >
                <Smile className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:bg-gray-100 rounded-full"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              
              <div className="flex-grow relative">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                  placeholder="Type a message..."
                  rows={1}
                  style={{ maxHeight: '120px', minHeight: '44px' }}
                />
              </div>
              
              <Button
                disabled={!messageText.trim()}
                onClick={handleSendMessage}
                className="bg-green-500 hover:bg-green-600 rounded-full w-10 h-10 flex items-center justify-center"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Sidebar - Right - Order Information */}
        <div className="w-72 border-l bg-white flex flex-col overflow-hidden">
          {/* Order Info Header */}
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Orders with you</h2>
          </div>
          
          {/* Order Details */}
          <div className="p-4 border-b">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-sm font-semibold">({chats.length})</span>
            </div>
          </div>
          
          {/* About Freelancer */}
          <div className="p-4 border-b">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">About freelancer</span>
              <span className="text-sm font-semibold">{chat.freelancerName}</span>
            </div>
          </div>
          
          {/* Order Details */}
          <div className="p-4 border-b">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Order details</span>
              <span className="text-sm font-semibold">{job?.title || 'Frontend Development Project'}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">Budget</span>
              <span className="text-sm font-semibold">${job?.minBudget || '100'} - ${job?.maxBudget || '500'}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">Delivery time</span>
              <span className="text-sm font-semibold">{job?.deliveryTime || '3 days'}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">Status</span>
              <span className="text-sm font-semibold">{chat.status || 'In Progress'}</span>
            </div>
          </div>
          
          {/* Payment Details */}
          <div className="p-4 border-b">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Payment details</span>
              <span className="text-sm font-semibold">${job?.maxBudget || '500'}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">Payment method</span>
              <span className="text-sm font-semibold">Credit Card</span>
            </div>
          </div>
          
          {/* Order Actions */}
          <div className="p-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 text-xs"
              onClick={() => navigate(`/job/${job?.id}`)}
            >
              View Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatPage;