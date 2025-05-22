
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const FarmerRegistrationCard = () => {
  return (
    <Card className="border-2 border-soko-green hover:shadow-lg transition-shadow">
      <CardHeader className="text-center">
        <Sprout className="w-12 h-12 mx-auto text-soko-green mb-4" />
        <CardTitle className="text-2xl">Register as Farmer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-gray-600 mb-6">
          <li>✓ Direct access to buyers</li>
          <li>✓ Better prices for your produce</li>
          <li>✓ Real-time market updates</li>
          <li>✓ Simple SMS-based trading</li>
        </ul>
        <Link to="/register/farmer">
          <Button variant="sokoGreen" className="w-full">Register as Farmer</Button>
        </Link>
      </CardContent>
    </Card>
  );
};
