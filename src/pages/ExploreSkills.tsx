import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, TrendingUp, Star, Award, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Category {
  name: string;
  subcategories: string[];
}

const ExploreSkills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  
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
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-6xl font-bold text-gray-900 leading-tight mb-6">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Skills</span>
            </h1>
            <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover the perfect skill or service for your project needs
            </p>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search for any skill or service..."
                className="w-full py-3 px-6 pr-12 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg shadow-lg"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      

      {/* Trending skills */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Trending Skills</h2>
            <Link to="/trending" className="text-blue-600 hover:text-purple-600 flex items-center font-medium">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {[
              "AI & Machine Learning",
              "AR/VR Development",
              "Video Animation",
              "Content Writing",
              "Social Media Management",
              "WordPress Development",
              "Data Visualization",
              "E-commerce Development"
            ].map((skill, i) => (
              <Link to={`/services/${skill.toLowerCase().replace(/ /g, '-')}`} key={i}>
                <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 hover:shadow-md rounded-lg p-4 border border-gray-200 transition">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-full bg-blue-100 mr-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm text-blue-600 font-medium">Trending</span>
                  </div>
                  <h3 className="font-medium">{skill}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Services */}
      
<div className="bg-white py-12">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl font-bold mb-8">Featured Services</h2>
    <div className="grid grid-cols-3 gap-6">
      {[
        { id: 1, img: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg', provider: 'Alice' ,description: 'I am a highly skilled graphic designer with over 5 years of experience.', } , 
        { id: 2, img: 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg', provider: 'Bob', description: 'I specialize in creating engaging and user-friendly websites.' },
        { id: 3, img: 'https://images.pexels.com/photos/210241/pexels-photo-210241.jpeg', provider: 'Charlie', description: 'I have experience in web development and design.'},
        { id: 4, img: 'https://images.pexels.com/photos/4395962/pexels-photo-4395962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', provider: 'Diana', description: 'I am a professional photographer with a passion for capturing moments.' },
        { id: 5, img: 'https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg', provider: 'Eve', description: 'I am a digital marketer with expertise in SEO and social media marketing.' },
        { id: 6, img: 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg', provider: 'Frank', description: 'I am a content writer with a knack for storytelling.' },
      ].map(({ id, img, provider, description }) => (
        <div key={id} className="group rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition">
          <div className="h-48 bg-gray-200 relative">
            <img 
              src={`${img}?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`}
              alt={`Service ${id}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-xs font-medium">
              Top Rated
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center mb-2 text-black-600 text-bold">
              
                
              
              <span className="text-sm font-medium">{provider}</span>
              <div className="ml-auto flex items-center text-amber-400">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-xs text-gray-600">4.9 (120)</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              {description}
            </p>
            <div className="flex items-center mb-2">
              <div className="flex items-center text-xs text-gray-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                <span>Unlimited revisions</span>
              </div>
              <div className="text-emerald-600 font-medium ml-auto">From $50</div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                <span>Delivery in 3 days</span>
              </div>
              <div className="text-emerald-600 font-medium">From $120</div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="text-center mt-8">
      <Link to="/services">
        <button className="bg-emerald-600 text-white font-medium py-2 px-6 rounded-md hover:bg-emerald-700 transition">
          Explore all services
        </button>
      </Link>
    </div>
  </div>
</div>

     

      {/* Service By Level */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Services By Level</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-12 w-12 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Basic</h3>
                <p className="text-gray-600 text-center mb-4">
                  Affordable options for simple projects and quick deliveries
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Quick turnarounds</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Essential deliverables</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Best for small projects</span>
                  </li>
                </ul>
                <Link to="/services/basic" className="block text-center text-emerald-600 hover:text-emerald-700 font-medium">
                  Browse Basic Services
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition relative">
              <div className="absolute top-0 inset-x-0 bg-emerald-600 text-white text-center text-sm py-1 font-medium">
                Most Popular
              </div>
              <div className="p-6 pt-8">
                <div className="flex items-center justify-center mb-4">
                  <Award className="h-12 w-12 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Standard</h3>
                <p className="text-gray-600 text-center mb-4">
                  Professional quality with additional features and revisions
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>All Basic features</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Higher quality outputs</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>More revisions included</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Faster delivery options</span>
                  </li>
                </ul>
                <Link to="/services/standard" className="block text-center text-emerald-600 hover:text-emerald-700 font-medium">
                  Browse Standard Services
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <Trophy className="h-12 w-12 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Premium</h3>
                <p className="text-gray-600 text-center mb-4">
                  Complete solutions with priority support and premium extras
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>All Standard features</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Premium deliverables</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Source files included</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    <span>Commercial rights</span>
                  </li>
                </ul>
                <Link to="/services/premium" className="block text-center text-emerald-600 hover:text-emerald-700 font-medium">
                  Browse Premium Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Skills by Industry */}
   {/* Skills by Industry */}
<div className="bg-white py-12">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl font-bold mb-8">Skills by Industry</h2>
    <div className="grid grid-cols-4 gap-4">
      {[
        {
          name: "Technology",
          image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
        },
        {
          name: "E-commerce",
          image: "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg",
        },
        {
          name: "Education",
          image: "https://images.pexels.com/photos/5212334/pexels-photo-5212334.jpeg",
        },
        {
          name: "Health & Wellness",
          image: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg",
        },
        {
          name: "Finance",
          image: "https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg",
        },
        {
          name: "Real Estate",
          image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
        },
        {
          name: "Entertainment",
          image: "https://images.pexels.com/photos/7991371/pexels-photo-7991371.jpeg",
        },
        {
          name: "Travel & Hospitality",
          image: "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
        },
        
      ].map((industry, i) => (
        <Link
          to={`/industry/${industry.name.toLowerCase().replace(/ /g, '-')}`}
          key={i}
        >
          <div className="relative  hover:bg-emerald-50 rounded-lg p-6 text-center transition border border-gray-100 hover:border-emerald-200 h-32 flex items-center justify-center overflow-hidden">
            <img
              src={industry.image}
              alt={industry.name}
              className="absolute inset-0 w-full h-full object-cover  z-0"
            />
            <h3 className="font-bold z-10 text-white z-10 text-lg leading-tight">{industry.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  </div>
</div>


      {/* CTA */}
      <div className="bg-emerald-700 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to find the perfect skill for your project?</h2>
          <p className="mb-6 max-w-2xl mx-auto">Join thousands of satisfied clients who have found the right expert for their needs</p>
          <Link to="/signup">
            <button className="bg-white text-emerald-700 font-medium py-2 px-6 rounded-md hover:bg-gray-100 transition">
              Get Started
            </button>
          </Link>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

// Missing components declaration
const CheckCircle = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const Clock = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const Trophy = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
);

export default ExploreSkills;