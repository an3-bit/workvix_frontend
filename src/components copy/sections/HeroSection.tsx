import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function HeroSection() {
  return (
    <div 
      className="relative overflow-hidden bg-cover bg-center bg-no-repeat min-h-[90vh] sm:min-h-[80vh]"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("https://images.pexels.com/photos/31585422/pexels-photo-31585422/free-photo-of-elderly-vendor-at-market-stall-with-grain-bags.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
      }}
    >
      <div className="container px-4 py-8 mx-auto sm:px-6 sm:py-16 lg:py-24">
        <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="text-soko-green">Surplus</span>
              <span className="text-soko-orange">Soko</span>
            </h1>
            <p className="mt-4 text-xl font-medium text-white">
              Empowering Kenyan Farmers Through Accessible, Tech-Driven Market Linkages
            </p>
            <p className="mt-4 text-lg text-gray-200">
              We connect farmers directly to buyers using simple SMS technology, eliminating middlemen and reducing food waste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
              <Link to="/join-us">
                <Button variant="sokoGreen" size="lg" className="group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="sokoOutlineOrange" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-soko-green">30-40%</p>
                <p className="text-xs text-gray-600">Food waste reduction</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-soko-green">2x</p>
                <p className="text-xs text-gray-600">Farmer income increase</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-soko-green">85%</p>
                <p className="text-xs text-gray-600">Kenyan farmers reached</p>
              </div>
            </div>
          </div>
          
          <div className="relative lg:pl-8 mt-8 lg:mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader className="flex flex-col items-center">
                  <div className="w-full h-48 rounded-t-lg overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Fresh maize"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-center mt-2">Maize</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center">Premium quality maize from local farmers. Direct from farm to market.</p>
                  <p className="text-soko-green font-semibold text-center mt-2">KSH 50-80/kg</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader className="flex flex-col items-center">
                  <div className="w-full h-48 rounded-t-lg overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Fresh beans"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-center mt-2">Beans</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center">Fresh, high-quality beans sourced directly from local farmers.</p>
                  <p className="text-soko-green font-semibold text-center mt-2">KSH 120-150/kg</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader className="flex flex-col items-center">
                  <div className="w-full h-48 rounded-t-lg overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                      alt="Fresh tomatoes"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-center mt-2">Tomatoes</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center">Fresh tomatoes harvested daily from our network of farmers.</p>
                  <p className="text-soko-green font-semibold text-center mt-2">KSH 80-100/kg</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
