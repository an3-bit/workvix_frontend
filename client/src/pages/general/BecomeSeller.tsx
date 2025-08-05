import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Join from './Join';
import { useNavigate } from 'react-router-dom';


const BecomeSeller = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-white to-orange-100 py-16 md:py-24 overflow-hidden">
        {/* Blurred Circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-600/40 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Start Earning With Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">Skills</span> Today
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join thousands of skilled professionals who are building successful businesses on workvix.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => {
                  navigate('/join');
                }}
              >
                Become a Seller Now
              </Button>
              <Button className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => {
                  navigate('/affiliate/register');
                }}
              >
                Become an Affiliate Marketer
              </Button>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold mb-12 text-center">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-workvix-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-workvix-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Your Profile</h3>
              <p className="text-gray-600">Sign up and create your professional profile showcasing your skills and experience.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-workvix-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-workvix-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Build Your Services</h3>
              <p className="text-gray-600">Create service listings that highlight your expertise and attract the right clients.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
                          <div className="w-16 h-16 rounded-full bg-workvix-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-workvix-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Start Earning</h3>
              <p className="text-gray-600">Complete projects, receive payments, and build your reputation on our platform.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold mb-12 text-center">Why Sell on workvix</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              "Access to global clients ready to buy",
              "Keep up to 80% of each transaction",
              "Get paid securely and on time",
              "Work from anywhere, anytime",
              "Join a community of skilled professionals",
              "Free tools to grow your business",
              "24/7 seller support",
              "Opportunities to be featured on our platform"
            ].map((benefit, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-workvix-primary mr-3 flex-shrink-0" />
                <p className="text-gray-700">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Success Stories */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold mb-12 text-center">Success Stories</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Graphic Designer",
                story: "Since joining workvix, I've been able to quit my 9-5 job and work full-time as a freelancer. I now earn twice what I made before and have clients from all over the world.",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg"
              },
              {
                name: "Michael Chen",
                role: "Web Developer",
                story: "workvix helped me turn my coding skills into a thriving business. I started with small projects and now have a team of developers working with me on enterprise-level projects.",
                avatar: "https://randomuser.me/api/portraits/men/22.jpg"
              },
              {
                name: "Aisha Patel",
                role: "Content Writer",
                story: "As a stay-at-home mom, workvix gave me the flexibility to earn while taking care of my family. I've built a loyal client base and my writing portfolio has grown exponentially.",
                avatar: "https://randomuser.me/api/portraits/women/67.jpg"
              }
            ].map((story, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                <div className="flex items-center mb-4">
                  <img 
                    src={story.avatar} 
                    alt={story.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{story.name}</h3>
                    <p className="text-workvix-primary text-sm">{story.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{story.story}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="relative py-16 bg-gradient-to-r from-green-600 to-orange-500 text-white overflow-hidden">
        {/* Blurred Circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-green-600/40 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our community of skilled professionals and start growing your business today.
          </p>
          <Button className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => {
              navigate('/join');
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
      
      {/* FAQ */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How much does it cost to join workvix as a seller?",
                answer: "Joining workvix as a seller is completely free. We only take a small commission when you complete a project successfully."
              },
              {
                question: "How and when do I get paid?",
                answer: "You get paid for each project once the client approves your work. Payments are processed securely through our platform and can be withdrawn to your bank account or PayPal."
              },
              {
                question: "What kind of skills are in demand?",
                answer: "Our marketplace has demand for a wide range of skills including graphic design, web development, writing, marketing, video production, and many more. Check our categories to see where your skills fit best."
              },
              {
                question: "How do I price my services?",
                answer: "You have complete control over your pricing. We provide insights on market rates to help you price competitively, but ultimately the decision is yours."
              },
              {
                question: "Do I need specific qualifications to become a seller?",
                answer: "While formal qualifications can help, they're not required. What matters most is your skill level, portfolio, and ability to deliver quality work to clients."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BecomeSeller;