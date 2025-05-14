
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const services = [
  {
    id: 1,
    title: "Professional Logo Design",
    image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Graphics & Design",
    rating: 4.9,
    reviews: 847,
    price: 120,
  },
  {
    id: 2,
    title: "WordPress Website Development",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Web Development",
    rating: 4.8,
    reviews: 605,
    price: 200,
  },
  {
    id: 3,
    title: "SEO Website Optimization",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Digital Marketing",
    rating: 4.7,
    reviews: 320,
    price: 150,
  },
  {
    id: 4,
    title: "Professional Content Writing",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&h=400&q=80",
    category: "Writing & Translation",
    rating: 4.9,
    reviews: 713,
    price: 80,
  },
];

const Featured = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Services</h2>
          <a href="#" className="text-skillforge-primary font-medium hover:underline">
            See All
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="service-image w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <Badge variant="outline" className="mb-2">
                  {service.category}
                </Badge>
                <h3 className="text-lg font-bold line-clamp-2 mb-2 hover:text-skillforge-primary transition-colors">
                  <a href="#">{service.title}</a>
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Star className="h-4 w-4 fill-skillforge-accent text-skillforge-accent mr-1" />
                  <span className="font-medium">{service.rating}</span>
                  <span className="mx-1">•</span>
                  <span>{service.reviews} reviews</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Starting at</span>
                    <span className="font-bold text-lg">${service.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;
