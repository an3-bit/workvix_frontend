import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Image, FileText, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Message = {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isSystem: boolean;
  senderName?: string;
};

const ChatSystem = ({ jobId, bidId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState({
    id: 'user-1', // In a real app, this would come from auth context
    name: 'You',
    isClient: true // Toggle between client/freelancer view
  });
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Simulate the other user based on current user role
  useEffect(() => {
    if (user.isClient) {
      setOtherUser({
        id: 'freelancer-1',
        name: 'John Doe',
        title: 'Web Developer',
        avatar: '/api/placeholder/40/40'
      });
    } else {
      setOtherUser({
        id: 'client-1',
        name: 'Sarah Johnson',
        title: 'Project Owner',
        avatar: '/api/placeholder/40/40'
      });
    }
  }, [user]);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const chatId = `skillforge_chat_${jobId}_${bidId}`;
    const storedMessages = JSON.parse(localStorage.getItem(chatId) || '[]');
    
    if (storedMessages.length === 0) {
      // Add initial welcome message if chat is empty
      const initialMessages: Message[] = [
        {
          id: 'system-1',
          sender: 'system',
          content: 'Chat started. You can now communicate about this project.',
          timestamp: new Date().toISOString(),
          isSystem: true
        }
      ];
      
      if (user.isClient) {
        initialMessages.push({
          id: 'freelancer-msg-1',
          sender: 'freelancer-1',
          senderName: 'John Doe',
          content: 'Hi there! I submitted a bid for your project. I have experience with similar projects and would love to discuss the details.',
          timestamp: new Date(Date.now() - 1000 * 60).toISOString(),
          isSystem: false
        });
      } else {
        initialMessages.push({
          id: 'client-msg-1',
          sender: 'client-1',
          senderName: 'Sarah Johnson',
          content: "Hello! I'm interested in your bid. Could you tell me more about your approach to this project?",
          timestamp: new Date(Date.now() - 1000 * 60).toISOString(),
          isSystem: false
        });
      }
      
      setMessages(initialMessages);
      localStorage.setItem(chatId, JSON.stringify(initialMessages));
    } else {
      setMessages(storedMessages);
    }
  }, [jobId, bidId, user.isClient]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: user.id,
      senderName: user.name,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isSystem: false
    };
    
    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setNewMessage('');
    
    // Save to localStorage
    const chatId = `skillforge_chat_${jobId}_${bidId}`;
    localStorage.setItem(chatId, JSON.stringify(updatedMessages));
    
    // Simulate response from other user after a delay
    setTimeout(() => {
      simulateResponse();
    }, 1500);
  };

  const simulateResponse = () => {
    // Only simulate a response if there are fewer than 10 messages
    // to avoid infinite back-and-forth in this demo
    if (messages.length < 10 && otherUser) {
      const responses = [
        "That sounds good to me!",
        "Could you provide more details about that?",
        "I understand. Let me know if you have any other questions.",
        "When would you like to get started?",
        "I can definitely work with that timeline.",
        "What's your budget for this specific part of the project?",
        "I'll send you some examples of my previous work."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMsg = {
        id: `msg-${Date.now()}`,
        sender: otherUser.id,
        senderName: otherUser.name,
        content: randomResponse,
        timestamp: new Date().toISOString(),
        isSystem: false
      };
      
      const updatedMessages = [...messages, responseMsg];
      setMessages(updatedMessages);
      
      // Save to localStorage
      const chatId = `skillforge_chat_${jobId}_${bidId}`;
      localStorage.setItem(chatId, JSON.stringify(updatedMessages));
    }
  };

  // Format timestamp to readable time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full max-h-screen">
      {/* Chat Header */}
      <div className="bg-skillforge-secondary p-4 text-white flex items-center">
        <div className="flex-shrink-0 mr-3">
          <img
            src={otherUser?.avatar || '/api/placeholder/40/40'}
            alt={otherUser?.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium">{otherUser?.name || 'Loading...'}</h3>
          <p className="text-sm opacity-90">{otherUser?.title || ''}</p>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === user.id ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.isSystem ? (
                <div className="bg-gray-200 text-gray-600 text-sm py-1 px-3 rounded-full mx-auto">
                  {message.content}
                </div>
              ) : (
                <div
                  className={`max-w-3/4 rounded-lg px-4 py-2 ${
                    message.sender === user.id
                      ? 'bg-skillforge-primary text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  {message.sender !== user.id && (
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {message.senderName}
                    </p>
                  )}
                  <p>{message.content}</p>
                  <span 
                    className={`text-xs block text-right mt-1 ${
                      message.sender === user.id ? 'text-gray-200' : 'text-gray-500'
                    }`}
                  >
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full border border-gray-300 rounded-lg p-3 pr-12 focus:ring-2 focus:ring-skillforge-primary focus:outline-none resize-none"
              style={{ minHeight: '60px', maxHeight: '160px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            ></textarea>
            <div className="absolute bottom-2 right-2 flex items-center space-x-1">
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                <Paperclip className="h-5 w-5" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                <Image className="h-5 w-5" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full">
                <Smile className="h-5 w-5" />
              </button>
            </div>
          </div>
          <Button
            className="bg-skillforge-primary hover:bg-skillforge-primary/90 h-10 w-10 p-0 rounded-full flex items-center justify-center"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;