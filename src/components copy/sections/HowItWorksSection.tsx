
import { Button } from "@/components/ui/button";
import { Smartphone, Users, TrendingUp, MessageSquare } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Register & List",
      description: "Farmers register and list their produce with details like quantity, quality, and price.",
      icon: Smartphone,
      color: "green"
    },
    {
      number: "02", 
      title: "Connect & Negotiate",
      description: "Buyers browse listings and connect directly with farmers via SMS or calls.",
      icon: Users,
      color: "orange"
    },
    {
      number: "03",
      title: "Trade & Grow",
      description: "Complete transactions safely and build long-term trading relationships.",
      icon: TrendingUp,
      color: "blue"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How SokoConnect Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, secure, and designed for everyone - from tech-savvy farmers to traditional traders
          </p>
          <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white">
            Get Started Now
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const colorClasses = {
              green: "bg-green-100 text-green-600",
              orange: "bg-orange-100 text-orange-600", 
              blue: "bg-blue-100 text-blue-600"
            };

            return (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className={`w-20 h-20 ${colorClasses[step.color]} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* SMS Feature Highlight */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center mb-4">
                <MessageSquare className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">SMS Trading Made Simple</h3>
              </div>
              <p className="text-gray-600 mb-6">
                No smartphone? No problem! Our SMS system lets you trade using any basic phone. 
                Just send simple commands and get connected with buyers instantly.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                <p className="text-gray-700 mb-2">
                  <span className="text-green-600">Send:</span> SELL TOMATO 500KG 45 NAKURU
                </p>
                <p className="text-gray-700">
                  <span className="text-green-600">Get:</span> Your listing is live! Buyers will contact you.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-xl p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Works on Any Phone</h4>
                <p className="text-gray-600 text-sm">
                  From basic Nokia phones to the latest smartphones - SokoConnect works for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
