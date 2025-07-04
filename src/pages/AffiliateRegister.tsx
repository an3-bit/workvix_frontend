import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

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
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            phone: form.phone,
            role: 'affiliate_marketer',
          },
        },
      });
      if (error) throw error;
      const user = data.user;
      if (!user) throw new Error('User registration failed.');
      // Split name into first and last name
      const [firstName, ...lastNameParts] = form.name.trim().split(' ');
      const lastName = lastNameParts.join(' ');
      // Insert into profiles table
      const now = new Date().toISOString();
      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        email: form.email,
        first_name: firstName,
        last_name: lastName,
        phone: form.phone,
        created_at: now,
        updated_at: now,
        user_type: 'affiliate_marketer',
        online: true,
      });
      if (profileError) throw profileError;
      toast({ title: 'Registration successful', description: 'Check your email to confirm your account.' });
      navigate('/affiliate/dashboard');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      {/* Blurred Circles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Affiliate Marketer Registration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} required className="h-12 text-lg" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="h-12 text-lg" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required className="h-12 text-lg" />
              </div>
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={handleChange} className="h-12 text-lg" />
              </div>
              <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
            </form>
            <Button
              variant="outline"
              className="w-full h-12 text-lg mt-4"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            <div className="mt-4 text-center">
              <span className="text-gray-600">Already registered?</span>
              <Button variant="link" className="ml-2 text-blue-600" onClick={() => navigate('/affiliate/signin')}>
                Sign in
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateRegister; 