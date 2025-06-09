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
  const [isNewUser, setIsNewUser] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    min_budget: '',
    max_budget: '',
    email: '',
    password: '',
    confirmPassword: ''
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  // If new user, validate registration fields
  if (isNewUser && (!formData.email || !formData.password || !formData.confirmPassword)) {
    toast({
      title: 'Missing Information',
      description: 'Please fill in all required registration fields.',
      variant: 'destructive',
    });
    return;
  }

  if (isNewUser && formData.password !== formData.confirmPassword) {
    toast({
      title: 'Password Mismatch',
      description: 'Passwords do not match.',
      variant: 'destructive',
    });
    return;
  }

  setLoading(true);
  try {
    let user;

    if (isNewUser) {
      // Register new user with metadata
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            user_type: 'client',
            full_name: formData.email.split('@')[0],
          },
          emailRedirectTo: `${window.location.origin}/client`,
        },
      });

      if (signUpError) throw signUpError;
      user = signUpData.user;

      if (!user) throw new Error('User registration failed');

      // ✅ Do NOT upsert into 'profiles' here — wait for login after confirmation

      toast({
        title: 'Check your email',
        description: 'We sent a confirmation link to your email. Please verify your account before continuing.',
      });

      // Optionally redirect or halt job posting until confirmation
      navigate('/job-posted-notification');
      return;
    }

    // Existing user: get their session
    const { data: { user: existingUser }, error: userError } = await supabase.auth.getUser();
    if (userError || !existingUser) {
      navigate('/signin');
      return;
    }

    user = existingUser;

    // ✅ Create the job (only after login + confirmed)
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

                  {/* New user registration section */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-lg">Account Information</Label>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="isNewUser">New User?</Label>
                        <input
                          id="isNewUser"
                          type="checkbox"
                          checked={isNewUser}
                          onChange={() => setIsNewUser(!isNewUser)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {isNewUser && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            required={isNewUser}
                          />
                        </div>

                        <div className="relative">
                          <Label htmlFor="password">Password *</Label>
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            required={isNewUser}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-8 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>

                        <div className="relative">
                          <Label htmlFor="confirmPassword">Confirm Password *</Label>
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            required={isNewUser}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-8 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    )}
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