import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { servicesData, getRelatedServices } from "../data/servicesData";

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = servicesData.find((s) => s.slug === slug);
  const relatedServices = getRelatedServices(slug || "", 4);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Page will be here soon.</h1>
          <p className="text-gray-600 mb-6">The service you're looking for exists. Kindly chat with support here to get your task done.</p>
          <Link 
            to="/" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />

      {/* Hero Section */}
      <div className="relative">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
          <div className="max-w-7xl mx-auto px-6 text-white">
            <nav className="mb-4 text-sm">
              <span className="opacity-75">{service.category}</span>
              <span className="mx-2 opacity-75">•</span>
              <span className="opacity-75">{service.subcategory}</span>
            </nav>
            <h1 className="text-5xl font-bold mb-4">{service.name}</h1>
            <p className="text-xl max-w-3xl">{service.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* About This Service */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">About This Service</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {service.detailedDescription}
              </p>
            </section>

            {/* What's Included */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Tags */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Related Skills</h2>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 sticky top-6">
              <h3 className="text-2xl font-bold mb-6">Service Packages</h3>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Basic</span>
                    <span className="text-2xl font-bold text-green-600">
                      {service.pricing.starting}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Perfect for getting started</p>
                  <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Get Started
                  </button>
                </div>

                <div className="border-2 border-blue-500 rounded-lg p-4 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                      Most Popular
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Standard</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {service.pricing.popular}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Great value for most projects</p>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                  </button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Premium</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {service.pricing.premium}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Maximum value and features</p>
                  <button className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    Get Started
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Typical Delivery:</span>
                  <span className="font-semibold">{service.deliveryTime}</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Need Custom Work?</h3>
              <p className="text-gray-600 mb-4">
                Get a personalized quote for your specific requirements.
              </p>
              <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors mb-3">
                Contact for Quote
              </button>
              <div className="text-center">
                <p className="text-sm text-gray-500">Response within 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Related Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedServices.map((relatedService) => (
                <Link
                  key={relatedService.slug}
                  to={`/services/${relatedService.category.toLowerCase().replace(/\s+/g, '-')}/${relatedService.slug}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={relatedService.image}
                      alt={relatedService.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
                        {relatedService.subcategory}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {relatedService.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relatedService.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-bold">
                        From {relatedService.pricing.starting}
                      </span>
                      <span className="text-xs text-gray-500">
                        {relatedService.deliveryTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold mb-2">What's included in the basic package?</h3>
                <p className="text-gray-600">
                  The basic package includes the core features needed to get started with {service.name.toLowerCase()}. 
                  You'll receive professional quality work with essential features included.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold mb-2">How long does delivery take?</h3>
                <p className="text-gray-600">
                  Typical delivery time is {service.deliveryTime}, but this may vary based on the complexity 
                  of your project and current workload. Rush delivery options may be available.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold mb-2">Do you offer revisions?</h3>
                <p className="text-gray-600">
                  Yes! All packages include revisions to ensure you're completely satisfied with the final result. 
                  The number of revisions varies by package level.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold mb-2">Can I get a custom quote?</h3>
                <p className="text-gray-600">
                  Absolutely! If your project has unique requirements that don't fit our standard packages, 
                  we'd be happy to provide a custom quote tailored to your needs.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold mb-2">What file formats will I receive?</h3>
                <p className="text-gray-600">
                  You'll receive all necessary file formats for your specific use case. This typically includes 
                  source files and various export formats suitable for different applications.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-bold mb-2">Is there ongoing support?</h3>
                <p className="text-gray-600">
                  We provide support during the project and immediately after delivery. Extended support 
                  and maintenance packages are also available for ongoing needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who have transformed their business with our {service.name.toLowerCase()} services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Start Your Project
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors">
              Talk to an Expert
            </button>
          </div>
        </section>
      </div>
        <Footer />
    </div>
  );
};

export default ServicePage;