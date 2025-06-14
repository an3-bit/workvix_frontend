
import React, { useState, useEffect } from 'react';
import { Send, HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SupportMessage {
  id: string;
  support_chat_id: string;
  sender_id: string;
  sender_type: 'client' | 'freelancer' | 'admin';
  content: string;
  read: boolean;
  created_at: string;
}

interface SupportChatProps {
  chatId: string;
  onClose: () => void;
}

const SupportChat: React.FC<SupportChatProps> = ({ chatId, onClose }) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userType, setUserType] = useState<'client' | 'freelancer' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeData();
    setupRealtimeSubscription();
  }, [chatId]);

  const initializeData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setCurrentUser(user);

      // Determine user type
      const { count: clientCount } = await supabase
        .from('jobs')
        .select('id', { count: 'exact', head: true })
        .eq('client_id', user.id);

      const { count: freelancerCount } = await supabase
        .from('bids')
        .select('id', { count: 'exact', head: true })
        .eq('freelancer_id', user.id);

      if (clientCount && clientCount > 0) {
        setUserType('client');
      } else if (freelancerCount && freelancerCount > 0) {
        setUserType('freelancer');
      }

      // Fetch support messages
      await fetchMessages();
    } catch (error) {
      console.error('Error initializing support chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data: messagesData, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('support_chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(messagesData || []);

      // Mark messages as read
      if (messagesData && messagesData.length > 0) {
        const unreadMessages = messagesData.filter(
          msg => msg.sender_type === 'admin' && !msg.read
        );

        if (unreadMessages.length > 0) {
          await supabase
            .from('support_messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
        }
      }
    } catch (error) {
      console.error('Error fetching support messages:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('support_messages_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'support_messages',
        filter: `support_chat_id=eq.${chatId}`
      }, (payload) => {
        const newMessage = payload.new as SupportMessage;
        setMessages(prev => [...prev, newMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !userType) return;

    setSending(true);
    try {
      const { data: message, error } = await supabase
        .from('support_messages')
        .insert([{
          support_chat_id: chatId,
          sender_id: currentUser.id,
          sender_type: userType,
          content: newMessage.trim()
        }])
        .select()
        .single();

      if (error) throw error;

      setNewMessage('');

      // Update support chat timestamp
      await supabase
        .from('support_chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

    } catch (error) {
      console.error('Error sending support message:', error);
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
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Support Chat Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-blue-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Support Chat</h2>
            <p className="text-sm text-gray-600">Get help from our support team</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">Welcome to Support</p>
              <p className="text-sm">How can we help you today?</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender_type === 'admin' ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender_type === 'admin'
                    ? 'bg-white border border-gray-200' 
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender_type === 'admin' 
                    ? 'text-gray-500' 
                    : 'text-blue-100'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message to support..."
            className="flex-1 min-h-[60px] resize-none"
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
  );
};

export default SupportChat;
