
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
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
        console.log('User found:', session.user.id);

        // First check the profiles table for user_type
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', session.user.id)
          .single();

        if (profileData?.user_type) {
          console.log('User role from profiles:', profileData.user_type);
          setUserRole(profileData.user_type as 'client' | 'freelancer');
          navigate(`/${profileData.user_type}`);
          return;
        }

        // Fallback: Check both role tables in parallel
        const [clientCheck, freelancerCheck] = await Promise.all([
          supabase.from('clients').select('id').eq('id', session.user.id).single(),
          supabase.from('freelancers').select('id').eq('id', session.user.id).single()
        ]);

        if (clientCheck.data) {
          console.log('User is a client');
          setUserRole('client');
          navigate('/client');
        } else if (freelancerCheck.data) {
          console.log('User is a freelancer');
          setUserRole('freelancer');
          navigate('/freelancer');
        } else {
          console.log('No role found, redirecting to role selection');
          // User has no role, redirect to role selection
          navigate('/joinselection');
          return;
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        // On error, try to redirect to sign in
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndRole();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Dashboard;
