
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-soko-green to-soko-orange">
      <div className="container px-4 mx-auto sm:px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Join the SurplusSoko Revolution
          </h2>
          <p className="mt-4 text-lg opacity-90">
            Whether you're a farmer, buyer, or investor, be part of our movement to transform Kenya's agricultural sector.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register/farmer" className="w-fit">
              <Button size="lg" variant="outline" className="bg-white text-soko-green border-white hover:bg-white/90">
                Register as a Farmer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register/buyer" className="w-fit">
              <Button size="lg" variant="outline" className="bg-white text-soko-orange border-white hover:bg-white/90">
                Register as a Buyer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm opacity-80">
            Or dial *384*45# on your phone to get started immediately
          </p>
        </div>
      </div>
    </section>
  );
}

