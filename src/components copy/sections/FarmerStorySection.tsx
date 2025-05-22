import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function FarmerStorySection() {
  return (
    <section className="py-12 sm:py-16 bg-soko-earth">
      <div className="container px-4 mx-auto sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge variant="sokoOrange" className="mb-4">Real Stories</Badge>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Transforming Lives</h2>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white p-4 sm:p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
            <div className="mx-auto md:mx-0 md:w-1/3 max-w-[240px]">
              <div className="aspect-square rounded-full overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/7551442/pexels-photo-7551442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="Jane, maize farmer from Kisumu"
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-gray-900">Jane's Story</h3>
              <p className="text-sm font-medium text-soko-green mt-1">Maize Farmer, Kisumu County</p>
              
              <div className="mt-4 prose text-gray-700">
                <p>"For years, I would work tirelessly only to lose much of my maize harvest to spoilage or sell at throwaway prices to middlemen. I had no choice – I needed cash quickly, and had no way to reach better buyers."</p>
                
                <p className="mt-4">"Since discovering SurplusSoko last season, everything changed. I simply dial *384*45# after harvest, list my 100kg of maize, and within hours, I'm connected to schools and processors who pay me double what middlemen offered."</p>
                
                <p className="mt-4 font-semibold">"My income has doubled, and I've expanded my farm with the extra profits. My children can now stay in school without interruption."</p>
              </div>
              
              <div className="mt-6">
                <Link to="/success-stories">
                  <Button variant="sokoGreen" className="group">
                    More Success Stories
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
