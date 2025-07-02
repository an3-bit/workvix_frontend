import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { DollarSign, Clock, Tag, ArrowLeft } from 'lucide-react';

const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .maybeSingle();
      if (error) {
        setError('Failed to fetch job.');
      } else if (!data) {
        setError('Job not found.');
      } else {
        setJob(data);
      }
      setLoading(false);
    };
    if (jobId) fetchJob();
  }, [jobId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      <div className="container mx-auto px-4 pt-20 pb-8 min-h-[60vh]">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs
        </Button>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-20">{error}</div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-6">
              <span className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <DollarSign className="h-4 w-4 mr-1" />
                ${job.budget}
              </span>
              <span className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4 mr-1" />
                Posted {new Date(job.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                <Tag className="h-4 w-4 mr-1" />
                {job.category}
              </span>
              {job.status && (
                <span className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              )}
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">{job.description}</p>
            {/* Add more job details here if needed */}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default JobDetailsPage; 