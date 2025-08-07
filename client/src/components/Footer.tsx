import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const categories = [
  {
    title: "Categories",
    links: [
      { name: "Graphics & Design", href: "/jobs?category=Graphics%20%26%20Design" },
      { name: "Digital Marketing", href: "/jobs?category=Digital%20Marketing" },
      { name: "Writing & Translation", href: "/jobs?category=Writing%20%26%20Translation" },
      { name: "Video & Animation", href: "/jobs?category=Video%20%26%20Animation" },
      { name: "Music & Audio", href: "/jobs?category=Music%20%26%20Audio" },
      { name: "Programming & Tech", href: "/jobs?category=Programming%20%26%20Tech" },
      { name: "Business", href: "/jobs?category=Business" },
      { name: "Lifestyle", href: "/jobs?category=Lifestyle" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "Careers", href: "/careers" },
      { name: "Press & News", href: "/press" },
      { name: "Partnerships", href: "/partnerships" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Intellectual Property", href: "/ip" },
      { name: "Investor Relations", href: "/investors" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help & Support", href: "/help" },
      { name: "Trust & Safety", href: "/trust" },
      { name: "Selling on WorkVix", href: "/become-seller" },
      { name: "Buying on WorkVix", href: "/explore-skills" },
      { name: "Affiliate Program", href: "/affiliate/register" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Customer Success Stories", href: "/success-stories" },
      { name: "Community Hub", href: "/community" },
      { name: "Forum", href: "/forum" },
      { name: "Events", href: "/events" },
      { name: "Blog", href: "/blog" },
      { name: "Influencers", href: "/influencers" },
      { name: "Affiliates", href: "/affiliate/register" },
    ],
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-bold text-white">
                work<span className="text-orange-500">vix</span>
              </span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Connect with talented freelancers worldwide. Get your projects done quickly and professionally.
            </p>
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-3 text-orange-500" />
                <span className="text-sm">support@workvix.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-3 text-orange-500" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-3 text-orange-500" />
                <span className="text-sm">Global Platform</span>
              </div>
            </div>
          </div>
          {/* Categories */}
          {categories.map((category) => (
            <div key={category.title}>
              <h3 className="font-semibold text-lg mb-6 text-white">{category.title}</h3>
              <ul className="space-y-3">
                {category.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-gray-300 hover:text-orange-500 transition-colors duration-200 text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="font-semibold text-lg mb-4 text-white">Stay Updated</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Get the latest updates on new features and freelancing opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} WorkVix. All rights reserved.
               
              </p>
            </div>
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a 
                href="https://www.facebook.com/workvix" 
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-800"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/workvix" 
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-800"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/workvix" 
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-800"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/workvix"
                className="transition-colors duration-200 p-2 rounded-full hover:bg-gray-800"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#0077b5',
                    color: '#fff',
                    fontWeight: 900,
                    fontFamily: 'Arial Black, Arial, sans-serif',
                    fontSize: '1.35rem',
                    letterSpacing: '-0.08em',
                    lineHeight: 1,
                    textAlign: 'center',
                    userSelect: 'none',
                  }}
                >
                  in
                </span>
              </a>
              <a 
                href="https://www.youtube.com/@workvix" 
                className="text-gray-400 hover:text-orange-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-800"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          {/* Additional Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6 pt-6 border-t border-gray-800">
            <Link to="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm">
              Cookie Policy
            </Link>
            <Link to="/accessibility" className="text-gray-400 hover:text-orange-500 transition-colors duration-200 text-sm">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile App Download Section */}
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-white mb-2">Get the WorkVix App</h3>
              <p className="text-gray-300 text-sm">
                Download our mobile app for a better experience
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors duration-200">
                <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button className="flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors duration-200">
                <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
