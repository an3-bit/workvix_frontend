
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Promotion = () => 
  
  {
    const navigate = useNavigate();
  return (
    <section className="py-16 bg-skillforge-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-skillforge-primary">SkillForge</span>Pro
            </h2>
            <h3 className="text-2xl mb-6">
              The premium freelance solution for businesses
            </h3>
            
            <ul className="space-y-4 mb-8">
              <li className="flex">
                <Check className="h-6 w-6 text-skillforge-primary mr-3 flex-shrink-0" />
                <span>Exclusive access to top-rated talent</span>
              </li>
              <li className="flex">
                <Check className="h-6 w-6 text-skillforge-primary mr-3 flex-shrink-0" />
                <span>Dedicated account management</span>
              </li>
              <li className="flex">
                <Check className="h-6 w-6 text-skillforge-primary mr-3 flex-shrink-0" />
                <span>Enterprise-grade security and tools</span>
              </li>
              <li className="flex">
                <Check className="h-6 w-6 text-skillforge-primary mr-3 flex-shrink-0" />
                <span>Consolidated billing and reporting</span>
              </li>
            </ul>
            
            <Button className="cta-button" onClick={() => navigate('/become-seller')}>Learn More</Button>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80" 
                alt="Business team working" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-5 -left-5 bg-skillforge-primary text-white p-4 rounded-lg shadow-lg">
                <span className="font-bold block">Enterprise Solution</span>
                <span className="text-sm opacity-90">Tailored for your business needs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Promotion;
