import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  adminEmail: string | null;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ adminEmail }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      navigate('/admin/login'); // Redirect to admin login page
    } catch (error: any) {
      console.error('Logout error:', error.message);
      toast({
        title: 'Error',
        description: error.message || 'Failed to log out.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-800">Workvix Admin Panel</h1>
        {adminEmail && (
          <span className="text-sm text-gray-600">Logged in as: {adminEmail}</span>
        )}
      </div>
      <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </Button>
    </header>
  );
};

export default AdminHeader;
