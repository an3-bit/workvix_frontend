import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, User, Globe, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';

const PremiumServices: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
        <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold">SkillForge Premium</h1>
              <p className="text-xl">
                A business solution designed for teams. Connect with top-tier professionals handpicked for quality and service excellence.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span>Verified high-quality professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span>Matched with proven experts in your field</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span>Dedicated success management</span>
                </div>
              </div>
              <Link to="/contact-premium">
                <button className="bg-white text-emerald-800 font-medium py-3 px-6 rounded-md hover:bg-gray-100 transition flex items-center gap-2">
                  Talk to an expert
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/api/placeholder/600/400" 
                alt="Premium Services" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How SkillForge Premium Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-emerald-100 p-4 rounded-full mb-4">
                <User className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Share your needs</h3>
              <p className="text-gray-600">Tell us about your project requirements and business goals.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-emerald-100 p-4 rounded-full mb-4">
                <Star className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Get matched with experts</h3>
              <p className="text-gray-600">We'll connect you with professionals that match your specific needs.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-emerald-100 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Begin working together</h3>
              <p className="text-gray-600">Start collaborating with support from our success managers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured talent */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Premium Talent</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200">
                  <img 
                    src={`/api/placeholder/400/${300 + i * 10}`} 
                    alt={`Featured talent ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Expert Name</h3>
                    <div className="flex items-center text-amber-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-gray-700">4.9</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">Web Development • Mobile Apps • UI/UX Design</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Globe className="h-4 w-4 mr-1" />
                    <span>United States</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/premium-talent">
              <button className="bg-emerald-600 text-white font-medium py-3 px-6 rounded-md hover:bg-emerald-700 transition flex items-center gap-2 mx-auto">
                Browse all premium talent
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Premium Service Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "Software Development",
              "Web Design",
              "Digital Marketing",
              "Content Creation",
              "Business Consulting",
              "Video Production",
              "Brand Strategy",
              "Data Analytics"
            ].map((category, i) => (
              <Link to={`/premium/${category.toLowerCase().replace(/ /g, '-')}`} key={i}>
                <div className="bg-gray-50 hover:bg-emerald-50 rounded-lg p-6 text-center transition border border-gray-100 hover:border-emerald-200 cursor-pointer h-full flex items-center justify-center">
                  <h3 className="text-lg font-medium">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 mr-4">
                    <img 
                      src={`/api/placeholder/100/100`} 
                      alt="Client"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">Client Name</h3>
                    <p className="text-gray-500 text-sm">CEO, Company Name</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "SkillForge Premium connected us with exactly the talent we needed. The process was smooth, and the quality of work exceeded our expectations. We've now built a long-term relationship with our expert."
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-emerald-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to elevate your projects?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Connect with premium talent and take your business to the next level with SkillForge Premium.</p>
          <Link to="/contact-premium">
            <button className="bg-white text-emerald-800 font-medium py-3 px-8 rounded-md hover:bg-gray-100 transition">
              Get started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PremiumServices;