import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Users, Zap } from "lucide-react";

const signInFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const SignIn = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, loading, signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'client') {
        navigate('/client');
      } else if (user.role === 'freelancer') {
        navigate('/freelancer');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate]);

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
    setIsSubmitting(true);
    try {
      console.log('Attempting login with:', values.email);

      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const responseData = await response.json();
      console.log('Login response:', responseData);

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', responseData.token);
        
        // Update user context with the full user object
        signIn(responseData.user);

        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });

        // Immediately redirect based on role
        if (responseData.user.role === 'client') {
          navigate('/client');
        } else if (responseData.user.role === 'freelancer') {
          navigate('/freelancer');
        } else if (responseData.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error(responseData.message || `Sign in failed with status ${response.status}`);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      const errorMessage = error instanceof Error ? error.message : "Please try again later";
      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Form */}
            <div className="order-2 lg:order-1">
              <div className="max-w-md mx-auto lg:mx-0">
                <div className="text-center lg:text-left mb-8">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    Welcome back to{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      WorkVix
                    </span>
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Sign in to access your account and continue your freelance journey
                  </p>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Email address
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  type="email"
                                  placeholder="Enter your email"
                                  autoComplete="email"
                                  className="pl-10 h-12 text-sm sm:text-base"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-700">
                              Password
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  autoComplete="current-password"
                                  className="pl-10 pr-12 h-12 text-sm sm:text-base"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                  )}
                                </button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between text-sm">
                        <Link
                          to="/forgot-password"
                          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          Forgot your password?
                        </Link>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium h-12 text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Signing in...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            Sign in to your account
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </Form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                      Don't have an account?{" "}
                      <Link 
                        to="/join" 
                        className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Create one now
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Features */}
            <div className="order-1 lg:order-2">
              <div className="text-center lg:text-left">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6">
                      Join the future of freelancing
                    </h2>
                    <p className="text-blue-100 text-sm sm:text-base lg:text-lg mb-8">
                      Connect with top talent, build your business, and grow your career with WorkVix
                    </p>

                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4">
                          <Users className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">50K+ Active Freelancers</h3>
                          <p className="text-blue-100 text-xs sm:text-sm">Find the perfect talent for your project</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">Secure Payments</h3>
                          <p className="text-blue-100 text-xs sm:text-sm">Protected transactions and milestone payments</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4">
                          <Zap className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm sm:text-base">Fast Delivery</h3>
                          <p className="text-blue-100 text-xs sm:text-sm">Quick turnaround times and quality assurance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignIn;
