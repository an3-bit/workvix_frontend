
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-skillforge-secondary to-skillforge-secondary/80">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Freelance services at your <span className="text-skillforge-accent">fingertips</span>
            </h2>
            <p className="text-white/80">
              Find the right service for your business, right now
            </p>
          </div>
          
          <div className="mt-6 md:mt-0">
            <Button className="bg-white hover:bg-gray-100 text-skillforge-secondary">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
