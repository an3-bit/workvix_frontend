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
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff } from "lucide-react";

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
  const { role } = useParams<{ role: "client" | "freelancer" }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { user, loading, signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!role || !["client", "freelancer"].includes(role)) {
      navigate("/joinselection");
      return;
    }

    if (user && !loading) {
      // If already logged in, redirect to respective dashboard
      navigate(`/${role}`);
    }
  }, [user, loading, navigate, role]);

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
  const onRegistrationSubmit = async (values: z.infer<typeof registrationFormSchema>) => {
    setIsSubmitting(true);

    try {
      if (!role) throw new Error("Role not defined. Please start again.");

      // Use fetch to call your backend registration endpoint
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          password: values.password,
          role: role as 'client' | 'freelancer',
        }),
      });

      const responseData = await response.json();

      if (response.ok) { // Check if the HTTP status code is in the 200-299 range
        toast({
          title: "Account Created!",
          description: `Welcome! You've successfully joined as a ${role}.`,
        });
        // You might want to handle authentication state here
        // e.g., store user data in local storage or a state management solution
        // and potentially navigate the user.
        // For now, navigation is still handled by the useEffect above based on the user state from useAuth
      } else {
        // Handle backend errors
        throw new Error(responseData.message || `Registration failed with status ${response.status}`);
      }

    } catch (error: any) { // Use 'any' or a more specific type if you know the error structure
      let errorMessage = "An unexpected error occurred. Please try again later.";

      if (error instanceof Error) {
        // Basic error message parsing - you might need more sophisticated parsing
        // based on your backend's error response format.
        if (error.message.includes("already exists")) {
          errorMessage = "An account with this email already exists. Please sign in instead.";
        } else {
          errorMessage = error.message;
        }
      } else if (typeof error === 'string') {
         errorMessage = error;
      }


      toast({
        title: "Registration failed",
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
      <main className="flex-1">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
          <div className="container px-4 mx-auto sm:px-6">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Join as a {role === "client" ? "Client" : "Freelancer"}</h1>
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
                              <div className="relative">
                                <Input
                                  type={showPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="••••••••"
                                  {...field}
                                />
                                <button
                                  type="button"
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
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
                        {isSubmitting
                          ? "Creating Account..."
                          : `Sign Up as ${role === "client" ? "Client" : "Freelancer"}`}
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