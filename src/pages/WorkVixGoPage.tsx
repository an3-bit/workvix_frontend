import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Clock, Users, Target, ArrowRight, CheckCircle } from 'lucide-react';
import Nav2 from '@/components/Nav2';

const WorkVixGoPage = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "AI-Powered Matching",
      description: "Get matched with the perfect freelancer using our advanced AI algorithm in under 60 seconds."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24-Hour Delivery",
      description: "Express services available with guaranteed delivery within 24 hours for urgent projects."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Pre-Vetted Experts",
      description: "Access to our elite network of top 1% freelancers who have been thoroughly vetted."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Project Management",
      description: "Dedicated project manager assigned to ensure smooth execution and timely delivery."
    }
  ];

  const services = [
    {
      category: "Design & Creative",
      services: ["Logo Design", "Website Design", "App UI/UX", "Brand Identity"],
      startingPrice: "$99"
    },
    {
      category: "Marketing & Sales",
      services: ["Social Media Marketing", "Content Strategy", "SEO Optimization", "Ad Campaigns"],
      startingPrice: "$199"
    },
    {
      category: "Technology",
      services: ["Web Development", "Mobile Apps", "AI/ML Solutions", "DevOps"],
      startingPrice: "$299"
    },
    {
      category: "Business Solutions",
      services: ["Business Plans", "Market Research", "Financial Analysis", "Strategy Consulting"],
      startingPrice: "$149"
    }
  ];

  const benefits = [
    "Skip the bidding process - get instant matches",
    "Fixed pricing with no hidden fees",
    "100% money-back guarantee",
    "24/7 customer support",
    "Unlimited revisions included",
    "Fast-track delivery options"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="relative text-center mb-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 md:py-24 overflow-hidden rounded-2xl">
            {/* Blurred Circles */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
              <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
              <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4 mr-2" />
                New: WorkVix Go
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Get Your Project Done <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Lightning Fast</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Skip the hassle of posting jobs and reviewing proposals. Get matched with pre-vetted experts 
                and start your project in minutes, not days.
              </p>
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                Try WorkVix Go
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-skillforge-primary/10 rounded-full w-fit">
                    <div className="text-skillforge-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Services Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Popular WorkVix Go Services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.category}</CardTitle>
                    <div className="text-2xl font-bold text-skillforge-primary">
                      Starting at {service.startingPrice}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {service.services.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-skillforge-primary hover:bg-skillforge-primary/90">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Why Choose WorkVix Go?
                </h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-skillforge-primary to-blue-600 rounded-xl p-8 text-white">
                <h4 className="text-2xl font-bold mb-4">Ready to get started?</h4>
                <p className="mb-6 opacity-90">
                  Join thousands of businesses who trust WorkVix Go for their most important projects.
                </p>
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Your Project Now
                </Button>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-12">How WorkVix Go Works</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-skillforge-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h4 className="text-xl font-semibold mb-2">Tell Us What You Need</h4>
                <p className="text-gray-600">Describe your project requirements in a simple form</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-skillforge-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h4 className="text-xl font-semibold mb-2">Get Matched Instantly</h4>
                <p className="text-gray-600">Our AI matches you with the perfect expert in seconds</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-skillforge-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h4 className="text-xl font-semibold mb-2">Receive Your Project</h4>
                <p className="text-gray-600">Get high-quality deliverables on time, every time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkVixGoPage;
