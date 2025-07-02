import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.log('No user found or user error, redirecting to admin login.');
          navigate('/admin/login');
          return;
        }

        // Check if the logged-in user's email is in the support_users table
        
        const { data: adminUser, error: adminCheckError } = await supabase
          .from('support_users' as any)
          .select('email')
          .eq('email', user.email)
          .maybeSingle();

        if (adminCheckError || !adminUser) {
          console.log('User is not an admin, redirecting to admin login.');
          toast({
            title: 'Access Denied',
            description: 'You do not have administrative privileges.',
            variant: 'destructive',
          });
          // Log out the non-admin user
          await supabase.auth.signOut();
          navigate('/admin/login');
          return;
        }

        setIsAdmin(true);
        setAdminEmail(user.email); // Set the admin's email
      } catch (error: any) {
        console.error('Admin authentication error:', error.message);
        toast({
          title: 'Error',
          description: error.message || 'Authentication failed.',
          variant: 'destructive',
        });
        navigate('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();

    // Listen for auth state changes (e.g., user logs out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAdmin(false);
        setAdminEmail(null);
        navigate('/admin/login');
      } else {
        // Re-check admin status if session changes (e.g., re-login)
        checkAdminStatus();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-lg text-gray-700">Checking admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    // If not admin and not loading, it means they were redirected or access was denied.
    // This state should ideally not be reached if navigate() works immediately,
    // but acts as a fallback.
    return null;
  }

  // Pass adminEmail to children that might need it (e.g., AdminDashboardPage)
  return React.cloneElement(children as React.ReactElement, { adminEmail });
};

export default AdminProtectedRoute;
