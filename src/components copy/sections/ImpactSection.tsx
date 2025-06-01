
import { Button } from "@/components/ui/button";
import { useCountUp } from "@/hooks/useCountUp";

export const ImpactSection = () => {
  const farmersCount = useCountUp({ end: 2500, duration: 2000 });
  const buyersCount = useCountUp({ end: 800, duration: 2000 });
  const volumeCount = useCountUp({ end: 15000, duration: 2000 });

  return (
    <section className="py-16 bg-gradient-to-br from-green-600 to-green-700 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Growing Impact</h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Transforming agricultural trade across Kenya, one connection at a time
          </p>
          <Button variant="outline" className="mt-6 border-orange-400 text-orange-400 hover:bg-orange-50 hover:text-orange-600">
            View Full Impact Report
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              {farmersCount.toLocaleString()}+
            </div>
            <p className="text-green-100">Registered Farmers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">
              {buyersCount.toLocaleString()}+
            </div>
            <p className="text-green-100">Active Buyers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              {volumeCount.toLocaleString()}
            </div>
            <p className="text-green-100">Tons Traded</p>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">
              25
            </div>
            <p className="text-green-100">Counties Reached</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">Income Increase</h3>
            <div className="text-3xl font-bold text-orange-400 mb-2">45%</div>
            <p className="text-green-100 text-sm">
              Average increase in farmer income since joining SokoConnect
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">Market Access</h3>
            <div className="text-3xl font-bold text-orange-400 mb-2">3x</div>
            <p className="text-green-100 text-sm">
              More buyers accessible compared to traditional methods
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-3">Transaction Time</h3>
            <div className="text-3xl font-bold text-orange-400 mb-2">2hrs</div>
            <p className="text-green-100 text-sm">
              Average time from listing to first buyer contact
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
