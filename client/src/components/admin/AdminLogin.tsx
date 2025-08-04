import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if the signed-in user is an admin
     
            const { data: adminUser, error: adminError } = await supabase
              .from('support_users' as any)
              .select('email')
              .eq('email', email)
              .maybeSingle();

      if (adminError || !adminUser) {
        // If not an admin, log them out immediately
        await supabase.auth.signOut();
        toast({
          title: 'Access Denied',
          description: 'You do not have administrative privileges.',
          variant: 'destructive',
        });
        navigate('/admin/login'); // Stay on login page
        return;
      }

      toast({
        title: 'Login Successful',
        description: 'Welcome to the Workvix Admin Panel!',
      });
      navigate('/admin'); // Redirect to admin dashboard
    } catch (error: any) {
      console.error('Login error:', error.message);
      toast({
        title: 'Error',
        description: error.message || 'Login failed. Please check your credentials.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <img
        src="/admin/background.jpg"
        alt="Admin Login Background"
        className="absolute inset-0 w-full h-full object-cover opacity-60 z-0"
        style={{ pointerEvents: 'none' }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />
      <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-gray-800">
            Workvix Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@workvix.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-8 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
    <Button type="submit" className="w-full" disabled={loading}>
      {loading ? 'Logging in...' : 'Login'}
    </Button>
    <div className="mt-4 text-center">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        ← Back to Workvix Homepage
      </Link>
    </div>
  </form>
</CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
