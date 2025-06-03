import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const registrationFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the Terms of Service and Privacy Policy"
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Join = () => {
  const { role } = useParams<{ role: 'client' | 'freelancer' }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [isClient, setIsClient] = useState(role === 'client');
  const [isFreelancer, setIsFreelancer] = useState(role === 'freelancer');
  const [userRole, setUserRole] = useState<"client" | "freelancer" | null>(null);
  

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session && role) {
          navigate(`/${role}`);
        } else if (!role || !['client', 'freelancer'].includes(role)) {
          navigate('/joinselection');
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [navigate, role]);

  const form = useForm<z.infer<typeof registrationFormSchema>>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  // const onRegistrationSubmit = async (values: z.infer<typeof registrationFormSchema>) => {
  //   setIsSubmitting(true);
  //   try {
  //     if (isSignUp) {
  //       const { error } = await supabase.auth.signUp({
  //         email: values.email,
  //         password: values.password,
  //         options: {
  //           emailRedirectTo: `${window.location.origin}/auth/callback`
  //         }
  //       });
  //       if (error) throw error;
  //       toast({
  //         title: "Success",
  //         description: "Check your email for the confirmation link!",
  //       });
  //     } else {
  //       const { error } = await supabase.auth.signInWithPassword({
  //         email: values.email,
  //         password: values.password,
  //       });
  //       if (error) throw error;
  //     }
  //   } catch (error: any) {
  //     console.error("Registration error:", error);

  //     let errorMessage = "Please try again later";

  //     if (error.message?.includes("already registered")) {
  //       errorMessage = "An account with this email already exists. Please sign in instead.";
  //     } else if (error.message?.includes("invalid email")) {
  //       errorMessage = "Please enter a valid email address.";
  //     } else if (error.message?.includes("password")) {
  //       errorMessage = "Password must be at least 8 characters long.";
  //     } else if (error.message) {
  //       errorMessage = error.message;
  //     }

  //     toast({
  //       title: "Registration failed",
  //       description: errorMessage,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //     setIsSubmitting(false);
  //   }
  // };
  const onRegistrationSubmit = async (values: z.infer<typeof registrationFormSchema>) => {
  setIsSubmitting(true);
  try {
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            role: role // Store the user role
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      // Check if email confirmation is required
      if (data.user?.identities?.length === 0) {
        throw new Error('User already registered');
      }

      // Check if email was sent
      if (data.user?.confirmation_sent_at) {
        toast({
          title: "Success",
          description: "Check your email for the confirmation link!",
        });
      } else {
        // This might happen if email confirmations are disabled in your Supabase settings
        navigate(`/${role}`);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
    }
  } catch (error: any) {
    console.error("Registration error:", error);

    let errorMessage = "Please try again later";

    if (error.message?.includes("already registered")) {
      errorMessage = "An account with this email already exists. Please sign in instead.";
    } else if (error.message?.includes("invalid email")) {
      errorMessage = "Please enter a valid email address.";
    } else if (error.message?.includes("password")) {
      errorMessage = "Password must be at least 8 characters long.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    toast({
      title: "Registration failed",
      description: errorMessage,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
    setIsSubmitting(false);
  }
};

  if (isCheckingAuth) {
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
      <main className="flex-1">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
          <div className="container px-4 mx-auto sm:px-6">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">
                  Join as a {role === 'client' ? 'Client' : 'Freelancer'}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                  </Link>
                </p>
              </div>
              <Card>
                <CardContent className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onRegistrationSubmit)} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" {...field} />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="agreeToTerms"
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="text-sm leading-snug">
                              <FormLabel>
                                I agree to the{" "}
                                <Link to="#" className="text-blue-600 hover:underline">
                                  Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link to="#" className="text-blue-600 hover:underline">
                                  Privacy Policy
                                </Link>
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Creating Account..." : `Sign Up as ${role === 'client' ? 'Client' : 'Freelancer'}`}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Join;
