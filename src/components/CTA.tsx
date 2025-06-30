import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-green-900 via-orange-900 to-yellow-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 lg:mb-6">
              Freelance services at your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400">
                fingertips
              </span>
            </h2>
            <p className="text-gray-200 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              Find the right service for your business, right now. Join thousands of satisfied clients and talented freelancers.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 lg:mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-gray-200 text-sm">Active Freelancers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">4.9★</div>
              <div className="text-gray-200 text-sm">Average Rating</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">100K+</div>
              <div className="text-gray-200 text-sm">Projects Completed</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/join">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white font-medium px-8 py-3 sm:px-10 sm:py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="text-sm sm:text-base">Get Started Today</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/join">
              <Button  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-gray-900 font-medium px-8 py-3 sm:px-10 sm:py-4 rounded-lg transition-all duration-300">
                <span className="text-sm sm:text-base">Browse Services</span>
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 lg:mt-12">
            <p className="text-gray-300 text-xs sm:text-sm mb-4">Trusted by leading companies worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 opacity-60">
              <div className="text-white font-bold text-lg sm:text-xl">Microsoft</div>
              <div className="text-white font-bold text-lg sm:text-xl">Google</div>
              <div className="text-white font-bold text-lg sm:text-xl">Amazon</div>
              <div className="text-white font-bold text-lg sm:text-xl">Netflix</div>
              <div className="text-white font-bold text-lg sm:text-xl">Spotify</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
