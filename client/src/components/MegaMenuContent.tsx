import React from 'react';
import { Link } from 'react-router-dom';

export const MegaMenuContent = ({ sections, servicesData = [] }) => {
  // Service link creation function
  const createServiceLink = (serviceName: string, categoryName: string) => {
    // Check if servicesData exists and is an array
    if (!servicesData || !Array.isArray(servicesData)) {
      const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
      const serviceSlug = serviceName.toLowerCase().replace(/\s+/g, '-');
      return `/services/${categorySlug}/${serviceSlug}`;
    }

    // Find the actual service in your data
    const service = servicesData.find(s => 
      s.name === serviceName && s.category === categoryName
    );
    
    if (service) {
      const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
      return `/services/${categorySlug}/${service.slug}`;
    }
    
    // Fallback if service not found
    const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    const serviceSlug = serviceName.toLowerCase().replace(/\s+/g, '-');
    return `/services/${categorySlug}/${serviceSlug}`;
  };

  return (
    <div className="w-full bg-white rounded-md shadow-lg py-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item}>
                    <Link 
                      to={createServiceLink(item, section.title)}
                      className="text-sm text-gray-600 hover:text-workvix-primary transition-colors flex items-center"
                    >
                      {item}
                      {item.includes("NEW") && (
                        <span className="ml-2 inline-flex items-center rounded-md bg-pink-50 px-1.5 py-0.5 text-xs font-medium text-pink-700">
                          NEW
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};