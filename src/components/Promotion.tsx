import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Star, Users, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Promotion = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-900 via-orange-900 to-yellow-100 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                Premium Solution
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-orange-400">
                WorkVix
              </span>
              <span className="text-white"> Pro</span>
            </h2>
            
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-6 lg:mb-8 text-gray-200">
              The premium freelance solution for businesses
            </h3>
            
            <p className="text-gray-300 text-base sm:text-lg mb-8 lg:mb-10 max-w-2xl mx-auto lg:mx-0">
              Unlock exclusive access to top-tier talent, dedicated support, and enterprise-grade tools designed to scale your business.
            </p>
            
            {/* Features List */}
            <ul className="space-y-4 mb-8 lg:mb-10">
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-200 text-sm sm:text-base">Exclusive access to top-rated talent</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-200 text-sm sm:text-base">Dedicated account management</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-200 text-sm sm:text-base">Enterprise-grade security and tools</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-200 text-sm sm:text-base">Consolidated billing and reporting</span>
              </li>
            </ul>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/premium-services">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white font-medium px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <span className="text-sm sm:text-base">Learn More</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link to="/become-seller">
                <Button  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-gray-900 font-medium px-8 py-3 rounded-lg transition-all duration-300">
                  <span className="text-sm sm:text-base">Get Started</span>
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Image Section */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80" 
                alt="Business team working" 
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Floating Stats */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold text-lg">Enterprise Solution</div>
                      <div className="text-gray-200 text-sm">Tailored for your business needs</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-green-400" />
                      <Shield className="h-5 w-5 text-green-400" />
                      <Zap className="h-5 w-5 text-yellow-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-600 to-orange-500 text-white p-4 rounded-xl shadow-lg transform rotate-3">
              <div className="text-center">
                <div className="font-bold text-lg">Pro</div>
                <div className="text-xs opacity-90">Premium</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Promotion;
