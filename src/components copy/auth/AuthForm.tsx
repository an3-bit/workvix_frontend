
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn, signUp, AuthError } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

interface AuthFormProps {
  mode: "signup" | "signin";
  onSuccess?: (data: any) => void;
  includeFullName?: boolean;
}

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Define the signup schema with fullName conditionally
const signUpSchema = signInSchema.extend({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
});

export function AuthForm({ mode, onSuccess, includeFullName = false }: AuthFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Choose the appropriate schema based on mode and whether fullName is included
  const formSchema = mode === "signup" && includeFullName ? signUpSchema : signInSchema;

  // Define form values type that accommodates both schemas
  type FormValues = {
    email: string;
    password: string;
    fullName?: string;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema as any), // Type assertion to handle the conditional schema
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      let error: AuthError | null = null;
      let data = null;

      if (mode === "signup") {
        // Create metadata only if fullName is provided
        const metadata = includeFullName && values.fullName 
          ? { full_name: values.fullName } 
          : undefined;

        console.log("Signing up with metadata:", metadata);
        const result = await signUp(
          values.email, 
          values.password, 
          metadata
        );
        error = result.error;
        data = result.data;
        
        // For signup, automatically sign them in if there's no error
        if (!error) {
          console.log("Auto sign-in after successful signup");
          const signInResult = await signIn(values.email, values.password);
          if (signInResult.error) {
            console.warn("Auto sign-in failed:", signInResult.error);
          } else {
            data = signInResult.data;
          }
        }
      } else {
        const result = await signIn(values.email, values.password);
        error = result.error;
        data = result.data;
      }

      if (error) {
        console.error("Auth error:", error);
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: mode === "signup" ? "Account created" : "Welcome back!",
          description: mode === "signup" 
            ? "Your account has been created successfully." 
            : "You have been signed in successfully.",
        });
        
        if (onSuccess) {
          onSuccess(data);
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {includeFullName && mode === "signup" && (
          <FormField
            control={form.control}
            name="fullName" 
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : mode === "signup" ? "Create Account" : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
