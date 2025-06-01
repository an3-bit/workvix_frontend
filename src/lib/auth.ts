
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export type AuthError = {
  message: string;
};

export async function signUp(email: string, password: string, metadata?: { 
  first_name?: string; 
  last_name?: string; 
  full_name?: string;
  role?: 'client' | 'freelancer';
}) {
  console.log("Attempting to sign up with metadata:", metadata);
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: metadata,
      },
    });
    console.log("Sign up response:", data, error);
    return { data, error };
  } catch (e) {
    console.error("Sign up error:", e);
    return { data: null, error: { message: "Failed to sign up. Please try again." } };
  }
}

export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("Sign in response:", data, error);
    return { data, error };
  } catch (e) {
    console.error("Sign in error:", e);
    return { data: null, error: { message: "Failed to sign in. Please try again." } };
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export function useAuth() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuthError = (error: AuthError | null) => {
    if (error) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return { handleAuthError };
}

export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      return null;
    }

    if (!data.session) {
      console.log("No active session found");
      return null;
    }

    console.log("Current user from session:", data.session.user);
    return data.session.user;
  } catch (e) {
    console.error("Get current user error:", e);
    return null;
  }
}

export async function createClientProfile(clientData: {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}) {
  const { error } = await supabase
    .from("clients")
    .insert([
      {
        id: clientData.id,
        email: clientData.email,
        first_name: clientData.first_name,
        last_name: clientData.last_name,
        created_at: new Date().toISOString(),
      },
    ]);
  return { error };
}

export async function createFreelancerProfile(freelancerData: {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}) {
  const { error } = await supabase
    .from("freelancers")
    .insert([
      {
        id: freelancerData.id,
        email: freelancerData.email,
        first_name: freelancerData.first_name,
        last_name: freelancerData.last_name,
        skills: [],
        hourly_rate: null,
        bio: null,
        portfolio_links: [],
        created_at: new Date().toISOString(),
      },
    ]);
  return { error };
}

export async function updateUserProfile(id: string, data: { 
  phone?: string; 
  full_name?: string; 
  first_name?: string;
  last_name?: string;
  role?: 'client' | 'freelancer';
}) {
  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("id", id);
  return { error };
}

export const getUserRole = async (userId: string) => {
  const { data: clientData } = await supabase
    .from('clients')
    .select('id')
    .eq('id', userId)
    .single();

  if (clientData) return 'client';

  const { data: freelancerData } = await supabase
    .from('freelancers')
    .select('id')
    .eq('id', userId)
    .single();

  return freelancerData ? 'freelancer' : null;
};
