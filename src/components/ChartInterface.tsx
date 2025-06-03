// components/ChatInterface.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Search, 
  ArrowLeft, 
  Paperclip, 
  Send,
  User,
  MoreVertical
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read: boolean;
  job_id?: string;
}

interface ChatParticipant {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  online: boolean;
}

interface JobDetails {
  id: string;
  title: string;
  budget: number;
  status: string;
}

const ChatInterface: React.FC = () => {
  const { userId, jobId } = useParams<{ userId?: string; jobId?: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [participant, setParticipant] = useState<ChatParticipant | null>(null);
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatData();
    setupRealtimeSubscription();

    return () => {
      supabase.removeAllSubscriptions();
    };
  }, [userId, jobId]);

  const fetchChatData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // Fetch participant details
      if (userId) {
        const { data: participantData } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url, online')
          .eq('id', userId)
          .single();
        
        setParticipant(participantData);
      }

      // Fetch job details if jobId is provided
      if (jobId) {
        const { data: jobData } = await supabase
          .from('jobs')
          .select('id, title, budget, status')
          .eq('id', jobId)
          .single();
        
        setJob(jobData);
      }

      // Fetch messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      setMessages(messagesData || []);
      
      // Mark messages as read
      if (messagesData && messagesData.length > 0) {
        const unreadMessages = messagesData.filter(
          msg => msg.sender_id === userId && !msg.read
        );
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
        }
      }
    } catch (error) {
      console.error('Error fetching chat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const { data: { user } } = supabase.auth.getUser();
    if (!user) return;

    const channel = supabase
      .channel('messages_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `and(or(sender_id.eq.${user.id},receiver_id.eq.${user.id}),or(sender_id.eq.${userId},receiver_id.eq.${userId}))`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        
        // Mark as read if it's the current user's message
        if (payload.new.sender_id === user.id) {
          supabase
            .from('messages')
            .update({ read: true })
            .eq('id', payload.new.id);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          content: newMessage,
          sender_id: user.id,
          receiver_id: userId,
          job_id: jobId,
          read: false
        }])
        .select();

      if (error) throw error;

      setMessages(prev => [...prev, ...data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar - Chat list */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Messages</h2>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-60px)]">
          {/* Chat list items would go here */}
          <div className="p-4 border-b hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Alex Johnson</h3>
                  <span className="text-xs text-gray-500">10:25 PM</span>
                </div>
                <p className="text-sm text-gray-600 truncate">Great! Based on your requirements...</p>
              </div>
            </div>
          </div>
          
          {/* More chat items... */}
        </div>
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            {participant && (
              <div className="flex items-center gap-3">
                <div className="relative">
                  {participant.avatar_url ? (
                    <img 
                      src={participant.avatar_url} 
                      alt={`${participant.first_name} ${participant.last_name}`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                  )}
                  <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                    participant.online ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <h3 className="font-medium">
                    {participant.first_name} {participant.last_name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {participant.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {job && (
            <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">{job.title}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                ${job.budget}
              </span>
            </div>
          )}
          
          <button className="p-2 rounded-full hover:bg-gray-100">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
        
        {/* Messages area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquare className="h-12 w-12 mb-4" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender_id === participant?.id ? 'justify-start' : 'justify-end'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md rounded-lg p-3 ${message.sender_id === participant?.id ? 'bg-white' : 'bg-blue-600 text-white'}`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender_id === participant?.id ? 'text-gray-500' : 'text-blue-100'}`}>
                      {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        {/* Message input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Paperclip className="h-5 w-5 text-gray-600" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`p-2 rounded-full ${newMessage.trim() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500'}`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;