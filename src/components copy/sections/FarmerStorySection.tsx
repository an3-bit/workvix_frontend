
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Quote } from "lucide-react";

export const FarmerStorySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real Stories from Real Farmers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how SokoConnect is transforming lives across Kenya
          </p>
          <Button variant="outline" className="mt-6 border-orange-500 text-orange-600 hover:bg-orange-50">
            Read All Stories
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Story 1 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Quote className="h-8 w-8 text-green-600 mb-4" />
              <blockquote className="text-gray-700 mb-4 italic">
                "Before SokoConnect, I was selling my tomatoes for KSh 20 per kg to middlemen. Now I connect directly with buyers and earn KSh 45 per kg. My family's life has completely changed."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-green-600">MK</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mary Kinyanjui</p>
                  <p className="text-sm text-gray-600">Kiambu County • Tomato Farmer</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4 text-green-600 hover:text-green-700">
                Read Full Story
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Story 2 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Quote className="h-8 w-8 text-green-600 mb-4" />
              <blockquote className="text-gray-700 mb-4 italic">
                "The SMS feature is amazing! I don't need a smartphone. I just send a simple message and buyers contact me directly. Technology finally works for farmers like me."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-orange-600">JM</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">John Mwangi</p>
                  <p className="text-sm text-gray-600">Nakuru County • Maize Farmer</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4 text-green-600 hover:text-green-700">
                Read Full Story
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Story 3 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Quote className="h-8 w-8 text-green-600 mb-4" />
              <blockquote className="text-gray-700 mb-4 italic">
                "As a buyer, SokoConnect helps me source quality produce directly from farmers. The quality is better and prices are fair for everyone."
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="font-semibold text-blue-600">AK</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Alice Kimani</p>
                  <p className="text-sm text-gray-600">Nairobi • Wholesale Buyer</p>
                </div>
              </div>
              <Button variant="ghost" className="w-full mt-4 text-green-600 hover:text-green-700">
                Read Full Story
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-green-50 to-orange-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Write Your Success Story?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of farmers and buyers who are already benefiting from direct trade connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Register as Farmer
            </Button>
            <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
              Register as Buyer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
