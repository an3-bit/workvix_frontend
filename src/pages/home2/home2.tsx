import React from 'react';
import { Search, Star,  Heart, Play, Bookmark, Mail, Bell} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
 const recommendedServices = [
  {
    id: 1,
    title: "I will be a wordpress website developer and responsive",
    seller: "Susana D",
    level: "Level 2",
    rating: 4.9,
    reviews: 34,
    price: 60,
    image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
    tag: "RESPONSIVE WEBSITES"
  },
  {
    id: 2,
    title: "I will be your virtual assistant for data entry, data mining, copy...",
    seller: "Sabina Asheer",
    level: "Level 2",
    rating: 4.8,
    reviews: 761,
    price: 20,
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    tag: "Virtual Assistant"
  },
  {
    id: 3,
    title: "I will build wordpress website development, design, redesign...",
    seller: "Lumen",
    level: "Level 1",
    rating: 4.9,
    reviews: 200,
    price: 100,
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
    tag: "SERIOUS PROFESSIONAL"
  },
  {
    id: 4,
    title: "I will be your virtual assistant for data entry typing and...",
    seller: "Habiba",
    level: "",
    rating: 4.9,
    reviews: 362,
    price: 30,
    image: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg",
    tag: "PRO"
  }
];

const inspirationCategories = [
  {
    title: "Architecture & Interior Design",
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
    category: "Design"
  },
  {
    title: "Illustration",
    image: "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg",
    category: "Art"
  },
  {
    title: "Business Cards & Stationery",
    image: "https://images.pexels.com/photos/8490095/pexels-photo-8490095.jpeg",
    category: "Design"
  },
  {
    title: "Children's Book Illustration",
    image: "https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg",
    category: "Illustration"
  },
  {
    title: "Album Cover Design",
    image: "https://images.pexels.com/photos/164695/pexels-photo-164695.jpeg",
    category: "Design"
  },
  {
    title: "Packaging & Label Design",
    image: "https://images.pexels.com/photos/2608496/pexels-photo-2608496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "Design"
  }
];


  const quickActions = [
    { icon: "🎯", title: "Keep browsing", desc: "Continue exploring services" },
    { icon: "📊", title: "Data Entry", desc: "Professional data entry services" },
    { icon: "📋", title: "Copy Paste", desc: "Quick copy paste tasks" },
    { icon: "⌨️", title: "Data Typing", desc: "Fast and accurate typing" }
  ];
  const Navbar = () => {
    return (
      <div className="border-b shadow-sm bg-white">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-gray-900">
               <span className="text-2xl font-bold text-skillforge-primary">work<span className="text-orange-500 text-workvix-primary">vix</span></span>
            </Link>
          </div>
          
          {/* Search bar */}
          <div className="hidden lg:flex flex-1 mx-8">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                placeholder="What service are you looking for today?"
                className="w-full border border-gray-300 rounded pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
              />
              <button className="absolute right-0 top-0 h-full bg-gray-900 text-white px-4 rounded-r">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Link to="/upgrade" className="text-sm font-medium hidden md:block">
              Upgrade to Pro
            </Link>
            <Link to="/orders" className="text-sm font-medium hidden md:block">
              Orders
            </Link>
            <Link to="/pro" className="text-sm font-medium hidden md:block">
              Try Skillforge Go
            </Link>
            
            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button className="relative">
                <Bell className="h-5 w-5 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
              </button>
              <button className="relative">
                <Mail className="h-5 w-5 text-gray-700" />
              </button>
              <button>
                <Heart className="h-5 w-5 text-gray-700" />
              </button>
              <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center text-white">
                T
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      
      <Navbar />

   {/* Hero Section - WorkVix Go */}
<section
  className="bg-cover bg-center py-20 relative"
  style={{
    backgroundImage: "url('https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260')",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/20 z-0"></div>

  {/* Content */}
  <div className="container mx-auto px-4 relative z-10 text-white">
    <div className="flex flex-col lg:flex-row items-start justify-between">
      {/* Left Content */}
      <div className="max-w-2xl mb-10">
        <h2 className="text-4xl font-bold mb-4">Meet WorkVix Go</h2>
        <p className="text-lg opacity-90 mb-8">
          Choose a freelancer's personal AI model and instantly generate work in their distinct style.
        </p>
        {/* Feature Cards */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Card 1 */}
          <div className="bg-white text-black rounded-xl p-6 shadow-md w-full lg:w-80">
            <p className="text-xs text-gray-500 font-semibold mb-2">RECOMMENDED FOR YOU</p>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📝</div>
              <div>
                <h3 className="font-bold mb-1">Post a project brief</h3>
                <p className="text-sm text-gray-600">Get tailored offers for your needs.</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white text-black rounded-xl p-6 shadow-md w-full lg:w-80">
            <p className="text-xs text-gray-500 font-semibold mb-2">RECOMMENDED FOR YOU</p>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">📱</div>
              <div>
                <h3 className="font-bold mb-1">Download the WorkVix app</h3>
                <p className="text-sm text-gray-600">Stay productive, anywhere you go.</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white text-black rounded-xl p-6 shadow-md w-full lg:w-80">
            <p className="text-xs text-gray-500 font-semibold mb-2">PROFILE PROGRESS</p>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">👤</div>
              <div>
                <h3 className="font-bold mb-1">You’ve added 35% of your profile</h3>
                <p className="text-sm text-gray-600">Complete it to get tailored suggestions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="self-start">
        <button className="bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-full font-semibold shadow-md">
          Start generating →
        </button>
      </div>
    </div>
  </div>
</section>



      {/* Quick Actions */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h3 className="text-lg font-semibold mb-6">Based on what you might be looking for</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <span className="text-2xl">{action.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Services */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
            <div className="text-sm text-gray-600">PEOPLE'S FAVORITES</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedServices.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {service.tag}
                    </span>
                  </div>
                  <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.seller}</p>
                      {service.level && (
                        <p className="text-xs text-gray-600">{service.level}</p>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-sm text-gray-800 mb-3 line-clamp-2 leading-tight">
                    {service.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                      <span className="text-sm text-gray-600">({service.reviews})</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">From</p>
                      <p className="text-lg font-bold text-gray-900">${service.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Gallery */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Get inspired by work done on WorkVix</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspirationCategories.map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity"></div>
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Bookmark className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="mt-3">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Categories */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-600">Graphics & Design</a></li>
                <li><a href="#" className="hover:text-green-600">Digital Marketing</a></li>
                <li><a href="#" className="hover:text-green-600">Writing & Translation</a></li>
                <li><a href="#" className="hover:text-green-600">Video & Animation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">For Clients</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-600">How WorkVix Works</a></li>
                <li><a href="#" className="hover:text-green-600">Customer Success Stories</a></li>
                <li><a href="#" className="hover:text-green-600">Trust & Safety</a></li>
                <li><a href="#" className="hover:text-green-600">Quality Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">For Freelancers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-600">Become a WorkVix Freelancer</a></li>
                <li><a href="#" className="hover:text-green-600">Become an Agency</a></li>
                <li><a href="#" className="hover:text-green-600">Freelancer Events</a></li>
                <li><a href="#" className="hover:text-green-600">Community Hub</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Business Solutions</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-green-600">WorkVix Pro</a></li>
                <li><a href="#" className="hover:text-green-600">Project Management Service</a></li>
                <li><a href="#" className="hover:text-green-600">ClearVoice Content Marketing</a></li>
                <li><a href="#" className="hover:text-green-600">Working Not Working</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <span className="text-2xl font-bold text-skillforge-primary">work<span className="text-orange-500 text-workvix-primary">vix</span></span>
              <span className="text-sm text-gray-600">© WorkVix International Ltd. 2025</span>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Facebook</span>
                📘
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">Twitter</span>
                🐦
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">LinkedIn</span>
                💼
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;