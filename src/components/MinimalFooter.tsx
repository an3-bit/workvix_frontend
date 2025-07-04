import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const MinimalFooter = () => (
  <footer className="bg-white border-t py-6 mt-12">
    <div className="container mx-auto flex flex-col items-center gap-3">
      <div className="flex gap-4">
        <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-blue-600"><Facebook className="h-5 w-5" /></a>
        <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-blue-400"><Twitter className="h-5 w-5" /></a>
        <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-pink-500"><Instagram className="h-5 w-5" /></a>
        <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-blue-700"><Linkedin className="h-5 w-5" /></a>
        <a href="#" aria-label="YouTube" className="text-gray-500 hover:text-red-600"><Youtube className="h-5 w-5" /></a>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        &copy; {new Date().getFullYear()} WorkVix. All rights reserved.
      </div>
    </div>
  </footer>
);

export default MinimalFooter; 