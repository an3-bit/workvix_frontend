import React from 'react';
import Footer from '@/components/Footer';
import { ArrowLeft, Shield, Lock, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Trust: React.FC = () => {
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-orange-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Trust & Safety</h1>
            <p className="text-xl text-gray-600">
              Your security and trust are our top priorities
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Secure Payments</h2>
              <div className="flex items-start space-x-4">
                <Lock className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    All payments are processed through secure, encrypted payment gateways. 
                    We use industry-standard SSL encryption to protect your financial information 
                    and never store your payment details on our servers.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Escrow Protection</h2>
              <div className="flex items-start space-x-4">
                <Shield className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    When you hire a freelancer, your payment is held securely in escrow until 
                    the project is completed and you're satisfied with the work. This ensures 
                    both parties are protected throughout the transaction.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Verification</h2>
              <div className="flex items-start space-x-4">
                <Users className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    We verify all users through multiple methods including email verification, 
                    phone verification, and identity verification for premium accounts. 
                    This helps ensure you're working with legitimate professionals.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dispute Resolution</h2>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    If issues arise during a project, our dedicated support team is here to help. 
                    We provide mediation services and can step in to resolve disputes fairly 
                    for both clients and freelancers.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reporting & Moderation</h2>
              <div className="flex items-start space-x-4">
                <AlertTriangle className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    We have a zero-tolerance policy for fraud, harassment, or inappropriate behavior. 
                    Our team actively monitors the platform and investigates all reports. 
                    Users who violate our terms may be suspended or banned.
                  </p>
                </div>
              </div>
            </section>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">Need to Report an Issue?</h3>
              <p className="text-orange-800 mb-4">
                If you encounter any suspicious activity or have concerns about a user, 
                please report it immediately.
              </p>
              <Link 
                to="/help"
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Trust; 