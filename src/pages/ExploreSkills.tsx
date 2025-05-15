import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, TrendingUp, Star, Award, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Category {
  name: string;
  subcategories: string[];
}

const ExploreSkills: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories: Category[] = [
    {
      name: "Development & IT",
      subcategories: ["Web Development", "Mobile Development", "Game Development", "Database Design", "QA & Testing"]
    },
    {
      name: "Design & Creative",
      subcategories: ["Graphics & Design", "Logo Design", "Web Design", "UX/UI Design", "Video Editing"]
    },
    {
      name: "Digital Marketing",
      subcategories: ["Social Media", "SEO", "Content Marketing", "Email Marketing", "PPC"]
    },
    {
      name: "Writing & Translation",
      subcategories: ["Articles & Blog Posts", "Translation", "Technical Writing", "Copywriting", "Proofreading"]
    },
    {
      name: "Business & Finance",
      subcategories: ["Business Plans", "Financial Analysis", "Legal Consulting", "Market Research", "Project Management"]
    },
  ];

  const toggleCategory = (categoryName: string) => {
    if (activeCategory === categoryName) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryName);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
        <Navbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Explore Skills</h1>
            <p className="text-xl mb-8">
              Discover the perfect skill or service for your project needs
            </p>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search for any skill or service..."
                className="w-full py-3 px-6 pr-12 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-600">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto py-4 scrollbar-hide">
            {categories.map((category) => (
              <div key={category.name} className="flex-shrink-0 mr-6 relative">
                <button
                  onClick={() => toggleCategory(category.name)}
                  className={`flex items-center whitespace-nowrap font-medium hover:text-emerald-600 ${
                    activeCategory === category.name ? 'text-emerald-600' : 'text-gray-700'
                  }`}
                >
                  {category.name}
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                    activeCategory === category.name ? 'rotate-180' : ''
                  }`} />
                </button>
                
                {activeCategory === category.name && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-20">
                    {category.subcategories.map((subcat) => (
                      <Link 
                        key={subcat} 
                        to={`/services/${category.name.toLowerCase().replace(/ /g, '-')}/${subcat.toLowerCase().replace(/ /g, '-')}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                      >
                        {subcat}
                      </Link>
                    ))}
                    <Link 
                      to={`/services/${category.name.toLowerCase().replace(/ /g, '-')}`}
                      className="block px-4 py-2 text-emerald-600 font-medium border-t border-gray-100 mt-1"
                    >
                      View all in {category.name}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending skills */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Trending Skills</h2>
            <Link to="/trending" className="text-emerald-600 hover:text-emerald-700 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                <div className="bg-white hover:shadow-md rounded-lg p-4 border border-gray-200 transition">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-full bg-emerald-100 mr-3">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="text-sm text-emerald-600 font-medium">Trending</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={`/api/placeholder/400/${280 + i * 5}`} 
                    alt={`Service ${i}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-xs font-medium">
                    Top Rated
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 mr-2">
                      <img 
                        src="/api/placeholder/100/100" 
                        alt="Provider" 
                        className="w-full h-full rounded-full"
                      />
                    </div>
                    <span className="text-sm font-medium">Provider Name</span>
                    <div className="ml-auto flex items-center text-amber-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-xs text-gray-600">4.9 (120)</span>
                    </div>
                  </div>
                  <Link to={`/service/${i}`}>
                    <h3 className="font-medium mb-2 group-hover:text-emerald-600 transition">I will create a professional website for your business</h3>
                  </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Skills by Industry</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Technology",
              "E-commerce",
              "Education",
              "Health & Wellness",
              "Finance",
              "Real Estate",
              "Entertainment",
              "Travel & Hospitality"
            ].map((industry, i) => (
              <Link to={`/industry/${industry.toLowerCase().replace(/ /g, '-')}`} key={i}>
                <div className="bg-gray-50 hover:bg-emerald-50 rounded-lg p-6 text-center transition border border-gray-100 hover:border-emerald-200 h-32 flex items-center justify-center">
                  <h3 className="font-medium">{industry}</h3>
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