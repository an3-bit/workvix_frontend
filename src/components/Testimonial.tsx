import { Star, Quote, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "David Chen",
    role: "Founder, TechStart Solutions",
    company: "TechStart Solutions",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    content: "WorkVix is the best platform for freelancers to find and work with top designers and developers. Their portfolio showcases their skills and expertise, and their reviews provide valuable insights into their work. I highly recommend WorkVix to anyone looking to find the perfect freelancer for their project.",
    rating: 5,
    project: "E-commerce Website Development"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "Growth Marketing Co",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&h=150&q=80",
    content: "The quality of work and professionalism I've experienced on WorkVix is outstanding. The platform makes it easy to find talented freelancers who truly understand our business needs. It's been a game-changer for our marketing campaigns.",
    rating: 5,
    project: "Digital Marketing Campaign"
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "CEO",
    company: "Innovate Labs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    content: "As a startup founder, finding reliable talent quickly is crucial. WorkVix has consistently delivered exceptional freelancers who have helped us scale our operations efficiently. The platform's quality control is impressive.",
    rating: 5,
    project: "Mobile App Development"
  }
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What success on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              WorkVix
            </span>{" "}
            looks like
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto">
            Hear from our community of talented freelancers and satisfied clients
          </p>
        </div>
        
        {/* Testimonial Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid lg:grid-cols-2">
              {/* Content */}
              <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative">
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 lg:top-8 lg:right-8">
                  <Quote className="h-8 w-8 text-blue-200" />
                </div>
                
                {/* Testimonial Content */}
                <div className="mb-6 lg:mb-8">
                  <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
                    "{currentTestimonial.content}"
                  </p>
                </div>
                
                {/* Rating */}
                <div className="flex items-center mb-6">
                  <div className="flex mr-3">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-700">
                    Exceptional Service
                  </span>
                </div>
                
                {/* Author Info */}
                <div className="flex items-center mb-6">
                  <img 
                    src={currentTestimonial.avatar} 
                    alt={currentTestimonial.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base">
                      {currentTestimonial.name}
                    </div>
                    <div className="text-gray-600 text-xs sm:text-sm">
                      {currentTestimonial.role}
                    </div>
                    <div className="text-blue-600 text-xs sm:text-sm font-medium">
                      {currentTestimonial.project}
                    </div>
                  </div>
                </div>
                
                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={prevTestimonial}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    >
                      <ArrowLeft className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                    >
                      <ArrowRight className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Visual Section */}
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full"></div>
                  <div className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full"></div>
                </div>
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-8 lg:p-12 text-center">
                  <div className="mb-6">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                      WorkVix
                    </div>
                    <div className="text-white/80 text-sm sm:text-base">
                      Where talent meets opportunity
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-6 sm:gap-8">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                        10K+
                      </div>
                      <div className="text-white/80 text-xs sm:text-sm">
                        Happy Clients
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                        50K+
                      </div>
                      <div className="text-white/80 text-xs sm:text-sm">
                        Projects Completed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
