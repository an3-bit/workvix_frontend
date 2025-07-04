import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export const getUserRole = async (userId: string): Promise<'client' | 'freelancer' | null> => {
  try {
    // First check the profiles table for user_type (most efficient)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', userId)
      .maybeSingle();

    if (profileData?.user_type) {
      return profileData.user_type as 'client' | 'freelancer';
    }

    // Fallback: Check both role tables in parallel
    const [clientCheck, freelancerCheck] = await Promise.all([
      supabase.from('clients').select('id').eq('id', userId).maybeSingle(),
      supabase.from('freelancers').select('id').eq('id', userId).maybeSingle()
    ]);

    if (clientCheck.data) return 'client';
    if (freelancerCheck.data) return 'freelancer';
    return null;
  } catch (error) {
    console.error('Error checking user role:', error);
    return null;
  }
};

// Updated Job service with proper user validation
export class JobService {
  // Create a new job with proper user validation
  static async createJob(jobData: {
    title: string
    description: string
    category: string
    min_budget: number
    max_budget: number
    budget: number
  }) {
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`)
      }

      if (!session || !session.user) {
        throw new Error('User must be authenticated to post a job')
      }

      const userId = session.user.id

      // Debug: Log the user ID
      console.log('Current user ID:', userId)

      // Check if user exists in profiles table (create if doesn't exist)
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      if (profileCheckError && profileCheckError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Creating profile for user:', userId)
        
        const { data: newProfile, error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: session.user.email,
            first_name: session.user.user_metadata?.first_name || null,
            last_name: session.user.user_metadata?.last_name || null,
            user_type: session.user.user_metadata?.user_type || 'client'
          })
          .select()
          .maybeSingle()

        if (createProfileError) {
          console.error('Error creating profile:', createProfileError)
          throw new Error(`Failed to create user profile: ${createProfileError.message}`)
        }

        console.log('Profile created successfully:', newProfile)
      } else if (profileCheckError) {
        console.error('Error checking profile:', profileCheckError)
        throw new Error(`Profile check failed: ${profileCheckError.message}`)
      }

      // Now create the job
      console.log('Creating job with data:', {
        ...jobData,
        client_id: userId,
        status: 'open'
      })

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          title: jobData.title,
          description: jobData.description,
          category: jobData.category,
          min_budget: jobData.min_budget,
          max_budget: jobData.max_budget,
          budget: jobData.budget,
          client_id: userId,
          status: 'open'
        })
        .select()
        .maybeSingle()

      if (error) {
        console.error('Error creating job:', error)
        throw new Error(`Failed to create job: ${error.message}`)
      }

      console.log('Job created successfully:', data)

      return {
        success: true,
        job: data
      }
    } catch (error) {
      console.error('Create job error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create job'
      }
    }
  }

  // Alternative method: Create job with direct auth check
  static async createJobDirect(jobData: {
    title: string
    description: string
    category: string
    min_budget: number
    max_budget: number
    budget: number
  }) {
    try {
      // Use the same method as your frontend
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session || !session.user) {
        throw new Error('Authentication required')
      }

      // Insert job directly (let foreign key constraint handle validation)
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          title: jobData.title,
          description: jobData.description,
          min_budget: jobData.min_budget,
          max_budget: jobData.max_budget,
          budget: jobData.budget,
          status: 'open',
          category: jobData.category,
          client_id: session.user.id
        }])
        .select()
        .maybeSingle()

      if (error) {
        // More specific error handling
        if (error.code === '23503') { // Foreign key violation
          throw new Error('User profile not found. Please complete your profile setup.')
        }
        throw error
      }

      return {
        success: true,
        job: data
      }
    } catch (error) {
      console.error('Create job direct error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create job'
      }
    }
  }

  // Get all jobs (unchanged)
  static async getJobs() {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          profiles!jobs_client_id_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        jobs: data
      }
    } catch (error) {
      console.error('Get jobs error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get jobs'
      }
    }
  }

  // Get user's jobs (unchanged)
  static async getUserJobs() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        jobs: data
      }
    } catch (error) {
      console.error('Get user jobs error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user jobs'
      }
    }
  }
}

// Define the user profile type
export type UserProfile = {
  id?: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  // Add any other fields you use
};

// Define the context type
interface UserProfileContextType {
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const UserProfileContext = createContext<UserProfileContextType>({
  profile: null,
  setProfile: () => {},
});

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Fetch the profile on mount
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar, phone')
        .eq('id', user.id)
        .maybeSingle();
      if (profileData) {
        setProfile({
          id: profileData.id,
          avatar: profileData.avatar,
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          email: profileData.email,
          phone: profileData.phone,
        });
      }
    };
    fetchProfile();
  }, []);

  return (
    <UserProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  return useContext(UserProfileContext);
}
