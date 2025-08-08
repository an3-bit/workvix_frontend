import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, Link } from 'react-router-dom';

const AffiliateRegister: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/affiliate/dashboard');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting affiliate registration:', {
        ...form,
        role: 'affiliate_marketer'
      });

      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || null,
          role: 'affiliate_marketer'
        }),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast({ 
        title: 'Registration successful!', 
        description: 'Please sign in to access your account.' 
      });
      
      // Redirect to affiliate sign in instead of dashboard
      navigate('/affiliate/signin');

    } catch (err: any) {
      console.error('Registration error:', err);
      toast({ 
        title: 'Registration failed', 
        description: err.message || 'Please try again later', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{
      backgroundImage: `url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&w=1200&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      {/* Overlay for darkening the background */}
      <div className="absolute inset-0 bg-black opacity-40 z-0" />
      {/* Blurred Circles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
      <div className="relative z-20 w-full max-w-md">
        <Card className="shadow-2xl rounded-2xl border-0 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center mb-2 text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-orange-400">Affiliate Marketer Registration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-gray-200">Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required className="h-12 text-lg bg-white/10 text-white placeholder:text-gray-200 border-white/30 focus:border-green-400 focus:ring-green-300" />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="h-12 text-lg bg-white/10 text-white placeholder:text-gray-200 border-white/30 focus:border-green-400 focus:ring-green-300" />
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-200">Password</Label>
                <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required className="h-12 text-lg bg-white/10 text-white placeholder:text-gray-200 border-white/30 focus:border-green-400 focus:ring-green-300" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-200">Phone (optional)</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} className="h-12 text-lg bg-white/10 text-white placeholder:text-gray-200 border-white/30 focus:border-green-400 focus:ring-green-300" />
              </div>
              <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white font-semibold shadow-lg backdrop-blur-md" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
            </form>
            <Button
              variant="outline"
              className="w-full h-12 text-lg mt-4 bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-md"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            <div className="mt-4 text-center">
              <span className="text-gray-200">Already registered?</span>
              <Link to="/affiliate/signin" className="ml-2 text-green-400 hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateRegister;