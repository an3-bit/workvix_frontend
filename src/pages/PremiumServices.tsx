import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, User, Globe, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const PremiumServices: React.FC = () => {
  const featuredTalents = [
    {
      name: 'Sophia Lee',
      skills: 'Full Stack Development • React • Node.js',
      country: 'Canada',
      rating: 5,
      image: 'https://images.pexels.com/photos/7651804/pexels-photo-7651804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      name: 'Carlos Rodriguez',
      skills: 'UI/UX Design • Figma • Mobile Apps',
      country: 'Spain',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    {
      name: 'Maya Patel',
      skills: 'AI Solutions • Python • Machine Learning',
      country: 'India',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg',
    },
  ];

  const testimonials = [
    {
      name: 'Anna Kim',
      role: 'CTO, TechNova',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      feedback:
        'We partnered with a data expert from workvix Premium and saw instant improvements in our reporting and insights.',
      rating: 5,
    },
    {
      name: 'James Wong',
      role: 'Founder, MarketGenius',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      feedback:
        'workvix is a game-changer for our team. The workvix team was able to deliver a custom solution within a tight deadline, and the results were outstanding.',
      rating: 4.9,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900 overflow-hidden">
        {/* Blurred Circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">workvix <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Premium</span></h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl leading-relaxed">
                A business solution designed for teams. Connect with top-tier professionals handpicked for quality and service excellence.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span>Verified high-quality professionals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span>Matched with proven experts in your field</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span>Dedicated success management</span>
                </div>
              </div>
              <Link to="/contact-premium">
                <button className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                  Talk to an expert
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://media.istockphoto.com/id/1364946137/photo/businessman-holding-and-showing-the-best-quality-assurance-with-golden-five-stars-for.webp?s=1024x1024&w=is&k=20&c=rJB9kZhjd4M6T8YYBoCRfN9AeI2gkkqKGZXPYgRTqK0="
                alt="Premium Services"
                loading="lazy"
                className="rounded-lg shadow-lg object-cover w-full h-full max-h-[400px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Talent */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Premium Talent</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTalents.map((talent, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48">
                  <img
                    src={talent.image}
                    alt={talent.name}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{talent.name}</h3>
                    <div className="flex items-center text-amber-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-gray-700">{talent.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{talent.skills}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Globe className="h-4 w-4 mr-1" />
                    <span>{talent.country}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((client, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-4">
                    <img
                      src={client.image}
                      alt={client.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{client.name}</h3>
                    <p className="text-gray-500 text-sm">{client.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic mb-3">"{client.feedback}"</p>
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: Math.floor(client.rating) }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        {/* Blurred Circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Ready to elevate your projects?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with premium talent and take your business to the next level with workvix Premium.
          </p>
          <Link to="/contact-premium">
            <button className="h-14 px-8 text-lg rounded-full bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300">
              Get started
            </button>
          </Link>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PremiumServices;
