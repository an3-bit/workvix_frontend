
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import ClientDashboard from '@/pages/client/clientdashboard';
import FreelancerDashboard from '@/pages/freelancer/freelancerdashboard';
import AuthGuard from '@/components/AuthGuard';

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'client' | 'freelancer' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate('/signin');
          return;
        }

        setUser(session.user);

        // Check if user is a client
        const { data: clientData } = await supabase
          .from('clients')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (clientData) {
          setUserRole('client');
          setLoading(false);
          return;
        }

        // Check if user is a freelancer
        const { data: freelancerData } = await supabase
          .from('freelancers')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (freelancerData) {
          setUserRole('freelancer');
        } else {
          // User has no role, redirect to role selection
          navigate('/joinselection');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRole();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      {userRole === 'client' && <ClientDashboard />}
      {userRole === 'freelancer' && <FreelancerDashboard />}
    </AuthGuard>
  );
};

export default Dashboard;
