import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle, Eye, EyeOff, Briefcase, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JobPostedNotification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [job, setJob] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState<'signup' | 'signin'>('signup');
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const pendingJob = localStorage.getItem('pendingJob');
    if (!pendingJob) {
      navigate('/post-job');
      return;
    }
    setJob(JSON.parse(pendingJob));

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const userData = JSON.parse(user);
      setIsLoggedIn(true);
      sendJobToBackend(JSON.parse(pendingJob), userData.id);
    }
  }, [navigate]);

  const sendJobToBackend = async (jobData: any, clientId: string) => {
    try {
      setLoading(true);
      const payload = { ...jobData, client_id: clientId };

      const res = await fetch('http://localhost:5000/jobs', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to post job');
      }

      toast({
        title: '🎉 Job Posted Successfully!',
        description: 'Your job is now live and top freelancers will start bidding soon.',
      });

      localStorage.removeItem('pendingJob');
      setJob(null);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred while posting the job.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (authData.password !== authData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (!authData.name || !authData.email || !authData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authData.name,
          email: authData.email,
          password: authData.password,
          role: 'client'
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast({
        title: 'Welcome aboard! 🎉',
        description: 'Your account has been created successfully.',
      });

      setIsLoggedIn(true);
      await sendJobToBackend(job, data.user.id);
      
      // Navigate to client dashboard after successful job posting
      setTimeout(() => {
        navigate('/client');
      }, 2000);

    } catch (error: any) {
      toast({
        title: 'Registration Error',
        description: error.message || 'Failed to create account',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async () => {
    if (!authData.email || !authData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: authData.email,
          password: authData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast({
        title: 'Welcome back! 👋',
        description: 'You have been signed in successfully.',
      });

      setIsLoggedIn(true);
      await sendJobToBackend(job, data.user.id);
      
      // Navigate to client dashboard after successful job posting
      setTimeout(() => {
        navigate('/client');
      }, 2000);

    } catch (error: any) {
      toast({
        title: 'Login Error',
        description: error.message || 'Failed to sign in',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {isLoggedIn ? (
            // Success State
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <CheckCircle className="h-20 w-20 text-green-500" />
                  <div className="absolute -top-2 -right-2 bg-green-100 rounded-full p-2">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                🎉 Congratulations! Your Job is Live
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Your job posting has been successfully published and is now visible to our network of skilled freelancers. 
                You'll start receiving quality proposals soon!
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Active Freelancers</p>
                  <p className="font-semibold text-gray-800">10,000+</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">Avg. Response</p>
                  {/* <p className="font-semibold text-gray-800">< 2 hours</p> */}
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="font-semibold text-gray-800">95%</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105" 
                  onClick={() => navigate('/client')}
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition-all duration-300" 
                  onClick={() => navigate('/client/bids')}
                >
                  View Incoming Proposals
                </Button>
              </div>
            </div>
          ) : (
            // Authentication State
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 rounded-full p-4">
                    <Briefcase className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-2">
                  🎊 Almost There! Your Job is Ready to Publish
                </h1>
                <p className="text-blue-100 text-lg">
                  Join thousands of successful clients who have found their perfect freelancers on our platform
                </p>
              </div>

              {/* Benefits Section */}
              {/* <div className="px-8 py-6 bg-gray-50 border-b">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-blue-600 font-semibold text-lg">10,000+</div>
                    <div className="text-sm text-gray-600">Skilled Freelancers</div>
                  </div>
                  <div>
                    <div className="text-purple-600 font-semibold text-lg">< 2 Hours</div>
                    <div className="text-sm text-gray-600">Average Response Time</div>
                  </div>
                  <div>
                    <div className="text-green-600 font-semibold text-lg">95%</div>
                    <div className="text-sm text-gray-600">Project Success Rate</div>
                  </div>
                </div>
              </div> */}

              {/* Auth Form */}
              <div className="p-8">
                <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={tab === 'signup' ? 'default' : 'ghost'}
                    onClick={() => setTab('signup')}
                    className={`flex-1 rounded-md ${tab === 'signup' ? 'bg-white shadow-sm' : ''}`}
                  >
                    Create Account
                  </Button>
                  <Button
                    variant={tab === 'signin' ? 'default' : 'ghost'}
                    onClick={() => setTab('signin')}
                    className={`flex-1 rounded-md ${tab === 'signin' ? 'bg-white shadow-sm' : ''}`}
                  >
                    Sign In
                  </Button>
                </div>

                {tab === 'signup' ? (
                  <div className="space-y-4">
                    <Input
                      placeholder="Full Name *"
                      className="h-12 border-2 focus:border-blue-500 rounded-lg"
                      value={authData.name}
                      onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
                    />
                    <Input
                      placeholder="Email Address *"
                      type="email"
                      className="h-12 border-2 focus:border-blue-500 rounded-lg"
                      value={authData.email}
                      onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                    />
                    <div className="relative">
                      <Input
                        placeholder="Password *"
                        type={showPassword ? 'text' : 'password'}
                        className="h-12 border-2 focus:border-blue-500 rounded-lg pr-12"
                        value={authData.password}
                        onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        placeholder="Confirm Password *"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="h-12 border-2 focus:border-blue-500 rounded-lg pr-12"
                        value={authData.confirmPassword}
                        onChange={(e) => setAuthData({ ...authData, confirmPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                      onClick={handleSignup}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating Account & Posting Job...
                        </div>
                      ) : (
                        '🚀 Create Account & Publish Job'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      placeholder="Email Address *"
                      type="email"
                      className="h-12 border-2 focus:border-blue-500 rounded-lg"
                      value={authData.email}
                      onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                    />
                    <div className="relative">
                      <Input
                        placeholder="Password *"
                        type={showPassword ? 'text' : 'password'}
                        className="h-12 border-2 focus:border-blue-500 rounded-lg pr-12"
                        value={authData.password}
                        onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
                      onClick={handleSignin}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Signing In & Posting Job...
                        </div>
                      ) : (
                        '✨ Sign In & Publish Job'
                      )}
                    </Button>
                  </div>
                )}
                
                <p className="text-center text-sm text-gray-500 mt-6">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobPostedNotification;