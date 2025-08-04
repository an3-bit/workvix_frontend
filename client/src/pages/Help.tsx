import React from 'react';
import Footer from '@/components/Footer';
import { ArrowLeft, MessageCircle, Phone, Mail, FileText, Users, Shield, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Help: React.FC = () => {
  const helpCategories = [
    {
      icon: <MessageCircle className="h-8 w-8 text-orange-500" />,
      title: "Getting Started",
      description: "Learn how to create an account and start using WorkVix",
      link: "/help/getting-started"
    },
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      title: "For Freelancers",
      description: "Find jobs, submit bids, and manage your work",
      link: "/help/freelancers"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-orange-500" />,
      title: "For Clients",
      description: "Post jobs, hire freelancers, and manage projects",
      link: "/help/clients"
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      title: "Trust & Safety",
      description: "Learn about our security measures and dispute resolution",
      link: "/help/trust-safety"
    },
    {
      icon: <FileText className="h-8 w-8 text-orange-500" />,
      title: "Payment & Billing",
      description: "Understand our payment system and billing policies",
      link: "/help/payments"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & Support</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to your questions and get the support you need to succeed on WorkVix
            </p>
          </div>

          {/* Help Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {helpCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  {category.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">{category.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Link 
                  to={category.link}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Learn more →
                </Link>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Still Need Help?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Phone className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 mb-2">+1 (555) 123-4567</p>
                <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM EST</p>
              </div>
              <div className="text-center">
                <Mail className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-2">support@workvix.com</p>
                <p className="text-sm text-gray-500">24/7 support</p>
              </div>
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-2">Available 24/7</p>
                <p className="text-sm text-gray-500">Get instant help</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How do I create an account?
                </h3>
                <p className="text-gray-600">
                  Click the "Join" button in the top navigation and choose whether you want to join as a client or freelancer. 
                  Fill in your details and verify your email to get started.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How does payment work?
                </h3>
                <p className="text-gray-600">
                  Clients pay upfront when they award a project. The payment is held in escrow and released to the freelancer 
                  once the project is completed and approved.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  What if I'm not satisfied with the work?
                </h3>
                <p className="text-gray-600">
                  We offer a satisfaction guarantee. If you're not happy with the delivered work, you can request revisions 
                  or contact our support team for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Help; 