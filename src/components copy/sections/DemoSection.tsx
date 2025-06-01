
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, MessageSquare, TrendingUp, Users, MapPin, Clock } from "lucide-react";

export const DemoSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See SokoConnect in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience how our platform transforms agricultural trading in Kenya
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Demo Video/Image Placeholder */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">SokoConnect Mobile</h3>
                      <p className="text-green-100">Live Trading Platform</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">JK</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">John Kamau</p>
                        <p className="text-sm text-gray-600">Nakuru County</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Farmer
                    </Badge>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">Fresh Tomatoes</h4>
                      <span className="text-lg font-bold text-orange-600">KSh 45/kg</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">500kg available • Grade A quality</p>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-sm font-semibold text-gray-900">15% Price Increase</p>
                      <p className="text-xs text-gray-600">This week</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm font-semibold text-gray-900">24 Active Buyers</p>
                      <p className="text-xs text-gray-600">In your area</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-green-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">New order received!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="order-1 lg:order-2">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Everything you need to trade successfully
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Smartphone className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">SMS-Based Trading</h4>
                      <p className="text-gray-600">Trade using simple SMS commands. No smartphone required.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Local Market Intelligence</h4>
                      <p className="text-gray-600">Real-time pricing and demand data from your area.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Instant Notifications</h4>
                      <p className="text-gray-600">Get notified immediately when buyers show interest.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Verified Network</h4>
                      <p className="text-gray-600">Trade with confidence in our verified farmer and buyer network.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
            <p className="text-gray-600">Active Farmers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">200+</div>
            <p className="text-gray-600">Registered Buyers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
            <p className="text-gray-600">Successful Trades</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">25</div>
            <p className="text-gray-600">Counties Covered</p>
          </div>
        </div>
      </div>
    </section>
  );
};
