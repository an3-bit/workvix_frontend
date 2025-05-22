
import { Badge } from "@/components/ui/badge";
import { Smartphone, CreditCard, Brain, Truck } from "lucide-react";

export function TechnologySection() {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="sokoGreen" className="mb-4">Our Technology</Badge>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Powerful Technology, Simple Interface</h2>
          <p className="mt-4 text-lg text-gray-600">
            Advanced systems working behind a simple SMS interface anyone can use
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex border rounded-lg overflow-hidden">
            <div className="w-16 bg-soko-green flex-shrink-0 flex items-center justify-center">
              <Smartphone className="text-white h-8 w-8" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">USSD Gateway</h3>
              <p className="mt-2 text-gray-600">
                Safaricom's Daraja API powers our USSD service, making it accessible on any mobile device without internet. This reaches 85% of Kenyans with basic phones.
              </p>
            </div>
          </div>
          
          <div className="flex border rounded-lg overflow-hidden">
            <div className="w-16 bg-soko-orange flex-shrink-0 flex items-center justify-center">
              <CreditCard className="text-white h-8 w-8" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">M-Pesa Integration</h3>
              <p className="mt-2 text-gray-600">
                Secure payments powered by M-Pesa, trusted by 90% of Kenyans. Our platform handles transactions seamlessly between farmers and buyers.
              </p>
            </div>
          </div>
          
          <div className="flex border rounded-lg overflow-hidden">
            <div className="w-16 bg-soko-green flex-shrink-0 flex items-center justify-center">
              <Brain className="text-white h-8 w-8" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">AI Matching</h3>
              <p className="mt-2 text-gray-600">
                Our intelligent system matches produce listings with buyer preferences based on location, crop type, quantity, and quality requirements.
              </p>
            </div>
          </div>
          
          <div className="flex border rounded-lg overflow-hidden">
            <div className="w-16 bg-soko-orange flex-shrink-0 flex items-center justify-center">
              <Truck className="text-white h-8 w-8" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900">Logistics Integration</h3>
              <p className="mt-2 text-gray-600">
                Partnerships with Twiga Foods and local boda-boda networks ensure timely pickup and delivery of agricultural produce across the country.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
