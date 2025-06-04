import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';



const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<any>(null);

  useEffect(() => {
    if (jobId) {
      initializeChat();
    }
  }, [jobId]);

  const initializeChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // Check if chat already exists for this job
      const { data: existingChat } = await supabase
        .from('chats')
        .select<{
          id: string;
          job_id: string;
          client_id: string;
          freelancer_id: string;
          updated_at?: string;
        }>()
        .eq('job_id', jobId)
        .single();

      let chatData;
      if (existingChat) {
        chatData = existingChat;
      } else {
        // Get job details to create new chat
        const { data: jobData } = await supabase
          .from('jobs')
          .select('client_id')
          .eq('id', jobId)
          .single();

        if (!jobData) throw new Error('Job not found');

        // Create new chat
        const { data: newChat } = await supabase
          .from('chats')
          .insert([{
            job_id: jobId,
            client_id: jobData.client_id,
            freelancer_id: user.id
          }])
          .select()
          .single();

        chatData = newChat;
      }

      setChat(chatData);
      await fetchMessages(chatData.id);
      await fetchOtherUser(chatData, user.id);
    } catch (error) {
      console.error('Error initializing chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize chat.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchOtherUser = async (chatData: any, currentUserId: string) => {
    const otherUserId = chatData.client_id === currentUserId 
      ? chatData.freelancer_id 
      : chatData.client_id;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', otherUserId)
      .single();

    if (data) {
      setOtherUser(data);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat) return;

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: message } = await supabase
        .from('messages')
        .insert([{
          chat_id: chat.id,
          sender_id: user.id,
          content: newMessage
        }])
        .select()
        .single();

      if (message) {
        setMessages(prev => [...prev, message]);
        setNewMessage('');

        // Update chat's updated_at
        await supabase
          .from('chats')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', chat.id);

        // Create notification for the other user
        await supabase
          .from('notifications')
          .insert([{
            user_id: otherUser.id,
            type: 'new_message',
            message: `New message in your chat`,
            chat_id: chat.id,
            read: false
          }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border">
            {/* Chat header */}
            <div className="border-b p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {otherUser?.first_name?.charAt(0)}{otherUser?.last_name?.charAt(0)}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {otherUser?.first_name} {otherUser?.last_name}
                </h2>
                <p className="text-sm text-gray-600">Chat about job</p>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender_id === otherUser?.id ? 'justify-start' : 'justify-end'}`}
                  >
                    <div 
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender_id === otherUser?.id ? 'bg-gray-100' : 'bg-blue-600 text-white'}`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${message.sender_id === otherUser?.id ? 'text-gray-500' : 'text-blue-100'}`}>
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 min-h-[60px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="h-[60px]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ChatPage;