// API service for communicating with the Node.js backend
// This replaces all Supabase calls

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'freelancer' | 'admin';
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    token: string;
  };
  message?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  client_id: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: string;
  job_id: string;
  freelancer_id: string;
  amount: number;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export interface Chat {
  id: string;
  job_id?: string;
  bid_id?: string;
  participants: string[];
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Order {
  id: string;
  job_id: string;
  bid_id: string;
  client_id: string;
  freelancer_id: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth token
const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Helper function to remove auth token
const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Helper function to make API requests
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        removeAuthToken();
        window.location.href = '/signin';
        throw new Error('Authentication required');
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'client' | 'freelancer';
  }): Promise<AuthResponse> => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Login user
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await apiRequest('/auth/logout', {
      method: 'POST',
    });
    removeAuthToken();
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiRequest('/users/profile');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No token to refresh');
    }

    const response = await apiRequest('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    
    if (response.success && response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<any> => {
    return await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<any> => {
    return await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  },
};

// Jobs API
export const jobsAPI = {
  // Get all jobs
  getAll: async (filters?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<Job[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const response = await apiRequest(`/jobs?${params.toString()}`);
    return response.data || [];
  },

  // Get single job
  getById: async (id: string): Promise<Job> => {
    const response = await apiRequest(`/jobs/${id}`);
    return response.data;
  },

  // Create job
  create: async (jobData: {
    title: string;
    description: string;
    budget: number;
    category: string;
  }): Promise<Job> => {
    const response = await apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    return response.data;
  },

  // Update job
  update: async (id: string, jobData: Partial<Job>): Promise<Job> => {
    const response = await apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
    return response.data;
  },

  // Delete job
  delete: async (id: string): Promise<void> => {
    await apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },
};

// Bids API
export const bidsAPI = {
  // Get all bids
  getAll: async (filters?: {
    job_id?: string;
    freelancer_id?: string;
    status?: string;
  }): Promise<Bid[]> => {
    const params = new URLSearchParams();
    if (filters?.job_id) params.append('job_id', filters.job_id);
    if (filters?.freelancer_id) params.append('freelancer_id', filters.freelancer_id);
    if (filters?.status) params.append('status', filters.status);

    const response = await apiRequest(`/bids?${params.toString()}`);
    return response.data || [];
  },

  // Get single bid
  getById: async (id: string): Promise<Bid> => {
    const response = await apiRequest(`/bids/${id}`);
    return response.data;
  },

  // Create bid
  create: async (bidData: {
    job_id: string;
    amount: number;
    proposal: string;
  }): Promise<Bid> => {
    const response = await apiRequest('/bids', {
      method: 'POST',
      body: JSON.stringify(bidData),
    });
    return response.data;
  },

  // Update bid
  update: async (id: string, bidData: Partial<Bid>): Promise<Bid> => {
    const response = await apiRequest(`/bids/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bidData),
    });
    return response.data;
  },

  // Delete bid
  delete: async (id: string): Promise<void> => {
    await apiRequest(`/bids/${id}`, {
      method: 'DELETE',
    });
  },

  // Accept bid
  accept: async (id: string): Promise<Bid> => {
    const response = await apiRequest(`/bids/${id}/accept`, {
      method: 'PUT',
    });
    return response.data;
  },

  // Reject bid
  reject: async (id: string): Promise<Bid> => {
    const response = await apiRequest(`/bids/${id}/reject`, {
      method: 'PUT',
    });
    return response.data;
  },
};

// Notifications API
export const notificationsAPI = {
  // Get all notifications
  getAll: async (): Promise<Notification[]> => {
    const response = await apiRequest('/notifications');
    return response.data || [];
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiRequest(`/notifications/${id}/read`, {
      method: 'PUT',
    });
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await apiRequest('/notifications/read-all', {
      method: 'PUT',
    });
  },

  // Delete notification
  delete: async (id: string): Promise<void> => {
    await apiRequest(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },
};

// Chat API
export const chatAPI = {
  // Get all chats
  getAll: async (): Promise<Chat[]> => {
    const response = await apiRequest('/chats');
    return response.data || [];
  },

  // Get single chat
  getById: async (id: string): Promise<Chat> => {
    const response = await apiRequest(`/chats/${id}`);
    return response.data;
  },

  // Create chat
  create: async (chatData: {
    job_id?: string;
    bid_id?: string;
    participants: string[];
  }): Promise<Chat> => {
    const response = await apiRequest('/chats', {
      method: 'POST',
      body: JSON.stringify(chatData),
    });
    return response.data;
  },

  // Send message
  sendMessage: async (chatId: string, content: string): Promise<ChatMessage> => {
    const response = await apiRequest(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return response.data;
  },

  // Get chat messages
  getMessages: async (chatId: string): Promise<ChatMessage[]> => {
    const response = await apiRequest(`/chats/${chatId}/messages`);
    return response.data || [];
  },
};

// Orders API
export const ordersAPI = {
  // Get all orders
  getAll: async (filters?: {
    client_id?: string;
    freelancer_id?: string;
    status?: string;
  }): Promise<Order[]> => {
    const params = new URLSearchParams();
    if (filters?.client_id) params.append('client_id', filters.client_id);
    if (filters?.freelancer_id) params.append('freelancer_id', filters.freelancer_id);
    if (filters?.status) params.append('status', filters.status);

    const response = await apiRequest(`/orders?${params.toString()}`);
    return response.data || [];
  },

  // Get single order
  getById: async (id: string): Promise<Order> => {
    const response = await apiRequest(`/orders/${id}`);
    return response.data;
  },

  // Create order
  create: async (orderData: {
    job_id: string;
    bid_id: string;
    amount: number;
  }): Promise<Order> => {
    const response = await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response.data;
  },

  // Update order status
  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await apiRequest('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const response = await apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data;
  },

  // Get user dashboard
  getDashboard: async (): Promise<any> => {
    const response = await apiRequest('/users/dashboard');
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  // Get payment history
  getHistory: async (): Promise<any[]> => {
    const response = await apiRequest('/payments');
    return response.data || [];
  },

  // Process payment
  process: async (paymentData: {
    order_id: string;
    amount: number;
    method: string;
  }): Promise<any> => {
    const response = await apiRequest('/payments/process', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
    return response.data;
  },

  // Get payment details
  getById: async (id: string): Promise<any> => {
    const response = await apiRequest(`/payments/${id}`);
    return response.data;
  },
};

// Blog API (WordPress integration)
export const blogAPI = {
  // Get all blog posts
  getPosts: async (perPage: number = 12, page: number = 1): Promise<any> => {
    const response = await apiRequest(`/blog/posts?per_page=${perPage}&page=${page}`);
    return response;
  },

  // Get single blog post
  getPost: async (slug: string): Promise<any> => {
    const response = await apiRequest(`/blog/posts/${slug}`);
    return response;
  },

  // Get blog categories
  getCategories: async (): Promise<any> => {
    const response = await apiRequest('/blog/categories');
    return response;
  },

  // Search blog posts
  search: async (query: string, perPage: number = 12): Promise<any> => {
    const response = await apiRequest(`/blog/search?q=${encodeURIComponent(query)}&per_page=${perPage}`);
    return response;
  },
};

// Export all APIs
export const api = {
  auth: authAPI,
  jobs: jobsAPI,
  bids: bidsAPI,
  notifications: notificationsAPI,
  chat: chatAPI,
  orders: ordersAPI,
  users: usersAPI,
  payments: paymentsAPI,
  blog: blogAPI,
};

export default api; 