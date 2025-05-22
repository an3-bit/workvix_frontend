// src/components/layout/Navbar.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, LogIn, UserPlus, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch current user email on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    // Optional: subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const isLoggedIn = Boolean(userEmail);
  const adminEmails = [
    "omwengandrew12@gmail.com",
    "odhiamboandrew512@gmail.com",
  ];
  const isAdmin = userEmail ? adminEmails.includes(userEmail) : false;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("registered");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto sm:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/logo.png"
            alt="SurplusSoko logo"
            className="h-10"
            draggable={false}
            loading="eager"
          />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden space-x-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-soko-green"
          >
            Home
          </Link>
          <Link
            to="/how-it-works"
            className="text-sm font-medium transition-colors hover:text-soko-green"
          >
            How It Works
          </Link>
          <Link
            to="/impact"
            className="text-sm font-medium transition-colors hover:text-soko-green"
          >
            Impact
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium transition-colors hover:text-soko-green"
          >
            About
          </Link>

          {!isLoggedIn && (
            <>
              <Link
                to="/register"
                className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-soko-green"
              >
                <UserPlus className="w-4 h-4" /> Register
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-soko-green"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
            </>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-soko-green"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          )}

          {/* Only admins see Dashboard */}
          {isAdmin && (
            <Link
              to="/dashboard"
              className="text-sm font-medium flex items-center gap-1 transition-colors hover:text-soko-green"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop support button */}
        <div className="hidden md:flex md:items-center md:space-x-3">
          <Link to="/support">
            <Button variant="sokoGreen">Support</Button>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile nav items */}
      {isOpen && (
        <div className="md:hidden border-t">
          <div className="container px-4 py-3 mx-auto sm:px-6">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link
                to="/how-it-works"
                className="text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/impact"
                className="text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                Impact
              </Link>
              <Link
tag to="/about" className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                About
              </Link>

              {!isLoggedIn && (
                <>
                  <Link
                    to="/register"
                    className="text-sm font-medium flex items-center gap-1"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserPlus className="w-4 h-4" /> Register
                  </Link>
                  <Link
                    to="/login"
                    className="text-sm font-medium flex items-center gap-1"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="w-4 h-4" /> Login
                  </Link>
                </>
              )}

              {isLoggedIn && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-sm font-medium flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              )}

              {isAdmin && (
                <Link
                  to="/dashboard"
                  className="text-sm font-medium flex items-center gap-1"
                  onClick={() => setIsOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}

              <Link to="/support" className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                Support
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
