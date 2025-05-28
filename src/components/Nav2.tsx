import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Mail, Heart, ChevronDown, User, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Nav2 = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [userRole, setUserRole] = useState<'client' | 'freelancer' | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user exists in clients table
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .eq('id', user.id)
        .single();

      if (clientData) {
        setUserRole('client');
        return;
      }

      // Check if user exists in freelancers table
      const { data: freelancerData } = await supabase
        .from('freelancers')
        .select('id')
        .eq('id', user.id)
        .single();

      if (freelancerData) {
        setUserRole('freelancer');
      }
    };

    fetchUserRole();

    // Update auth state change listener similarly
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Repeat the same check as above
        const { data: clientData } = await supabase
          .from('clients')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (clientData) {
          setUserRole('client');
          return;
        }

        const { data: freelancerData } = await supabase
          .from('freelancers')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (freelancerData) {
          setUserRole('freelancer');
        }
      } else if (event === 'SIGNED_OUT') {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
    const handleChat = () => {
        navigate("/chat/:chatId");
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    const getUserInitial = () => {
        if (!user) return 'U';
        const email = user.email || '';
        return email.charAt(0).toUpperCase();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isDropdownOpen && !(event.target as Element).closest('.relative')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="border-b shadow-sm bg-white fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                {/* Logo */}
                <div className="flex items-center">
                    <Link to="/dashboard" className="text-2xl font-bold text-gray-900">
                        <span className="text-2xl font-bold text-skillforge-primary">work<span className="text-orange-500 text-workvix-primary">vix</span></span>
                    </Link>
                </div>
                
                {/* Search bar */}
                <div className="hidden lg:flex flex-1 mx-8">
                    <div className="relative w-full max-w-2xl">
                        <input
                            type="text"
                            placeholder="What service are you looking for today?"
                            className="w-full border border-gray-300 rounded pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                        />
                        <button className="absolute right-0 top-0 h-full bg-gray-900 text-white px-4 rounded-r">
                            <Search className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                
                {/* Navigation */}
                <div className="flex items-center space-x-6">
                    {/* Conditional navigation based on user role */}
                    {userRole === 'client' && (
                        <Link to="/bids" className="text-sm font-medium hidden md:block">
                            Bids
                        </Link>
                    )}
                    {userRole === 'freelancer' && (
                        <Link to="/jobs" className="text-sm font-medium hidden md:block">
                            Jobs
                        </Link>
                    )}
                    
                    <Link to="/upgrade" className="text-sm font-medium hidden md:block">
                        Upgrade to Pro
                    </Link>
                    <Link to="/orders" className="text-sm font-medium hidden md:block">
                        Orders
                    </Link>
                    <Link to="/pro" className="text-sm font-medium hidden md:block">
                        Try workvix Go
                    </Link>
                    
                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <button className="relative">
                            <Bell className="h-5 w-5 text-gray-700" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">1</span>
                        </button>
                        <button className="relative" onClick={handleChat}>
                            <Mail className="h-5 w-5 text-gray-700" />
                        </button>
                        
                        <button>
                            <Heart className="h-5 w-5 text-gray-700" />
                        </button>
                        
                        {/* User dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-1 focus:outline-none"
                            >
                                <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white">
                                    {getUserInitial()}
                                </div>
                                <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    {user && (
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                            <p>Signed in as</p>
                                            <p className="font-medium truncate">{user.email}</p>
                                        </div>
                                    )}
                                    <Link
                                        to="/profile"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <User className="h-4 w-4 mr-2" />
                                        Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Nav2;