import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Types for registration
export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  userType: 'client' | 'freelancer'
  hourlyRate?: number // for freelancers
}

export interface LoginData {
  email: string
  password: string
}

// Authentication service
export class AuthService {
  // Register a new user
  static async register(data: RegisterData) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone || null,
            user_type: data.userType,
            hourly_rate: data.hourlyRate || null
          }
        }
      })

      if (authError) {
        throw new Error(authError.message)
      }

      return {
        success: true,
        user: authData.user,
        message: 'Registration successful! Please check your email to verify your account.'
      }
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      }
    }
  }

  // Login user
  static async login(data: LoginData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) {
        throw new Error(error.message)
      }

      return {
        success: true,
        user: authData.user,
        session: authData.session
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }
    }
  }

  // Logout user
  static async logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      }
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      
      return {
        success: true,
        user
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user'
      }
    }
  }

  // Add role to existing user (client or freelancer)
  static async addUserRole(role: 'client' | 'freelancer') {
    try {
      const { data, error } = await supabase.rpc('add_user_role', {
        user_role: role
      })

      if (error) throw error

      return data
    } catch (error) {
      console.error('Add role error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add role'
      }
    }
  }

  // Get user profile with roles
  static async getUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      // Check if user is a client
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('id', user.id)
        .single()

      // Check if user is a freelancer
      const { data: freelancerData } = await supabase
        .from('freelancers')
        .select('*')
        .eq('id', user.id)
        .single()

      return {
        success: true,
        profile,
        isClient: !!clientData,
        isFreelancer: !!freelancerData,
        clientData,
        freelancerData
      }
    } catch (error) {
      console.error('Get profile error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get profile'
      }
    }
  }
}

// Updated Job service to match frontend data structure
export class JobService {
  // Create a new job (aligned with frontend form data)
  static async createJob(jobData: {
    title: string
    description: string
    category: string
    min_budget: number
    max_budget: number
    budget: number // calculated average from frontend
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User must be authenticated to post a job')
      }

      const { data, error } = await supabase
        .from('jobs')
        .insert({
          title: jobData.title,
          description: jobData.description,
          category: jobData.category,
          min_budget: jobData.min_budget,
          max_budget: jobData.max_budget,
          budget: jobData.budget,
          client_id: user.id,
          status: 'open'
        })
        .select()
        .single()

      if (error) throw error

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

  // Get all jobs
  static async getJobs() {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          clients (
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

  // Get user's jobs
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

// Bid service
export class BidService {
  // Create a bid (freelancers only)
  static async createBid(bidData: {
    jobId: string
    amount: number
    deliveryTime: string
    message: string
  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User must be authenticated to place a bid')
      }

      // Check if user is a freelancer
      const { data: freelancer } = await supabase
        .from('freelancers')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!freelancer) {
        throw new Error('Only freelancers can place bids')
      }

      const { data, error } = await supabase
        .from('bids')
        .insert({
          job_id: bidData.jobId,
          freelancer_id: user.id,
          amount: bidData.amount,
          delivery_time: bidData.deliveryTime,
          message: bidData.message,
          status: 'pending'
        })
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        bid: data
      }
    } catch (error) {
      console.error('Create bid error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create bid'
      }
    }
  }

  // Get bids for a job
  static async getJobBids(jobId: string) {
    try {
      const { data, error } = await supabase
        .from('bids')
        .select(`
          *,
          freelancers (
            first_name,
            last_name,
            email,
            bio,
            skills,
            hourly_rate
          )
        `)
        .eq('job_id', jobId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        bids: data
      }
    } catch (error) {
      console.error('Get job bids error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get bids'
      }
    }
  }
}