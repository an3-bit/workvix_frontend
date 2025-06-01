
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Grace Wanjiku",
      role: "Vegetable Farmer",
      location: "Kiambu County",
      content: "SokoConnect changed everything for me. I now sell directly to supermarkets and restaurants. My income has tripled in just 6 months!",
      rating: 5,
      avatar: "GW"
    },
    {
      name: "Peter Ochieng",
      role: "Maize Farmer", 
      location: "Uasin Gishu County",
      content: "The SMS feature is perfect for me. I don't have a smartphone, but I can still connect with buyers across the country. Technology that actually works!",
      rating: 5,
      avatar: "PO"
    },
    {
      name: "Sarah Muthoni",
      role: "Wholesale Buyer",
      location: "Nairobi",
      content: "Finding quality produce was always a challenge. Now I have direct relationships with farmers and can guarantee freshness to my customers.",
      rating: 5,
      avatar: "SM"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from farmers and buyers who are transforming their businesses with SokoConnect
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <Quote className="h-8 w-8 text-green-600 mb-4" />
                
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="font-semibold text-green-600">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">4.8/5</div>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
              <p className="text-gray-600">Support Available</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
              <p className="text-gray-600">Happy Users</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Join Our Growing Community
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Start connecting with buyers and farmers today. No setup fees, no hidden costs.
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Get Started Free
          </Button>
        </div>
      </div>
    </section>
  );
};
