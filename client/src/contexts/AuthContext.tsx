import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Define basic types for User and AuthResponse based on your backend's expected response structure
interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'freelancer' | 'admin' | 'affiliate_marketer'; // Include affiliate_marketer
  created_at: string;
  updated_at: string;
  // Add any other user properties returned by your backend
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (userData: { name: string; email: string; password: string; role: 'client' | 'freelancer' }) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Assuming your backend is running on http://localhost:5000
const API_BASE_URL = 'http://localhost:5000';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/current-user`, {
        method: 'GET', // Or 'POST' depending on your backend
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      /* OLD CODE:
        const currentUser = await api.auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('authToken');
        }
      */

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUser(data.data); // Assuming backend returns user object directly in data.data
        } else {
          // Token might be invalid or expired on the backend
          console.error('Failed to fetch current user:', data.message || 'Unknown error');
          localStorage.removeItem('authToken');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (response.ok && data.success && data.data) {
        // Assuming your backend returns tokens in data
        localStorage.setItem('authToken', data.data.token);
        // You might also want to store refreshToken if your backend provides it
        // localStorage.setItem('refreshToken', data.data.refreshToken);
        setUser({
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          role: data.data.user.role, // Use role from the returned user object
          created_at: data.data.user.created_at, // Use created_at from the returned user object
          updated_at: data.data.user.updated_at, // Use updated_at from the returned user object
        });
      } else {
         // Handle backend-specific errors
        const errorMessage = data.message || 'Sign in failed';
        console.error('Sign in failed:', errorMessage);
        // Depending on your backend response, you might throw an error or return the response data
         throw new Error(errorMessage);
      }
      return response;
    } catch (error: any) {
      console.error('Sign in failed:', error);
      throw new Error(error.message || 'Failed to fetch'); // Re-throw with a generic error if fetch fails
    }
  };

  const signUp = async (userData: { 
    name: string; 
    email: string; 
    password: string;
    phone?: string; // Add optional phone for affiliate marketer
    role: 'client' | 'freelancer' | 'affiliate_marketer'; // Include affiliate_marketer here
  }): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

       const data: AuthResponse = await response.json();

       if (response.ok && data.success && data.data) {
         // Assuming your backend returns tokens and user data upon successful registration and auto-login
         localStorage.setItem('authToken', data.data.token);
         // localStorage.setItem('refreshToken', data.data.refreshToken); // Store refresh token if provided
        setUser({
          id: data.data.user.id,
          email: data.data.user.email,
          name: data.data.user.name,
          role: data.data.user.role,
          created_at: data.data.user.created_at,
          updated_at: data.data.user.updated_at,
        });
       } else {
         // Handle backend-specific errors
         const errorMessage = data.message || 'Sign up failed';
         console.error('Sign up failed:', errorMessage);
         // Depending on your backend response, you might throw an error or return the response data
          throw new Error(errorMessage);
       }
       return data; // Return the full response data from the backend
    } catch (error: any) {
      console.error('Sign up failed:', error);
      throw new Error(error.message || 'Failed to fetch'); // Re-throw with a generic error if fetch fails
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      // Assuming your backend has a logout endpoint that might invalidate tokens
      // If your backend doesn't have a logout endpoint, you can just remove tokens client-side
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST', // Or 'GET' depending on your backend
        headers: {
          // Include authorization header if your logout endpoint requires it
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
       // Always remove tokens client-side on sign out
       localStorage.removeItem('authToken');
       // localStorage.removeItem('refreshToken'); // Remove refresh token if stored
    } catch (error) {
      console.error('Sign out failed:', error);
      // Continue with client-side logout even if backend logout fails
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await api.auth.getCurrentUser();
      /* OLD CODE:
            const currentUser = await api.auth.getCurrentUser();
            if (currentUser) {
              setUser(currentUser);
            }
      */
       const token = localStorage.getItem('authToken');
       if (!token) {
         setUser(null);
         setLoading(false);
         return;
       }

       const response = await fetch(`${API_BASE_URL}/auth/current-user`, {
         method: 'GET', // Or 'POST' depending on your backend
         headers: {
           'Authorization': `Bearer ${token}`,
         },
       });

       if (response.ok) {
         const data = await response.json();
         setUser(data.data); // Assuming backend returns user object directly in data.data
       }
    } catch (error) {
      console.error('Refresh user failed:', error);
      setUser(null);
      localStorage.removeItem('authToken');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 