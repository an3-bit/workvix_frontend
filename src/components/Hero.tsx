
import { Search } from 'lucide-react';

const Hero = () => {
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
                className="search-input"
              />
              <button className="search-button">
                <Search className="h-5 w-5" />
              </button>
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
        </div>
      </div>
    </section>
  );
};

export default Hero;
