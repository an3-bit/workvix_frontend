
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Briefcase } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const JoinSelection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
          <div className="container px-4 mx-auto sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Join Workvix
                </h1>
                <p className="text-xl text-gray-600">
                  Choose how you want to get started
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Client Registration Card */}
                <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">I'm a Client</CardTitle>
                    <p className="text-gray-600">Looking to hire skilled freelancers</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3 text-gray-700 mb-6">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Post jobs and projects
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Browse talented freelancers
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Manage projects easily
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Secure payment system
                      </li>
                    </ul>
                    <Link to="/join/client" className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Join as Client
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Freelancer Registration Card */}
                <Card className="border-2 border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl text-gray-900">I'm a Freelancer</CardTitle>
                    <p className="text-gray-600">Ready to showcase my skills and find work</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3 text-gray-700 mb-6">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        Find exciting projects
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        Build your portfolio
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        Set your own rates
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                        Get paid securely
                      </li>
                    </ul>
                    <Link to="/join/freelancer" className="block">
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        Join as Freelancer
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-8">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JoinSelection;
