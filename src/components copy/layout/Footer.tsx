
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-soko-green to-soko-orange bg-clip-text text-transparent">
              SurplusSoko
            </h3>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Empowering Kenyan Farmers Through Accessible, Tech-Driven Market Linkages
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-gray-500 hover:text-soko-green">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-soko-green">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-soko-green">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Navigate</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/" className="text-sm text-gray-600 hover:text-soko-orange">Home</Link></li>
                <li><Link to="/how-it-works" className="text-sm text-gray-600 hover:text-soko-orange">How It Works</Link></li>
                <li><Link to="/impact" className="text-sm text-gray-600 hover:text-soko-orange">Impact</Link></li>
                <li><Link to="/about" className="text-sm text-gray-600 hover:text-soko-orange">About</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-soko-orange">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-gray-600 hover:text-soko-orange">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Contact Us</h3>
            <ul className="mt-4 space-y-2">
            <li className="flex items-center text-sm text-gray-600">
  <Phone size={16} className="mr-2 text-soko-green" />
  <div className="flex flex-col sm:flex-row sm:space-x-2">
    <a
      href="https://wa.me/254794212696"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline text-soko-green"
    >
      +254 794 212 696
    </a>
    <span className="hidden sm:inline">/</span>
    <a
      href="https://wa.me/254742048713"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline text-soko-green"
    >
      +254 742 048 713
    </a>
  </div>
</li>

              <li className="flex items-center text-sm text-gray-600">
                <Mail size={16} className="mr-2 text-soko-green" />
                <span>contact@surplussoko.co.ke</span>
              </li>
              <li className="flex items-start text-sm text-gray-600">
                <MapPin size={16} className="mr-2 mt-1 text-soko-green" />
                <span>Ngong Lane Plaza, Ngong Rd, Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-200">
          <p className="text-sm text-center text-gray-500">
            © {new Date().getFullYear()} SurplusSoko. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
