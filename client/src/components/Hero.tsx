import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, Star, Users, Clock, Shield } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

const Hero: React.FC = () => {
  // Animated stats
  const freelancers = useCountUp({ end: 50, duration: 2000, start: 0, loop: true });
  const projects = useCountUp({ end: 10, duration: 2000, start: 0, loop: true });
  const success = useCountUp({ end: 98, duration: 2000, start: 0, loop: true });

  return (
    <section id="hero-section" className="relative min-h-screen flex items-center justify-center bg-transparent overflow-hidden pt-20">
      {/* Background Image */}
      <img 
        src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg" 
        alt="Freelancer working" 
        className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none z-0" 
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 z-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-400 rounded-full opacity-5 filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-400 rounded-full opacity-5 filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-yellow-300 rounded-full opacity-5 filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
      <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
            Find the Perfect{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-orange-400">
              Freelancer
            </span>
            <br />
            for Your Project
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow">
            Connect with talented professionals worldwide. From web development to graphic design, 
            get your projects done quickly and professionally.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-400" />
              <input
                type="text"
                placeholder="What service are you looking for today?"
                className="w-full h-14 pl-12 pr-32 rounded-full border-2 border-gray-200 focus:border-green-500 focus:outline-none text-lg shadow-lg bg-white bg-opacity-90 text-gray-900 placeholder-gray-500"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 rounded-full bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white font-bold shadow-lg">
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/post-job">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                Post a Job
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/join">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full border-2 border-white text-white hover:border-green-300 hover:bg-white hover:bg-opacity-10 transition-all duration-300 font-bold">
                Browse Jobs
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="relative h-28 overflow-hidden max-w-4xl mx-auto mb-12">
            <div className="absolute w-full">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2 drop-shadow">{freelancers}K+</div>
                  <div className="text-sm md:text-base text-green-200">Active Freelancers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-400 mb-2 drop-shadow">{projects}K+</div>
                  <div className="text-sm md:text-base text-orange-200">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2 drop-shadow">{success}%</div>
                  <div className="text-sm md:text-base text-green-200">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-400 mb-2 drop-shadow">24/7</div>
                  <div className="text-sm md:text-base text-orange-200">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Professionals</h3>
              <p className="text-gray-600 text-center text-sm">
                All freelancers are verified and reviewed for quality assurance
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-center text-sm">
                Get your projects completed quickly with our efficient system
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-center text-sm">
                Safe and secure payment system with escrow protection
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-gray-200 border-opacity-30">
            <p className="text-white text-base mb-4 drop-shadow font-semibold">Trusted by thousands of clients worldwide</p>
            <div className="flex flex-wrap justify-center items-center gap-6 opacity-90">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-300 " />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-300 " />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-300 " />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-300 " />
                <span className="text-white ml-2 font-semibold drop-shadow">4.9/5 Rating</span>
              </div>
              <div className="text-white text-opacity-70 font-semibold">•</div>
              <div className="text-white font-semibold drop-shadow">50,000+ Happy Clients</div>
              <div className="text-white text-opacity-70 font-semibold">•</div>
              <div className="text-white font-semibold drop-shadow">24/7 Customer Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
