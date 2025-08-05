import React from 'react';
import Footer from '@/components/Footer';
import { ArrowLeft, Construction } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const PlaceholderPage: React.FC = () => {
  const { page } = useParams<{ page: string }>();
  
  const getPageInfo = (pageName: string) => {
    const pageMap: { [key: string]: { title: string; description: string } } = {
      'careers': {
        title: 'Careers at WorkVix',
        description: 'Join our team and help us build the future of freelancing'
      },
      'press': {
        title: 'Press & News',
        description: 'Stay updated with the latest news and announcements from WorkVix'
      },
      'partnerships': {
        title: 'Partnerships',
        description: 'Partner with WorkVix to grow your business and reach new customers'
      },
      'ip': {
        title: 'Intellectual Property',
        description: 'Learn about our intellectual property policies and procedures'
      },
      'investors': {
        title: 'Investor Relations',
        description: 'Information for investors and stakeholders'
      },
      'success-stories': {
        title: 'Success Stories',
        description: 'Discover how freelancers and clients have succeeded on WorkVix'
      },
      'community': {
        title: 'Community Hub',
        description: 'Connect with other WorkVix users and share experiences'
      },
      'forum': {
        title: 'Community Forum',
        description: 'Join discussions and get help from the WorkVix community'
      },
      'events': {
        title: 'Events',
        description: 'Attend WorkVix events and meet other professionals'
      },
      'influencers': {
        title: 'Influencers',
        description: 'Partner with influencers to promote your services'
      },
      'cookies': {
        title: 'Cookie Policy',
        description: 'Learn how we use cookies to improve your experience'
      },
      'accessibility': {
        title: 'Accessibility',
        description: 'Our commitment to making WorkVix accessible to everyone'
      }
    };
    
    return pageMap[pageName] || {
      title: 'Page Coming Soon',
      description: 'This page is under construction and will be available soon'
    };
  };

  const pageInfo = getPageInfo(page || '');

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
        <div className="max-w-4xl mx-auto text-center">
          <Construction className="h-24 w-24 text-orange-500 mx-auto mb-8" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageInfo.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{pageInfo.description}</p>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <p className="text-gray-700 mb-6">
              We're working hard to bring you this content. This page is currently under development 
              and will be available soon with comprehensive information and features.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/"
                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Go to Homepage
              </Link>
              <Link 
                to="/help"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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

export default PlaceholderPage; 