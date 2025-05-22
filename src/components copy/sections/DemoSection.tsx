
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, MessageSquare, ShoppingBag } from "lucide-react";

export function DemoSection() {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      setStep(1);
    }
    setMessage("");
  };

  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="sokoGreen" className="mb-4">Try It Out</Badge>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Experience SurplusSoko</h2>
          <p className="mt-4 text-lg text-gray-600">
            See how easily farmers and buyers connect through our platform
          </p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Farmer Interface</h3>
                <Badge variant="sokoGreen">USSD *384*45#</Badge>
              </div>
              
              <div className="space-y-4">
                <div className={`p-3 rounded-lg ${step >= 1 ? "bg-soko-green/10 border-l-4 border-soko-green" : "bg-gray-100"}`}>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-soko-green/20 text-soko-green flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <p className="ml-3 text-sm font-medium text-gray-900">Welcome to SurplusSoko</p>
                  </div>
                  <div className="mt-2 ml-9 text-xs text-gray-600">
                    1. List produce<br />
                    2. View offers<br />
                    3. Check prices<br />
                    4. Help
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${step >= 2 ? "bg-soko-green/10 border-l-4 border-soko-green" : "bg-gray-100"}`}>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-soko-green/20 text-soko-green flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <p className="ml-3 text-sm font-medium text-gray-900">List Your Produce</p>
                  </div>
                  <div className="mt-2 ml-9 text-xs text-gray-600">
                    Enter crop type:<br />
                    MAIZE
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${step >= 3 ? "bg-soko-green/10 border-l-4 border-soko-green" : "bg-gray-100"}`}>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-soko-green/20 text-soko-green flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <p className="ml-3 text-sm font-medium text-gray-900">Enter Quantity & Location</p>
                  </div>
                  <div className="mt-2 ml-9 text-xs text-gray-600">
                    Enter KGs: 100<br />
                    Location: KISUMU<br />
                    Price (KSH): 3000
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${step >= 4 ? "bg-soko-green/10 border-l-4 border-soko-green" : "bg-gray-100"}`}>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-soko-green/20 text-soko-green flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <p className="ml-3 text-sm font-medium text-gray-900">Confirmation</p>
                  </div>
                  <div className="mt-2 ml-9 text-xs text-gray-600">
                    {step >= 4 ? (
                      <>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-soko-green" />
                          <span className="ml-1 text-soko-green font-medium">Listed successfully!</span>
                        </div>
                        Crop: MAIZE<br />
                        Quantity: 100KG<br />
                        Location: KISUMU<br />
                        Price: KSH 3000<br />
                        <span className="text-xs text-soko-green">Buyers notified: 5</span>
                      </>
                    ) : (
                      "Waiting for submission..."
                    )}
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="mt-6">
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={step === 1 ? "Enter 1 to list produce" : step === 2 ? "Type MAIZE" : step === 3 ? "Type 100 KISUMU 3000" : "Type 1 to confirm"}
                    className="flex-1" 
                  />
                  <Button type="submit" variant="sokoGreen" size="icon">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Buyer Interface</h3>
                <Badge variant="sokoOrange">SMS Notifications</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-start">
                    <MessageSquare className="w-5 h-5 text-soko-orange flex-shrink-0 mt-1" />
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">Today, 10:34 AM</p>
                      <p className="text-sm text-gray-900 mt-1">
                        <span className="font-medium">SurplusSoko Alert:</span> New listing matching your needs!
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        100KG of MAIZE available in KISUMU for KSH 3000. Quality verified by Kisumu Farmers Cooperative.
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        Reply YES to purchase or CALL 0722123456 for more info.
                      </p>
                    </div>
                  </div>
                </div>
                
                {step >= 4 && (
                  <div className="p-3 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <div className="flex items-start">
                      <ShoppingBag className="w-5 h-5 text-soko-green flex-shrink-0 mt-1" />
                      <div className="ml-3">
                        <p className="text-xs text-gray-500">Today, 10:36 AM</p>
                        <p className="text-sm text-gray-900 mt-1">
                          <span className="font-medium">SurplusSoko:</span> Purchase confirmed!
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          You have successfully purchased 100KG of MAIZE from Jane in KISUMU. Payment of KSH 3000 completed via M-Pesa.
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          Pickup scheduled for today by 5PM by our partner Twiga Foods. Tracking code: SK38291
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <div className="p-4 bg-soko-orange/10 rounded-lg border border-soko-orange/30">
                  <h4 className="text-sm font-medium text-gray-900">Buyer Benefits</h4>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-soko-orange mt-0.5 flex-shrink-0" />
                      <span className="ml-2 text-xs text-gray-700">Direct access to verified farmers</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-soko-orange mt-0.5 flex-shrink-0" />
                      <span className="ml-2 text-xs text-gray-700">Quality assurance through cooperative verification</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-soko-orange mt-0.5 flex-shrink-0" />
                      <span className="ml-2 text-xs text-gray-700">15% average reduction in procurement costs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-soko-orange mt-0.5 flex-shrink-0" />
                      <span className="ml-2 text-xs text-gray-700">Same-day delivery via our logistics network</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
