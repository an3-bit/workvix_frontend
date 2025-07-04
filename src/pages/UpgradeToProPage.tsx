import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, Zap, Shield, Crown } from 'lucide-react';
import Nav2 from '@/components/Nav2';

const UpgradeToProPage = () => {
  const features = [
    "Priority customer support",
    "Advanced analytics dashboard",
    "Unlimited project postings",
    "Premium freelancer access",
    "Enhanced security features",
    "Custom branding options",
    "API access",
    "Dedicated account manager"
  ];

  const plans = [
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      icon: <Star className="h-6 w-6" />,
      features: [
        "Up to 10 active projects",
        "Priority support",
        "Advanced analytics",
        "Custom branding"
      ],
      popular: false
    },
    {
      name: "Business",
      price: "$79",
      period: "/month",
      icon: <Zap className="h-6 w-6" />,
      features: [
        "Unlimited projects",
        "Dedicated manager",
        "API access",
        "White-label solution",
        "Advanced security"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      icon: <Crown className="h-6 w-6" />,
      features: [
        "Everything in Business",
        "Custom integrations",
        "SLA guarantee",
        "On-premise option",
        "24/7 phone support"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Upgrade to <span className="text-skillforge-primary">WorkVix</span> Pro
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock advanced features and take your business to the next level with our premium plans
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-skillforge-primary scale-105' : 'border'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-skillforge-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${plan.popular ? 'bg-skillforge-primary text-white' : 'bg-gray-100 text-gray-600'}`}> 
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-skillforge-primary hover:bg-skillforge-primary/90' : 'bg-gray-900 hover:bg-gray-800'}`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
              <Shield className="h-12 w-12 text-skillforge-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                30-Day Money Back Guarantee
              </h3>
              <p className="text-gray-600 mb-6">
                Try WorkVix Pro risk-free. If you're not completely satisfied, we'll refund your money within 30 days.
              </p>
              <Button className="bg-skillforge-primary hover:bg-skillforge-primary/90">
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeToProPage;
