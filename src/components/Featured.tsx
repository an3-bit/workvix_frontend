import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
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
];

const Featured = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Featured Services
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Handpicked services from our top-rated freelancers
            </p>
          </div>
          <Link 
            to="/jobs"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            <span className="text-sm sm:text-base">See All Services</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service) => (
            <div key={service.id} className="group">
              <div className="service-card bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="service-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Favorite Button */}
                  <button className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-all duration-200 opacity-0 group-hover:opacity-100">
                    <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                  </button>
                  
                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700 hover:bg-white transition-colors">
                      {service.category}
                    </Badge>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4 sm:p-5 lg:p-6">
                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    <Link to={`/service/${service.id}`}>
                      {service.title}
                    </Link>
                  </h3>
                  
                  {/* Seller Info */}
                  <p className="text-sm text-gray-500 mb-3">
                    by <span className="font-medium text-gray-700">{service.seller}</span>
                  </p>
                  
                  {/* Rating and Reviews */}
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{service.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <span>{service.reviews.toLocaleString()} reviews</span>
                  </div>
                  
                  {/* Delivery Time */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="font-medium">Delivery:</span>
                    <span className="ml-1">{service.delivery}</span>
                  </div>
                  
                  {/* Price Section */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">Starting at</span>
                        <div className="font-bold text-lg sm:text-xl text-gray-900">
                          ${service.price.toLocaleString()}
                        </div>
                      </div>
                      <Link 
                        to={`/service/${service.id}`}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 transform hover:scale-105"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12 lg:mt-16">
          <Link 
            to="/jobs"
            className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 
                     bg-gradient-to-r from-blue-600 to-purple-600 
                     hover:from-blue-700 hover:to-purple-700 
                     text-white font-medium rounded-lg 
                     transition-all duration-300 transform hover:scale-105
                     shadow-lg hover:shadow-xl"
          >
            <span className="text-sm sm:text-base">Explore More Services</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Featured;
