import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Nav2 from "@/components/Nav2";
import Footer from "@/components/Footer";

// Example services from Featured and WorkVixGo
const featuredServices = [
  {
    id: 1,
    title: "Professional Logo Design",
    image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Graphics & Design",
    rating: 4.9,
    reviews: 847,
    price: 120,
    seller: "DesignPro",
    delivery: "3 days"
  },
  {
    id: 2,
    title: "WordPress Website Development",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Web Development",
    rating: 4.8,
    reviews: 605,
    price: 200,
    seller: "WebCraft",
    delivery: "7 days"
  },
  {
    id: 3,
    title: "SEO Website Optimization",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Digital Marketing",
    rating: 4.7,
    reviews: 320,
    price: 150,
    seller: "SEOMaster",
    delivery: "5 days"
  },
  {
    id: 4,
    title: "Professional Content Writing",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Writing & Translation",
    rating: 4.9,
    reviews: 713,
    price: 80,
    seller: "ContentPro",
    delivery: "2 days"
  },
  // Additional 20+ services
  {
    id: 5,
    title: "Mobile App Development",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&h=400&q=80",
    category: "App Development",
    rating: 4.8,
    reviews: 540,
    price: 500,
    seller: "AppGuru",
    delivery: "10 days"
  },
  {
    id: 6,
    title: "E-commerce Store Setup",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&h=400&q=80",
    category: "E-commerce",
    rating: 4.7,
    reviews: 410,
    price: 350,
    seller: "ShopMaster",
    delivery: "8 days"
  },
  {
    id: 7,
    title: "Social Media Marketing",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Marketing",
    rating: 4.9,
    reviews: 620,
    price: 180,
    seller: "SocialBee",
    delivery: "4 days"
  },
  {
    id: 8,
    title: "YouTube Video Editing",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Video Editing",
    rating: 4.8,
    reviews: 390,
    price: 100,
    seller: "EditPro",
    delivery: "3 days"
  },
  {
    id: 9,
    title: "Custom Illustration",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Illustration",
    rating: 4.9,
    reviews: 275,
    price: 90,
    seller: "ArtisticMind",
    delivery: "5 days"
  },
  {
    id: 10,
    title: "Business Card Design",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Graphics & Design",
    rating: 4.7,
    reviews: 320,
    price: 40,
    seller: "CardCrafter",
    delivery: "2 days"
  },
  {
    id: 11,
    title: "Voice Over Services",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Audio",
    rating: 4.8,
    reviews: 210,
    price: 60,
    seller: "VoicePro",
    delivery: "1 day"
  },
  {
    id: 12,
    title: "Resume & Cover Letter Writing",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
    category: "Writing & Translation",
    rating: 4.9,
    reviews: 180,
    price: 70,
    seller: "CareerBoost",
    delivery: "2 days"
  },
  {
    id: 13,
    title: "Translation Services",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Translation",
    rating: 4.8,
    reviews: 150,
    price: 50,
    seller: "LingoStar",
    delivery: "2 days"
  },
  {
    id: 14,
    title: "Data Analysis & Visualization",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Data Science",
    rating: 4.7,
    reviews: 130,
    price: 220,
    seller: "DataWiz",
    delivery: "6 days"
  },
  {
    id: 15,
    title: "Custom WordPress Plugin",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Web Development",
    rating: 4.8,
    reviews: 110,
    price: 300,
    seller: "PluginSmith",
    delivery: "9 days"
  },
  {
    id: 16,
    title: "Product Photography",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Photography",
    rating: 4.9,
    reviews: 95,
    price: 250,
    seller: "PhotoPro",
    delivery: "7 days"
  },
  {
    id: 17,
    title: "UI/UX Design Audit",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&h=400&q=80",
    category: "UI/UX",
    rating: 4.8,
    reviews: 85,
    price: 130,
    seller: "UXExpert",
    delivery: "3 days"
  },
  {
    id: 18,
    title: "Online Store Management",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&h=400&q=80",
    category: "E-commerce",
    rating: 4.7,
    reviews: 75,
    price: 160,
    seller: "StoreManager",
    delivery: "5 days"
  },
  {
    id: 19,
    title: "Podcast Editing",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Audio",
    rating: 4.8,
    reviews: 65,
    price: 90,
    seller: "PodEdit",
    delivery: "2 days"
  },
  {
    id: 20,
    title: "Logo Animation",
    image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Animation",
    rating: 4.9,
    reviews: 55,
    price: 120,
    seller: "Animotion",
    delivery: "4 days"
  },
  {
    id: 21,
    title: "Email Marketing Campaign",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Marketing",
    rating: 4.7,
    reviews: 45,
    price: 110,
    seller: "MailPro",
    delivery: "3 days"
  },
  {
    id: 22,
    title: "Custom Infographic Design",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Graphics & Design",
    rating: 4.8,
    reviews: 35,
    price: 75,
    seller: "InfoGraphix",
    delivery: "2 days"
  },
  {
    id: 23,
    title: "Shopify Store Customization",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&h=400&q=80",
    category: "E-commerce",
    rating: 4.9,
    reviews: 25,
    price: 210,
    seller: "ShopifyPro",
    delivery: "6 days"
  },
  {
    id: 24,
    title: "Professional Blog Writing",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Writing & Translation",
    rating: 4.8,
    reviews: 15,
    price: 60,
    seller: "BlogMaster",
    delivery: "2 days"
  }
];

export const ServicesGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {featuredServices.map(service => (
      <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
        <div className="relative h-44 overflow-hidden">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-700">{service.category}</Badge>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">{service.title}</h3>
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span className="font-medium">{service.seller}</span>
          </div>
          <div className="flex items-center text-xs text-gray-600 mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium">{service.rating}</span>
            <span className="mx-2 text-gray-300">•</span>
            <span>{service.reviews.toLocaleString()} reviews</span>
          </div>
          <div className="font-bold text-lg text-gray-900 mt-auto mb-2">${service.price.toLocaleString()}</div>
          <Link to={`/service/${service.id}`} className="inline-block px-4 py-2 bg-gradient-to-r from-green-600 to-orange-500 text-white text-xs rounded-lg hover:from-green-700 hover:to-orange-600 transition" style={{ cursor: 'pointer' }}>
            View Details
          </Link>
        </div>
      </div>
    ))}
  </div>
);

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Nav2 />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 flex-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">All Services</h1>
        {/* Fiverr-style Services Grid */}
        <ServicesGrid />
      </div>
      <Footer />
    </div>
  );
};

export default ServicesPage;
