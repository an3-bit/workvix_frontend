
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Wifi, Shield, Globe } from "lucide-react";

export const TechnologySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Technology That Works for Everyone
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built for the African market with solutions that work in every environment
          </p>
          <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white">
            Learn About Our Technology
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">SMS First</h3>
              <p className="text-gray-600 text-sm">
                Works on any phone, from basic feature phones to smartphones
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Low Bandwidth</h3>
              <p className="text-gray-600 text-sm">
                Optimized for 2G networks and areas with poor connectivity
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Safe</h3>
              <p className="text-gray-600 text-sm">
                Bank-level security with verified user networks
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Local Language</h3>
              <p className="text-gray-600 text-sm">
                Supports Swahili, English, and major local languages
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Feature Comparison */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Why Choose SokoConnect?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-green-600">✓ What We Offer</h4>
              <ul className="space-y-3 text-gray-700">
                <li>• Works on any phone (including basic phones)</li>
                <li>• Direct farmer-to-buyer connections</li>
                <li>• Real-time market pricing</li>
                <li>• Verified user network</li>
                <li>• Multi-language support</li>
                <li>• No middleman fees</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-red-600">✗ Traditional Methods</h4>
              <ul className="space-y-3 text-gray-700">
                <li>• Requires physical market visits</li>
                <li>• Multiple middlemen reduce profits</li>
                <li>• No price transparency</li>
                <li>• Limited buyer network</li>
                <li>• Language barriers</li>
                <li>• High transaction costs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
