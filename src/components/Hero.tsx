
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';


const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative bg-skillforge-secondary pt-16 pb-20 md:pb-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 opacity-20" 
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80)' }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            Our freelancers will take it from here
          </h1>
          <p className="text-xl text-gray-200 mb-10 animate-fade-in">
            Find the perfect talent to bring your projects to life
          </p>
          
          {/* Search Form */}
          <div className="flex flex-col md:flex-row w-full max-w-2xl mx-auto animate-fade-in">
            <div className="flex flex-1 rounded-md overflow-hidden shadow-lg">
              <input
                type="text"
                placeholder="What service are you looking for today?"
                className="w-full py-3 px-4 outline-none text-gray-700 flex-grow"
              />
              <Button className="px-6 bg-skillforge-primary hover:bg-skillforge-primary/90 rounded-none">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Popular Searches */}
          <div className="flex flex-wrap justify-center gap-2 mt-6 text-sm text-gray-300 animate-fade-in">
            <span className="font-medium">Popular:</span>
            <a href="#" className="hover:text-white transition-colors">Website Design</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Logo Design</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">WordPress</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Voice Over</a>
          </div>
          {/* Call-to-Action Button */}
          {/* Call-to-Action Buttons (horizontal alignment) */}
<div className="flex justify-center gap-4 mt-8 animate-fade-in">
  <Button
    className="px-8 py-3 bg-skillforge-primary hover:bg-skillforge-primary/90 rounded-md text-white"
    onClick={() => navigate('/post-job')}
  >
    Post a Job
  </Button>
  <Button
    className="px-8 py-3 bg-orange-500 hover:bg-orange-600 rounded-md text-white"
    onClick={() => navigate('/become-seller')}
  >
    Find a Job
  </Button>
</div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
