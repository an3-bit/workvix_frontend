
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Nav2 from '@/components/Nav2';
import ChatSystem from '@/components/chatsystem';
import { supabase } from '@/integrations/supabase/client';

const ChatPage = () => {
  const { chatId } = useParams();
  const [jobData, setJobData] = useState(null);
  const [bidData, setBidData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatId) {
      fetchChatData();
    }
  }, [chatId]);

  const fetchChatData = async () => {
    try {
      if (chatId?.startsWith('bid-')) {
        // Extract bid ID from chatId
        const bidId = chatId.replace('bid-', '');
        
        const { data: bidData, error } = await supabase
          .from('bids')
          .select(`
            *,
            job:jobs(*),
            freelancer:freelancers(*)
          `)
          .eq('id', bidId)
          .single();

        if (error) {
          console.error('Error fetching bid data:', error);
          return;
        }

        setBidData(bidData);
        setJobData(bidData.job);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav2 />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skillforge-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4 h-[calc(100vh-6rem)]">
          {/* Chat Header */}
          {bidData && (
            <div className="bg-white rounded-t-lg p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Chat about: {jobData?.title || 'Project'}
              </h2>
              <p className="text-sm text-gray-600">
                With {bidData.freelancer?.first_name} {bidData.freelancer?.last_name} • Bid: ${bidData.amount}
              </p>
            </div>
          )}
          
          {/* Chat System */}
          <div className="bg-white rounded-b-lg shadow-lg h-full">
            <ChatSystem 
              jobId={jobData?.id || 'default'} 
              bidId={bidData?.id || 'default'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
