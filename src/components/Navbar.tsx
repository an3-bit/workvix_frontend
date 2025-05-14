
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo */}
            <a href="/" className="flex items-center mr-10">
              <span className="text-2xl font-bold text-skillforge-primary">Skill<span className="text-skillforge-secondary">Forge</span></span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="nav-link">Graphics & Design</a>
              <a href="#" className="nav-link">Digital Marketing</a>
              <a href="#" className="nav-link">Writing & Translation</a>
              <a href="#" className="nav-link">Programming</a>
              <a href="#" className="nav-link">Video & Animation</a>
            </nav>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-skillforge-primary transition-colors">Become a Seller</a>
            <a href="#" className="text-gray-600 hover:text-skillforge-primary transition-colors">Sign In</a>
            <Button className="bg-skillforge-primary hover:bg-skillforge-primary/90">Join</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-gray-600 hover:text-skillforge-primary">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-2 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="px-2 py-1 text-gray-600 hover:text-skillforge-primary">Graphics & Design</a>
              <a href="#" className="px-2 py-1 text-gray-600 hover:text-skillforge-primary">Digital Marketing</a>
              <a href="#" className="px-2 py-1 text-gray-600 hover:text-skillforge-primary">Writing & Translation</a>
              <a href="#" className="px-2 py-1 text-gray-600 hover:text-skillforge-primary">Programming</a>
              <a href="#" className="px-2 py-1 text-gray-600 hover:text-skillforge-primary">Video & Animation</a>
              <hr className="my-2" />
              <a href="#" className="px-2 py-1 text-gray-600 hover:text-skillforge-primary">Become a Seller</a>
              <a href="#" className="px-2 py-1 text-gray-600 hover:text-skillforge-primary">Sign In</a>
              <Button className="bg-skillforge-primary hover:bg-skillforge-primary/90 w-full">Join</Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
