import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import SupportChat from '@/components/SupportChat';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SupportChatPage: React.FC = () => {
  const query = useQuery();
  const orderId = query.get('orderId');
  const [chatId, setChatId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const setupChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Determine user_type
      let user_type = 'client';
      const { count: clientCount } = await supabase
        .from('jobs')
        .select('id', { count: 'exact', head: true })
        .eq('client_id', user.id)
        .maybeSingle();
      const { count: freelancerCount } = await supabase
        .from('bids')
        .select('id', { count: 'exact', head: true })
        .eq('freelancer_id', user.id)
        .maybeSingle();
      if (freelancerCount && freelancerCount > 0) user_type = 'freelancer';

      // Try to find an existing private chat for this user
      let { data: chat } = await supabase
        .from('support_chats')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      // If not found, create one
      if (!chat) {
        const { data: newChat } = await supabase
          .from('support_chats')
          .insert([{ user_id: user.id, user_type, status: 'open' }])
          .select('id')
          .single();
        chat = newChat;
      }

      if (chat) setChatId(chat.id);
    };
    setupChat();
  }, []);

  if (!chatId) return <div>Loading support chat...</div>;

  return <SupportChat chatId={chatId} onClose={() => navigate(-1)} />;
};

export default SupportChatPage; 