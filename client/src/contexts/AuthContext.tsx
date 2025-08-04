import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User, AuthResponse } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (userData: { name: string; email: string; password: string; role: 'client' | 'freelancer' }) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

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
      if (token) {
        const currentUser = await api.auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Token is invalid, remove it
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
      const response = await api.auth.login({ email, password });
      if (response.success && response.data) {
        setUser({
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role as 'client' | 'freelancer' | 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      return response;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signUp = async (userData: { 
    name: string; 
    email: string; 
    password: string; 
    role: 'client' | 'freelancer' 
  }): Promise<AuthResponse> => {
    try {
      const response = await api.auth.register(userData);
      if (response.success && response.data) {
        setUser({
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          role: response.data.role as 'client' | 'freelancer' | 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      return response;
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await api.auth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
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