
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Menu, X } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const secondaryNavRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setShowSearchBar(position > 100);
      
      // Check if categoriesSection exists and user has scrolled to it
      const categoriesSection = (window as any).categoriesSection;
      if (categoriesSection) {
        const categoriesSectionTop = categoriesSection.getBoundingClientRect().top + window.scrollY;
        const viewportHeight = window.innerHeight;
        
        // Show secondary nav when user is approaching the categories section
        // Hide it when they've scrolled past it
        if (position >= categoriesSectionTop - viewportHeight/2 && position < categoriesSectionTop + categoriesSection.offsetHeight) {
          setShowSecondaryNav(true);
        } else {
          setShowSecondaryNav(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Category dropdown data
  const categories = [
    {
      name: "Graphics & Design",
      subcategories: ["Logo Design", "Brand Identity", "Web Design", "App Design", "Social Media Design", "Illustration"]
    },
    {
      name: "Digital Marketing",
      subcategories: ["Social Media Marketing", "SEO", "Content Marketing", "Video Marketing", "Email Marketing"]
    },
    {
      name: "Writing & Translation",
      subcategories: ["Articles & Blog Posts", "Website Content", "Creative Writing", "Translation", "Proofreading & Editing"]
    },
    {
      name: "Programming",
      subcategories: ["Website Development", "Mobile Apps", "Game Development", "E-commerce Development", "WordPress"]
    },
    {
      name: "Video & Animation",
      subcategories: ["Video Editing", "Animation", "Logo Animation", "Explainer Videos", "Intros & Outros"]
    }
  ];

  // Secondary navigation data - simplified version of categories for the floating nav
  const secondaryNavItems = [
    "Graphics & Design",
    "Digital Marketing",
    "Writing & Translation",
    "Programming & Tech",
    "Video & Animation",
    "Music & Audio",
    "Business",
    "Photography"
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 w-full bg-white shadow-sm transition-all duration-300 ${showSearchBar ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4">
          {/* Main Navbar */}
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center">
              {/* Logo */}
              <a href="/" className="flex items-center mr-10">
                <span className="text-2xl font-bold text-skillforge-primary">Skill<span className="text-skillforge-secondary">Forge</span></span>
              </a>

              {/* Search bar that appears on scroll */}
              {showSearchBar && (
                <div className="hidden md:flex h-10 max-w-md flex-1 items-center rounded-md border bg-background px-3 animate-fade-in">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-70" />
                  <input 
                    type="search" 
                    placeholder="What service are you looking for today?" 
                    className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" 
                  />
                  <Button size="sm" className="h-7 bg-skillforge-primary">Search</Button>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
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

          {/* Categories Navigation (Desktop) */}
          <div className="hidden md:block border-t">
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="flex justify-between w-full py-2">
                {categories.map((category) => (
                  <NavigationMenuItem key={category.name}>
                    <NavigationMenuTrigger className="text-sm font-normal bg-transparent hover:bg-transparent hover:text-skillforge-primary">
                      {category.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="w-[240px] p-2">
                      <ul className="grid w-full gap-1">
                        {category.subcategories.map((subcat) => (
                          <li key={subcat} className="text-sm">
                            <a
                              href="#"
                              className="block select-none rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                            >
                              {subcat}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 py-2 animate-fade-in">
              <nav className="flex flex-col space-y-4">
                <div className="px-2 py-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="What service are you looking for today?"
                      className="h-10 w-full rounded-md border border-input pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-skillforge-primary"
                    />
                  </div>
                </div>
                
                {categories.map((category) => (
                  <div key={category.name} className="px-2 py-1">
                    <div className="font-medium text-gray-600">{category.name}</div>
                    <div className="ml-4 mt-1 flex flex-col space-y-1">
                      {category.subcategories.slice(0, 3).map((subcat) => (
                        <a key={subcat} href="#" className="text-sm text-gray-500 hover:text-skillforge-primary">
                          {subcat}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
                
                <hr className="my-2" />
                <a href="#" className="px-2 py-1 text-gray-600 hover:text-skillforge-primary">Become a Seller</a>
                <a href="#" className="px-2 py-1 text-gray-600 hover:text-skillforge-primary">Sign In</a>
                <Button className="bg-skillforge-primary hover:bg-skillforge-primary/90 w-full">Join</Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Secondary Navigation that appears at the Popular Services section */}
      {showSecondaryNav && (
        <div 
          ref={secondaryNavRef}
          className="fixed left-0 right-0 z-30 bg-white shadow-md transform transition-all duration-300 animate-fade-in"
          style={{ top: '80px' }} // Position it below the main navbar
        >
          <div className="container mx-auto px-4">
            <div className="hidden md:flex items-center justify-between py-3 overflow-x-auto">
              {secondaryNavItems.map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="whitespace-nowrap px-3 py-1 text-sm font-medium text-gray-700 hover:text-skillforge-primary transition-colors border-b-2 border-transparent hover:border-skillforge-primary"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
