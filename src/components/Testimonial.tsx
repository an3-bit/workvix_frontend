
import { Star } from "lucide-react";

const Testimonial = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">What success on <span className="text-2xl  text-skillforge-primary">work<span className="text-orange-500 text-workvix-primary">vix</span></span> looks like</h2>
        <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto mb-12">
          Hear from our community of talented freelancers and satisfied clients
        </p>
        
        <div className="bg-skillforge-primary text-white rounded-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-6">workvix</h3>
              <p className="text-xl mb-8">
                "<span className="text-2xl  text-workvix-primary">work<span className="text-orange-500 text-workvix-primary">vix</span></span> is the best platform for freelancers to find and work with top designers and developers. Their portfolio showcases their skills and expertise, and their reviews provide valuable insights into their work. I highly recommend workvix to anyone looking to find the perfect freelancer for their project."
              </p>
              
              <div className="flex items-center">
                <div className="flex mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-white text-white" />
                  ))}
                </div>
                <span className="font-medium">Exceptional Service</span>
              </div>
              
              <div className="mt-6">
                <div className="font-bold">David Chen</div>
                <div className="text-white/80">Founder, TechStart Solutions</div>
              </div>
            </div>
            
            <div className="bg-skillforge-secondary">
              {/* Logo Display or Image */}
              <div className="h-full flex items-center justify-center p-12">
                <div className="text-6xl sm:text-8xl font-bold text-white">
                  work<span className="text-orange-500 text-workvix-primary">vix</span><span className="text-skillforge-primary text-3xl">.</span>
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
