
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Nav2 from '@/components/Nav2';
import ChatSystem from '@/components/chatsystem';
import { supabase } from '@/integrations/supabase/client';

const ChatPage = () => {
  const { chatId } = useParams();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('job');
  const [chatData, setChatData] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatId) {
      fetchChatData();
    }
  }, [chatId, jobId]);

  const fetchChatData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // If we have a job ID from the URL, fetch job data
      if (jobId) {
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .select(`
            *,
            client:client_id (first_name, last_name, email)
          `)
          .eq('id', jobId)
          .single();

        if (jobError) {
          console.error('Error fetching job data:', jobError);
        } else {
          setJobData(jobData);
        }
      }

      // Fetch user profile for the chat participant
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', chatId)
        .single();

      if (profileError) {
        console.error('Error fetching profile data:', profileError);
      } else {
        setChatData(profileData);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
          <div className="bg-white rounded-t-lg p-4 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {jobData ? `Chat about: ${jobData.title}` : 'Chat'}
                </h2>
                <p className="text-sm text-gray-600">
                  {chatData && `With ${chatData.first_name} ${chatData.last_name}`}
                  {jobData && ` • Budget: $${jobData.budget}`}
                </p>
              </div>
              
              {jobData && (
                <div className="text-right">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {jobData.category}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Posted: {new Date(jobData.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Chat System */}
          <div className="bg-white rounded-b-lg shadow-lg h-full">
            <ChatSystem 
              jobId={jobData?.id || jobId || 'default'} 
              bidId="default"
              receiverId={chatId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
