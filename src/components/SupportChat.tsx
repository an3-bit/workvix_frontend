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
  order?: any;
  onClose: () => void;
}

const SupportChat: React.FC<SupportChatProps> = ({ chatId, order, onClose }) => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userType, setUserType] = useState<'client' | 'freelancer' | null>(null);
  const { toast } = useToast();
  const [resolutionNote, setResolutionNote] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [orderStatus, setOrderStatus] = useState(order?.status || '');
  const [orderResolution, setOrderResolution] = useState(order?.resolution_note || '');

  useEffect(() => {
    initializeData();
    setupRealtimeSubscription();
    setOrderStatus(order?.status || '');
    setOrderResolution(order?.resolution_note || '');
  }, [chatId, order]);

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

      // Type cast the data to ensure proper types
      const typedMessages = (messagesData || []).map(msg => ({
        ...msg,
        sender_type: msg.sender_type as 'client' | 'freelancer' | 'admin'
      })) as SupportMessage[];

      setMessages(typedMessages);

      // Mark messages as read
      if (typedMessages && typedMessages.length > 0) {
        const unreadMessages = typedMessages.filter(
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
        const newMessage = {
          ...payload.new,
          sender_type: payload.new.sender_type as 'client' | 'freelancer' | 'admin'
        } as SupportMessage;
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
        .maybeSingle();

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
    <div className="flex flex-col h-full w-full max-w-full sm:max-w-lg mx-auto bg-white rounded-lg shadow-lg sm:my-8 sm:border sm:border-gray-200" style={{ minHeight: '100vh', maxHeight: '100vh' }}>
      {/* Support Chat Header */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between bg-blue-50 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-base sm:text-lg">Support Chat</h2>
            <p className="text-xs sm:text-sm text-gray-600">Get help from our support team</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Order Details */}
      {order && (
        <div className="bg-gray-50 px-3 py-2 text-xs sm:text-sm text-gray-700 border-b border-gray-200">
          <div><span className="font-semibold">Order:</span> {order.id}</div>
          <div><span className="font-semibold">Status:</span> {order.status}</div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 py-2 sm:px-4 sm:py-4" style={{ minHeight: 0 }}>
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 py-8">No messages yet.</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`mb-2 flex ${msg.sender_type === userType ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-3 py-2 max-w-[80vw] sm:max-w-xs text-sm ${msg.sender_type === userType ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}>
                <span className="block font-bold text-xs mb-1">
                  {msg.sender_type.charAt(0).toUpperCase() + msg.sender_type.slice(1)}
                </span>
                {msg.content}
                <div className="text-[10px] text-gray-400 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white p-2 sm:p-4 border-t border-gray-200 flex items-center gap-2 z-10">
        <Textarea
          className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ minHeight: 36, maxHeight: 80 }}
        />
        <Button
          onClick={handleSendMessage}
          disabled={sending || !newMessage.trim()}
          className="p-3 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default SupportChat;
