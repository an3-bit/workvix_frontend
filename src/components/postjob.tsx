import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from './Navbar';
import Footer from '@/components/Footer';
import { Eye, EyeOff } from 'lucide-react';

const PostJobForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    min_budget: '',
    max_budget: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    agreeToPromotions: false,
    agreeToTerms: false
  });

  const categories = [
    'Web Development',
    'Mobile Development',
    'Design & Creative',
    'Writing & Translation',
    'Digital Marketing',
    'Video & Animation',
    'Music & Audio',
    'Programming & Tech',
    'Business',
    'Data'
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/client`,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to authenticate with Google',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate job fields
    if (!formData.title || !formData.description || !formData.category || !formData.budget) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required job fields.',
        variant: 'destructive',
      });
      return;
    }

    // Validate auth fields
    if (!formData.email || !formData.password) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in email and password.',
        variant: 'destructive',
      });
      return;
    }

    // Additional validation for signup
    if (authTab === 'signup') {
      if (!formData.name) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in your name.',
          variant: 'destructive',
        });
        return;
      }

      if (!formData.confirmPassword) {
        toast({
          title: 'Missing Information',
          description: 'Please confirm your password.',
          variant: 'destructive',
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: 'Password Mismatch',
          description: 'Passwords do not match.',
          variant: 'destructive',
        });
        return;
      }

      if (!formData.agreeToTerms) {
        toast({
          title: 'Terms Required',
          description: 'Please agree to the Terms & Conditions.',
          variant: 'destructive',
        });
        return;
      }
    }

    setLoading(true);
    try {
      let user;

      if (authTab === 'signup') {
        // Register new user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              user_type: 'client',
              full_name: formData.name,
              phone: formData.phone,
            },
            emailRedirectTo: `${window.location.origin}/client`,
          },
        });
        console.log('SIGNUP RESPONSE', signUpData, signUpError);

        if (signUpError) throw signUpError;
        user = signUpData.user;

        if (!user) throw new Error('User registration failed');

        // Store job data temporarily for after email confirmation
        const jobData = {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget: parseFloat(formData.budget),
          min_budget: formData.min_budget ? parseFloat(formData.min_budget) : null,
          max_budget: formData.max_budget ? parseFloat(formData.max_budget) : null,
        };

        // Store in localStorage temporarily (will be cleared after job creation)
        localStorage.setItem('pendingJobData', JSON.stringify(jobData));

        toast({
          title: 'Check your email',
          description: 'We sent a confirmation link to your email. After confirming, your job will be posted automatically.',
        });

        navigate('/job-posted-notification', {
          state: {
            isPendingConfirmation: true,
            email: formData.email,
          },
        });
        return;
      } else {
        // Sign in existing user
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;
        user = signInData.user;

        if (!user) throw new Error('Sign in failed');
      }

      // Create the job (only for existing users who signed in)
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .insert([{
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget: parseFloat(formData.budget),
          min_budget: formData.min_budget ? parseFloat(formData.min_budget) : null,
          max_budget: formData.max_budget ? parseFloat(formData.max_budget) : null,
          client_id: user.id,
          status: 'open',
        }])
        .select()
        .single();

      if (jobError) throw jobError;

      // Notify freelancers
      const { data: freelancers, error: freelancersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_type', 'freelancer');

      if (freelancersError) throw freelancersError;

      if (freelancers && freelancers.length > 0) {
        const notifications = freelancers.map(freelancer => ({
          user_id: freelancer.id,
          type: 'job_posted',
          message: `New job posted: "${formData.title}" - $${formData.budget}`,
          job_id: jobData.id,
          read: false,
        }));

        await supabase.from('notifications').insert(notifications);
      }

      toast({
        title: 'Job Posted Successfully',
        description: 'Your job has been posted and freelancers will be notified.',
      });

      navigate('/job-posted-notification', {
        state: {
          jobId: jobData.id,
          isNewUser: false,
        },
      });
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Post a New Job</CardTitle>
                <p className="text-gray-600">Find the perfect freelancer for your project</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Build a WordPress website"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project requirements..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="budget">Budget ($) *</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="1000"
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="min_budget">Min Budget ($)</Label>
                      <Input
                        id="min_budget"
                        type="number"
                        placeholder="500"
                        value={formData.min_budget}
                        onChange={(e) => handleInputChange('min_budget', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_budget">Max Budget ($)</Label>
                      <Input
                        id="max_budget"
                        type="number"
                        placeholder="2000"
                        value={formData.max_budget}
                        onChange={(e) => handleInputChange('max_budget', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Authentication section with tabs */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="mb-6">
                      <div className="flex border-b border-gray-200">
                        <button
                          type="button"
                          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            authTab === 'signin'
                              ? 'border-green-500 text-green-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                          onClick={() => setAuthTab('signin')}
                        >
                          Returning customer
                        </button>
                        <button
                          type="button"
                          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                            authTab === 'signup'
                              ? 'border-green-500 text-green-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700'
                          }`}
                          onClick={() => setAuthTab('signup')}
                        >
                          New customer
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Google Sign In/Up Button */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                        onClick={handleGoogleAuth}
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        {authTab === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
                      </Button>

                      <div className="text-center text-gray-500 text-sm">or</div>

                      {/* Email Field */}
                      <div>
                        <Label htmlFor="email">{authTab === 'signin' ? 'Email or ID' : 'Email'}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                      </div>

                      {/* Password Field */}
                      <div className="relative">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
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
                      {/* Confirm Password Field for signup */}
                      {authTab === 'signup' && (
                        <div className="relative">
                          <Label htmlFor="confirmPassword">Confirm Password</Label>
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-8 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      )}
                      

                      {/* Additional fields for signup */}
                      {authTab === 'signup' && (
                        <>
                          <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                              id="name"
                              placeholder="Your full name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              required
                            />
                          </div>

                          {/* <div>
                            <Label htmlFor="phone">Phone</Label>
                            <div className="flex">
                              <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMDA5QzAwIi8+CjxyZWN0IHk9IjgiIHdpZHRoPSIyNCIgaGVpZ2h0PSI4IiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHk9IjE2IiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgZmlsbD0iI0ZGMDAwMCIvPgo8L3N2Zz4K" alt="Kenya flag" className="w-5 h-4" />
                                <span className="ml-2 text-sm">+254</span>
                              </div>
                              <Input
                                id="phone"
                                placeholder="712345678"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="rounded-l-none"
                              />
                            </div>
                          </div> */}

                          <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                              <input
                                type="checkbox"
                                id="promotions"
                                checked={formData.agreeToPromotions}
                                onChange={(e) => handleInputChange('agreeToPromotions', e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <Label htmlFor="promotions" className="text-sm text-gray-600">
                                I agree to receive discount coupons, exclusive offers, and the latest news by email, SMS, phone, and other electronic means
                              </Label>
                            </div>

                            <div className="flex items-start space-x-2">
                              <input
                                type="checkbox"
                                id="terms"
                                checked={formData.agreeToTerms}
                                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                required
                              />
                              <Label htmlFor="terms" className="text-sm text-gray-600">
                                I agree to the{' '}
                                <a href="/terms" className="text-blue-600 hover:underline">
                                  Terms & Conditions
                                </a>{' '}
                                and{' '}
                                <a href="/privacy" className="text-blue-600 hover:underline">
                                  Privacy Policy
                                </a>
                              </Label>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Forgot password link for signin only */}
                      {authTab === 'signin' && (
                        <div className="text-right">
                          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                            Forgot password
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? 'Processing...' : 'Post Job'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/')}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PostJobForm;