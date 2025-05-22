
import { Badge } from "@/components/ui/badge";
import { MessageCircle, ShoppingBag, Truck, CheckCircle } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="py-16 bg-white" id="how-it-works">
      <div className="container px-4 mx-auto sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="sokoGreen" className="mb-4">Simple Process</Badge>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How SurplusSoko Works</h2>
          <p className="mt-4 text-lg text-gray-600">
            Connect to markets using any basic mobile phone, no internet required
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-soko-green/10 text-soko-green rounded-full">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="absolute top-4 -left-4 w-8 h-8 rounded-full bg-soko-green flex items-center justify-center text-white font-bold shadow-md">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900">List Your Produce</h3>
              <p className="mt-2 text-sm text-gray-600">
                Dial *384*45# and follow the prompts to list your surplus crops, quantity, location, and price.
              </p>
              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-100">
                <p className="text-xs font-medium text-gray-800">Example:</p>
                <p className="text-xs text-gray-600">"MAIZE 100KG KISUMU 3000KSH"</p>
              </div>
            </div>

            <div className="relative p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-soko-orange/10 text-soko-orange rounded-full">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="absolute top-4 -left-4 w-8 h-8 rounded-full bg-soko-orange flex items-center justify-center text-white font-bold shadow-md">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Instant Buyer Alerts</h3>
              <p className="mt-2 text-sm text-gray-600">
                Registered buyers receive SMS alerts about your listing based on their preferences and location.
              </p>
              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-100">
                <p className="text-xs font-medium text-gray-800">SMS Alert:</p>
                <p className="text-xs text-gray-600">"New: 100KG Maize available in Kisumu for KSH 3000. Reply YES to purchase."</p>
              </div>
            </div>

            <div className="relative p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-soko-green/10 text-soko-green rounded-full">
                <Truck className="w-6 h-6" />
              </div>
              <div className="absolute top-4 -left-4 w-8 h-8 rounded-full bg-soko-green flex items-center justify-center text-white font-bold shadow-md">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Secure Payment & Pickup</h3>
              <p className="mt-2 text-sm text-gray-600">
                Buyers pay via M-Pesa, and our logistics partners handle same-day pickup and delivery.
              </p>
              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-100">
                <p className="text-xs font-medium text-gray-800">M-Pesa:</p>
                <p className="text-xs text-gray-600">Secure payment confirmation sent to both parties</p>
              </div>
            </div>

            <div className="relative p-6 bg-white border border-gray-100 rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mb-4 bg-soko-orange/10 text-soko-orange rounded-full">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="absolute top-4 -left-4 w-8 h-8 rounded-full bg-soko-orange flex items-center justify-center text-white font-bold shadow-md">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Quality Verification</h3>
              <p className="mt-2 text-sm text-gray-600">
                Local cooperative groups verify produce quality, ensuring trust between farmers and buyers.
              </p>
              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-100">
                <p className="text-xs font-medium text-gray-800">Trust System:</p>
                <p className="text-xs text-gray-600">Verified farmers receive priority listing and premium pricing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
