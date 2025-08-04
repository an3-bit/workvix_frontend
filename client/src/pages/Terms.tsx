import React from 'react';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using WorkVix, you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to abide by the above, please do 
                not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                WorkVix is a platform that connects freelancers with clients seeking professional 
                services. We provide a marketplace where users can post jobs, submit bids, and 
                complete transactions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use certain features of the service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account information</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Conduct</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Post false, misleading, or fraudulent information</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Payment Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                All payments are processed through secure third-party payment processors. 
                WorkVix charges a service fee on completed transactions. Payment disputes 
                should be resolved between users, with WorkVix acting as a mediator when necessary.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                The service and its original content, features, and functionality are owned by 
                WorkVix and are protected by international copyright, trademark, patent, trade 
                secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account and bar access to the service immediately, 
                without prior notice or liability, under our sole discretion, for any reason 
                whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall WorkVix, nor its directors, employees, partners, agents, suppliers, 
                or affiliates, be liable for any indirect, incidental, special, consequential, or 
                punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at{' '}
                <a href="mailto:legal@workvix.com" className="text-orange-500 hover:text-orange-600">
                  legal@workvix.com
                </a>
              </p>
            </section>

            <div className="border-t pt-8">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms; 