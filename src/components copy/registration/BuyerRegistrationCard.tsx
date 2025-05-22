
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BuyerRegistrationCard = () => {
  return (
    <Card className="border-2 border-soko-orange hover:shadow-lg transition-shadow">
      <CardHeader className="text-center">
        <Store className="w-12 h-12 mx-auto text-soko-orange mb-4" />
        <CardTitle className="text-2xl">Register as Buyer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-gray-600 mb-6">
          <li>✓ Direct sourcing from farmers</li>
          <li>✓ Quality fresh produce</li>
          <li>✓ Competitive pricing</li>
          <li>✓ Reliable supply chain</li>
        </ul>
        <Link to="/register/buyer">
          <Button variant="sokoOrange" className="w-full">Register as Buyer</Button>
        </Link>
      </CardContent>
    </Card>
  );
};
