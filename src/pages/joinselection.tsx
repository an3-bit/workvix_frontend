import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const JoinSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<"client" | "freelancer" | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      navigate(`/join/${selectedRole}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-2xl">
                  Join as a client or freelancer
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Client Option */}
                  <div 
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === 'client' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedRole('client')}
                  >
                    <div className="text-center">
                      <h3 className="font-medium text-lg mb-2">I'm a client</h3>
                      <p className="text-gray-600">Hiring for a project</p>
                    </div>
                  </div>
                  
                  {/* Freelancer Option */}
                  <div 
                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRole === 'freelancer' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedRole('freelancer')}
                  >
                    <div className="text-center">
                      <h3 className="font-medium text-lg mb-2">I'm a freelancer</h3>
                      <p className="text-gray-600">Looking for work</p>
                    </div>
                  </div>
                </div>
                
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleContinue}
                  disabled={!selectedRole}
                >
                  Continue
                </Button>
                
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <a 
                    href="/signin" 
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Log In
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default JoinSelection;