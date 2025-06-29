import { useState, useEffect, useRef } from 'react';
import { Brush, Code, Megaphone, FileText, Video, Image, Music, Package, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    name: "Graphics & Design",
    icon: Brush,
    color: "bg-emerald-100",
    textColor: "text-emerald-700",
    hoverColor: "hover:bg-emerald-50",
    href: "/jobs?category=Graphics%20%26%20Design"
  },
  {
    name: "Web Development",
    icon: Code,
    color: "bg-blue-100",
    textColor: "text-blue-700",
    hoverColor: "hover:bg-blue-50",
    href: "/jobs?category=Web%20Development"
  },
  {
    name: "Digital Marketing",
    icon: Megaphone,
    color: "bg-orange-100",
    textColor: "text-orange-700",
    hoverColor: "hover:bg-orange-50",
    href: "/jobs?category=Digital%20Marketing"
  },
  {
    name: "Writing & Translation",
    icon: FileText,
    color: "bg-purple-100",
    textColor: "text-purple-700",
    hoverColor: "hover:bg-purple-50",
    href: "/jobs?category=Writing%20%26%20Translation"
  },
  {
    name: "Video & Animation",
    icon: Video,
    color: "bg-red-100",
    textColor: "text-red-700",
    hoverColor: "hover:bg-red-50",
    href: "/jobs?category=Video%20%26%20Animation"
  },
  {
    name: "Photography",
    icon: Image,
    color: "bg-indigo-100",
    textColor: "text-indigo-700",
    hoverColor: "hover:bg-indigo-50",
    href: "/jobs?category=Photography"
  },
  {
    name: "Music & Audio",
    icon: Music,
    color: "bg-pink-100",
    textColor: "text-pink-700",
    hoverColor: "hover:bg-pink-50",
    href: "/jobs?category=Music%20%26%20Audio"
  },
  {
    name: "Programming & Tech",
    icon: Code,
    color: "bg-green-100",
    textColor: "text-green-700",
    hoverColor: "hover:bg-green-50",
    href: "/jobs?category=Programming%20%26%20Tech"
  },
  {
    name: "Business",
    icon: Package,
    color: "bg-gray-100",
    textColor: "text-gray-700",
    hoverColor: "hover:bg-gray-50",
    href: "/jobs?category=Business"
  },
  {
    name: "Lifestyle",
    icon: Globe,
    color: "bg-yellow-100",
    textColor: "text-yellow-700",
    hoverColor: "hover:bg-yellow-50",
    href: "/jobs?category=Lifestyle"
  }
];

const Categories = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add class for styling and identification
    if (categoriesRef.current) {
      categoriesRef.current.classList.add('categories-section');
    }
    
    return () => {
      // Clean up on unmount
      if (categoriesRef.current) {
        categoriesRef.current.classList.remove('categories-section');
      }
    };
  }, []);
  
  return (
    <section ref={categoriesRef} id="categories-section" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Popular Services
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
            Discover the most in-demand services from our talented freelancers
          </p>
        </div>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <Link 
              key={category.name}
              to={category.href}
              className="group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`
                category-card bg-white rounded-xl p-4 sm:p-6 
                shadow-sm hover:shadow-lg transition-all duration-300 
                border border-gray-100 hover:border-gray-200
                transform hover:-translate-y-1
                ${category.hoverColor}
              `}>
                <div className={`
                  w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 
                  rounded-full ${category.color} 
                  flex items-center justify-center mb-3 sm:mb-4
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <category.icon 
                    className={`category-icon h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 ${category.textColor}`}
                  />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg mb-2 group-hover:text-gray-700 transition-colors">
                  {category.name}
                </h3>
                <div className="flex items-center text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                  <span>Explore</span>
                  <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12 lg:mt-16">
          <Link 
            to="/explore-skills"
            className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 
                     bg-gradient-to-r from-blue-600 to-purple-600 
                     hover:from-blue-700 hover:to-purple-700 
                     text-white font-medium rounded-lg 
                     transition-all duration-300 transform hover:scale-105
                     shadow-lg hover:shadow-xl"
          >
            <span className="text-sm sm:text-base">View All Categories</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
