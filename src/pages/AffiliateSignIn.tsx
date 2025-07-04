import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const AffiliateSignIn: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) throw error;
      const user = data.user;
      if (!user) throw new Error('Authentication failed.');
      // Check user_type
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .maybeSingle();
      if (profileError && profileError.code !== 'PGRST116') throw profileError;
      if (!profile) {
        // Insert profile if it doesn't exist
        const now = new Date().toISOString();
        const { error: insertError } = await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          first_name: '',
          last_name: '',
          phone: '',
          created_at: now,
          updated_at: now,
          user_type: 'affiliate_marketer',
          online: true,
        });
        if (insertError) throw insertError;
      } else if (profile.user_type !== 'affiliate_marketer') {
        throw new Error('This sign-in is for affiliate marketers only.');
      }
      toast({ title: 'Welcome back!', description: 'You have been signed in successfully.' });
      navigate('/affiliate/dashboard');
    } catch (err: any) {
      toast({ title: 'Sign in error', description: err.message, variant: 'destructive' });
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Affiliate Marketer Sign In</span>
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">Sign in to access your affiliate dashboard and manage your referrals.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="h-12 text-lg" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required className="h-12 text-lg" />
              </div>
              <Button type="submit" className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
            </form>
            <Button
              variant="outline"
              className="w-full h-12 text-lg mt-4"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            <div className="mt-4 text-center">
              <span className="text-gray-600">Don't have an account?</span>
              <Button variant="link" className="ml-2 text-blue-600" onClick={() => navigate('/affiliate/register')}>
                Register
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateSignIn; 