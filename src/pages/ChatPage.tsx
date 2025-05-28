import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  MoreHorizontal,
  Bell,
  Mail,
  Heart,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Nav2 from '@/components/Nav2';



// Custom Footer component 
const Footer = () => {
  return (
    <div className="bg-gray-50 py-4 border-t">
      <div className="container mx-auto px-4 text-xs text-gray-500 flex justify-between items-center">
        <div>© 2025 Workvix International Ltd.</div>
        <div className="flex space-x-4">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </div>
  );
};

const ChatPage = () => {
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const [searchText, setSearchText] = useState('');

  // Static chat data
  const [chat, setChat] = useState({
    id: 'static_chat_1',
    freelancerName: 'John Doe',
    freelancerUsername: 'johndoe',
    isOnline: true,
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: 'msg_1',
        sender: 'system',
        content: 'You connected with John Doe',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'msg_2',
        sender: 'freelancer',
        content: 'Hi there! Thanks for reaching out. How can I help you today?',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'msg_3',
        sender: 'client',
        content: 'Hi John! I need help with a React project. Are you available?',
        timestamp: new Date(Date.now() - 1800000).toISOString()
      }
    ]
  });

  // Static job data
  const job = {
    id: 'static_job_1',
    title: 'React Frontend Development',
    minBudget: '300',
    maxBudget: '500'
  };

  // Static chats list
  const [chats, setChats] = useState([
    {
      id: 'static_chat_1',
      freelancerName: 'John Doe',
      freelancerUsername: 'johndoe',
      isOnline: true,
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg_1',
          sender: 'system',
          content: 'You connected with John Doe',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'msg_2',
          sender: 'freelancer',
          content: 'Hi there! Thanks for reaching out. How can I help you today?',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'msg_3',
          sender: 'client',
          content: 'Hi John! I need help with a React project. Are you available?',
          timestamp: new Date(Date.now() - 1800000).toISOString()
        }
      ]
    },
    {
      id: 'static_chat_2',
      freelancerName: 'Sarah Smith',
      freelancerUsername: 'sarahsmith',
      isOnline: false,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      messages: [
        {
          id: 'msg_4',
          sender: 'system',
          content: 'You connected with Sarah Smith',
          timestamp: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: 'msg_5',
          sender: 'freelancer',
          content: 'Hello! I saw your project for UI design. I have some questions.',
          timestamp: new Date(Date.now() - 172800000).toISOString()
        }
      ]
    }
  ]);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !chat) return;
    
    // Create new message
    const newMessage = {
      id: `msg_${Date.now()}`,
      sender: 'client',
      content: messageText,
      timestamp: new Date().toISOString()
    };
    
    // Update local state
    const updatedChat = {
      ...chat,
      messages: [...chat.messages, newMessage]
    };
    
    setChat(updatedChat);
    
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
    const selectedChat = chats.find(c => c.id === id);
    if (selectedChat) {
      setChat(selectedChat);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Nav2 />
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
              Talk to Support 
            </button>
          </div>
          
          {/* Chat List */}
          <div className="flex-grow overflow-y-auto">
            {chats.map((chatItem) => (
              <div 
                key={chatItem.id}
                onClick={() => switchToChat(chatItem.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${chatItem.id === chat.id ? 'bg-gray-100' : ''}`}
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
                    <span>On Workvix since Feb 2025</span>
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
            <div className="mb-3">
              <h3 className="text-sm font-semibold">About {chat.freelancerName}</h3>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500">From</span>
              <span className="text-xs">United States</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500">On workvix since</span>
              <span className="text-xs">Feb 2025</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500">English</span>
              <span className="text-xs">Native</span>
            </div>
          </div>
          
          {/* Freelancer Stats */}
          <div className="p-4 border-b">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500">Response rate</span>
              <span className="text-xs">1h</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-500">Rating</span>
              <span className="text-xs flex items-center">
                <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                5 (57)
              </span>
            </div>
          </div>
          
          {/* Related Services */}
          <div className="p-4">
            <div className="flex justify-between mb-3">
              <h3 className="text-sm font-semibold">Related Services</h3>
              <button className="text-xs text-green-500 font-medium">See More</button>
            </div>
            
            {/* Service Card */}
            <div className="border rounded-md overflow-hidden mb-3">
              <div className="bg-gray-100 h-32 flex items-center justify-center">
                <div className="text-center p-4 bg-yellow-200 w-full">
                  <div className="text-2xl font-bold">10$</div>
                  <div className="text-xs">Only</div>
                </div>
              </div>
              <div className="p-3">
                <div className="text-xs mb-2">Help you code in r, python sas</div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="ml-1">4.9 (57)</span>
                  </div>
                  <div className="text-xs">FROM $10</div>
                </div>
              </div>
            </div>
            
            {/* Service Card */}
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-100 h-32 flex items-center justify-center">
                <div className="text-center p-2">
                  <div className="text-sm font-bold">DATA ANALYST</div>
                </div>
              </div>
              <div className="p-3">
                <div className="text-xs mb-2">Do data cleaning, visualization</div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="ml-1">4.9 (100)</span>
                  </div>
                  <div className="text-xs">FROM $25</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;