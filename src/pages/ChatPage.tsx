import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, FileText, DollarSign, ChevronLeft, PaperclipIcon } from 'lucide-react';
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
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Get chat from localStorage
    const chats = JSON.parse(localStorage.getItem('skillforgeChats') || '[]');
    const currentChat = chats.find(c => c.id === chatId);
    
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
    const chats = JSON.parse(localStorage.getItem('skillforgeChats') || '[]');
    const updatedChats = chats.map(c => c.id === chatId ? updatedChat : c);
    localStorage.setItem('skillforgeChats', JSON.stringify(updatedChats));
    
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
    }, 1500);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
          {/* Chat Header */}
          <div className="bg-skillforge-secondary p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-white hover:bg-skillforge-secondary/80"
                onClick={() => navigate('/')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div>
                <h1 className="text-lg font-bold text-white flex items-center">
                  {chat.freelancerName}
                </h1>
                <p className="text-sm text-gray-200">{job?.title}</p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-skillforge-secondary/80 flex items-center gap-1"
                onClick={() => navigate(`/job/${job?.id}`)}
              >
                <FileText className="h-4 w-4" />
                <span>Job Details</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-skillforge-secondary hover:bg-white/90 flex items-center gap-1"
              >
                <DollarSign className="h-4 w-4" />
                <span>Payment</span>
              </Button>
            </div>
          </div>
          
          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {chat.messages.map((message, index) => {
              // Check if we need to show date label (first message or date change)
              const showDateLabel = index === 0 || (
                formatDate(message.timestamp) !== formatDate(chat.messages[index - 1].timestamp)
              );
              
              return (
                <div key={message.id}>
                  {showDateLabel && (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                  )}
                  
                  {message.sender === 'system' ? (
                    <div className="flex justify-center my-4">
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        {message.content}
                      </span>
                    </div>
                  ) : (
                    <div className={`flex ${message.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${
                        message.sender === 'client' 
                          ? 'bg-skillforge-primary text-white' 
                          : 'bg-gray-100 text-gray-800'
                      } rounded-lg px-4 py-2`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'client' ? 'text-gray-200' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:bg-gray-100"
              >
                <PaperclipIcon className="h-5 w-5" />
              </Button>
              
              <div className="flex-grow relative">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-skillforge-primary resize-none"
                  placeholder="Type your message..."
                  rows={1}
                  style={{ maxHeight: '120px', minHeight: '44px' }}
                />
              </div>
              
              <Button
                disabled={!messageText.trim()}
                onClick={handleSendMessage}
                className="bg-skillforge-primary hover:bg-skillforge-primary/90"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChatPage;