import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Home2: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">SkillForge</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/signin">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/join">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Find the Perfect Freelancer for Your Project
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with talented freelancers and get your projects done quickly and professionally. 
              From web development to graphic design, we have experts for every need.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/jobs">
                <Button size="lg" className="px-8">
                  Browse Jobs
                </Button>
              </Link>
              <Link to="/post-job">
                <Button size="lg" variant="outline" className="px-8">
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SkillForge?
            </h3>
            <p className="text-lg text-gray-600">
              Everything you need to get your projects done right
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  Talented Freelancers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access a global network of skilled professionals ready to take on your projects.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Secure Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Safe and secure payment system with escrow protection for both parties.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  Fast Delivery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get your projects completed quickly with our efficient project management system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of clients and freelancers who trust SkillForge
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/join">
              <Button size="lg" variant="secondary" className="px-8">
                Join Now
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="px-8 text-white border-white hover:bg-white hover:text-blue-600">
                Browse Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">SkillForge</h4>
              <p className="text-gray-400">
                Connecting talented freelancers with amazing projects.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Clients</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/jobs" className="hover:text-white">Browse Jobs</Link></li>
                <li><Link to="/post-job" className="hover:text-white">Post a Job</Link></li>
                <li><Link to="/premium-services" className="hover:text-white">Premium Services</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Freelancers</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/jobs" className="hover:text-white">Find Work</Link></li>
                <li><Link to="/become-seller" className="hover:text-white">Become a Seller</Link></li>
                <li><Link to="/freelancer/portfolio" className="hover:text-white">Portfolio</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/chat" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/signin" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SkillForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home2; 