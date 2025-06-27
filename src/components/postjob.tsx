import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from './Navbar';
import Footer from '@/components/Footer';
import { Eye, EyeOff, UploadCloud, Mail, CheckCircle } from 'lucide-react';
import Nav2 from './Nav2';

const EMAIL_REDIRECT_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5173/post-job'
  : 'https://your-production-domain.com/post-job'; // <-- Replace with your real production domain

const PostJobForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [userSession, setUserSession] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showEmailConfirmationDialog, setShowEmailConfirmationDialog] = useState(false);
  const [pendingJobData, setPendingJobData] = useState<any>(null);
  const [emailConfirmationStatus, setEmailConfirmationStatus] = useState<'pending' | 'confirmed' | 'error'>('pending');

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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const categories = [
    'Web Development', 'Mobile Development', 'Design & Creative', 'Writing & Translation',
    'Digital Marketing', 'Video & Animation', 'Music & Audio', 'Programming & Tech',
    'Business', 'Data'
  ];

  useEffect(() => {
    const checkUser = async () => {
      setCheckingAuth(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUserSession(session);
      setCheckingAuth(false);

      if (session) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email, first_name, last_name')
          .eq('id', session.user.id)
          .single();

        if (profileData && !profileError) {
          setFormData(prev => ({
            ...prev,
            email: profileData.email || session.user.email || '',
            name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
          }));
        } else {
             setFormData(prev => ({
                ...prev,
                email: session.user.email || '',
             }));
        }
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUserSession(session);
      
      // Handle email confirmation
      if (event === 'SIGNED_IN' && session && pendingJobData) {
        setEmailConfirmationStatus('confirmed');
        
        // Wait a moment for the user to see the confirmation
        setTimeout(async () => {
          try {
            // Now post the job with the confirmed user
            await postJobWithUser(session.user.id);
            setShowEmailConfirmationDialog(false);
            setPendingJobData(null);
            setEmailConfirmationStatus('pending');
          } catch (error: any) {
            console.error('Error posting job after confirmation:', error);
            setEmailConfirmationStatus('error');
            toast({
              title: 'Error',
              description: 'Failed to post job after email confirmation. Please try again.',
              variant: 'destructive',
            });
          }
        }, 2000);
      }
    });

    return () => subscription.unsubscribe();
  }, [pendingJobData]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
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
    } finally {
        setLoading(false);
    }
  };

  // Function to post job with confirmed user
  const postJobWithUser = async (userId: string) => {
    if (!pendingJobData) return;

    // File upload logic
    let attachmentUrl: string | null = null;
    if (pendingJobData.selectedFile) {
      const fileExtension = pendingJobData.selectedFile.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExtension}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, pendingJobData.selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from('attachments')
        .getPublicUrl(filePath);

      if (publicUrlData) {
        attachmentUrl = publicUrlData.publicUrl;
      }
    }

    // Create the job
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .insert([{
        title: pendingJobData.title,
        description: pendingJobData.description,
        category: pendingJobData.category,
        budget: parseFloat(pendingJobData.budget),
        min_budget: pendingJobData.min_budget ? parseFloat(pendingJobData.min_budget) : null,
        max_budget: pendingJobData.max_budget ? parseFloat(pendingJobData.max_budget) : null,
        client_id: userId,
        status: 'open',
        attachment_url: attachmentUrl,
      }])
      .select()
      .single();

    if (jobError) throw jobError;

    // Send notifications to freelancers
    const { data: freelancers, error: freelancersError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_type', 'freelancer');

    if (freelancersError) console.error("Error fetching freelancers for notification:", freelancersError.message);

    if (freelancers && freelancers.length > 0) {
      const notifications = freelancers.map(freelancer => ({
        user_id: freelancer.id,
        type: 'job_posted',
        message: `New job posted: "${pendingJobData.title}" - $${pendingJobData.budget}`,
        job_id: jobData.id,
        read: false,
      }));

      await supabase.from('notifications').insert(notifications);
    }

    toast({
      title: 'Job Posted Successfully!',
      description: 'Your job has been posted and freelancers will be notified. You can now view bids.',
    });

    navigate('/job-posted-notification', {
      state: {
        jobId: jobData.id,
        isNewUser: true,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category || !formData.budget) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required job fields.',
        variant: 'destructive',
      });
      return;
    }

    if (!userSession) {
        if (!formData.email || !formData.password) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in email and password.',
                variant: 'destructive',
            });
            return;
        }

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
    }

    setLoading(true);
    try {
      let currentUserId = userSession?.user?.id;

      if (!userSession) {
        if (authTab === 'signup') {
          // Store job data for later posting
          setPendingJobData({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            budget: formData.budget,
            min_budget: formData.min_budget,
            max_budget: formData.max_budget,
            selectedFile: selectedFile,
          });

          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                user_type: 'client',
                first_name: formData.name.split(' ')[0] || '',
                last_name: formData.name.split(' ').slice(1).join(' ') || '',
                phone: formData.phone,
              },
              emailRedirectTo: EMAIL_REDIRECT_URL,
            },
          });

          if (signUpError) {
              if (signUpError.message.includes("User already registered")) {
                throw new Error("An account with this email already exists. Please sign in instead.");
              }
              throw signUpError;
          }

          // Show popup dialog instead of navigating away
          setShowEmailConfirmationDialog(true);
          setLoading(false);
          return;
        } else {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

          if (signInError) throw signInError;
          currentUserId = signInData.user?.id;
          if (!currentUserId) throw new Error('Sign in failed: No user ID obtained.');
        }
      }

      // For existing users, post job immediately
      if (currentUserId) {
        // File upload logic
        let attachmentUrl: string | null = null;
        if (selectedFile) {
          const fileExtension = selectedFile.name.split('.').pop();
          const filePath = `${currentUserId}/${Date.now()}.${fileExtension}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('attachments')
            .upload(filePath, selectedFile, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) {
            throw new Error(`File upload failed: ${uploadError.message}`);
          }

          const { data: publicUrlData } = supabase.storage
            .from('attachments')
            .getPublicUrl(filePath);

          if (publicUrlData) {
            attachmentUrl = publicUrlData.publicUrl;
          }
        }

        // Create the job
        const { data: jobData, error: jobError } = await supabase
          .from('jobs')
          .insert([{
            title: formData.title,
            description: formData.description,
            category: formData.category,
            budget: parseFloat(formData.budget),
            min_budget: formData.min_budget ? parseFloat(formData.min_budget) : null,
            max_budget: formData.max_budget ? parseFloat(formData.max_budget) : null,
            client_id: currentUserId,
            status: 'open',
            attachment_url: attachmentUrl,
          }])
          .select()
          .single();

        if (jobError) throw jobError;

        // Send notifications to freelancers
        const { data: freelancers, error: freelancersError } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_type', 'freelancer');

        if (freelancersError) console.error("Error fetching freelancers for notification:", freelancersError.message);

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
      }
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

  const handleResendEmail = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: 'Error',
        description: 'Email and password are required to resend confirmation.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
        options: {
          emailRedirectTo: EMAIL_REDIRECT_URL,
        },
      });

      if (error) throw error;

      toast({
        title: 'Email Resent',
        description: 'Confirmation email has been resent to your inbox.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend confirmation email.',
        variant: 'destructive',
      });
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {userSession ? <Nav2 /> : <Navbar />}
      
      {/* Email Confirmation Dialog */}
      <Dialog open={showEmailConfirmationDialog} onOpenChange={setShowEmailConfirmationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {emailConfirmationStatus === 'confirmed' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Mail className="h-5 w-5 text-blue-500" />
              )}
              {emailConfirmationStatus === 'confirmed' ? 'Email Confirmed!' : 'Check Your Email'}
            </DialogTitle>
            <DialogDescription>
              {emailConfirmationStatus === 'pending' && (
                <>
                  We've sent a confirmation email to <strong>{formData.email}</strong>. 
                  Please check your inbox and click the confirmation link to verify your account.
                  <br /><br />
                  Once confirmed, you'll be automatically signed in and your job will be posted.
                </>
              )}
              {emailConfirmationStatus === 'confirmed' && (
                <>
                  Your email has been confirmed! You're now signed in and your job is being posted...
                </>
              )}
              {emailConfirmationStatus === 'error' && (
                <>
                  There was an error posting your job after confirmation. Please try again or contact support.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-row">
            {emailConfirmationStatus === 'pending' && (
              <>
                <Button
                  variant="outline"
                  onClick={handleResendEmail}
                  className="w-full sm:w-auto"
                >
                  Resend Email
                </Button>
                <Button
                  onClick={() => {
                    setShowEmailConfirmationDialog(false);
                    setPendingJobData(null);
                    navigate('/signin');
                  }}
                  className="w-full sm:w-auto"
                >
                  Go to Sign In
                </Button>
              </>
            )}
            {emailConfirmationStatus === 'confirmed' && (
              <div className="w-full text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Posting your job...</p>
              </div>
            )}
            {emailConfirmationStatus === 'error' && (
              <Button
                onClick={() => {
                  setShowEmailConfirmationDialog(false);
                  setPendingJobData(null);
                  setEmailConfirmationStatus('pending');
                }}
                className="w-full"
              >
                Try Again
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800">Attachments (Optional)</h3>
                  <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md border border-gray-300 transition-colors flex items-center"
                      >
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Choose File
                      </label>
                      {selectedFile ? (
                        <span className="text-sm text-gray-600 truncate max-w-xs">
                          {selectedFile.name}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="ml-2 text-red-500 hover:text-red-700"
                            onClick={() => setSelectedFile(null)}
                          >
                            x
                          </Button>
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">No file chosen</span>
                      )}
                    </div>
                  </div>
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

                  {!userSession && (
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

                        {authTab === 'signin' && (
                          <div className="text-right">
                            <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                              Forgot password
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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
