import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MegaMenuContent } from './MegaMenuContent';

// Enhanced MegaMenu component
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const secondaryNavRef = useRef<HTMLDivElement | null>(null);

  // Enhanced MegaMenu component
  const scrollSecondaryNav = (direction: 'left' | 'right') => {
    const scrollAmount = 200; // Adjust scroll amount as needed
    if (secondaryNavRef.current) {
      const container = secondaryNavRef.current;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setScrollPosition(currentScrollY);
    setShowSearchBar(currentScrollY > 100);

    // Show secondary nav when scrolling UP, hide when scrolling DOWN
    if (currentScrollY < lastScrollY) {
      setShowSecondaryNav(true);
    } else if (currentScrollY > lastScrollY) {
      setShowSecondaryNav(false);
    }

    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);

  // Main navigation categories data
  const mainCategories = [
    {
      name: "Graphics & Design",
      sections: [
        {
          title: "Logo & Brand Identity",
          items: ["Logo Design", "Brand Style Guides", "Business Cards & Stationery", "Fonts & Typography", "Logo Maker Tool"]
        },
        {
          title: "Art & Illustration",
          items: ["Illustration", "AI Artists", "AI Avatar Design", "Portraits & Caricatures", "Cartoons & Comics"]
        },
        {
          title: "Web & App Design",
          items: ["Website Design", "App Design", "UX Design", "Landing Page Design", "Icon Design"]
        },
        {
          title: "Product & Gaming",
          items: ["Industrial & Product Design", "Character Modeling", "Game Art", "Graphics for Streamers"]
        },
        {
          title: "Visual Design",
          items: ["Image Editing", "Presentation Design", "Background Removal", "Infographic Design", "Vector Tracing"]
        },
        {
          title: "Print Design",
          items: ["Flyer Design", "Brochure Design", "Poster Design", "Catalog Design", "Menu Design"]
        }
      ]
    },
    {
      name: "Programming & Tech",
      sections: [
        {
          title: "Website Development",
          items: ["WordPress", "Shopify", "Wix", "Custom Websites", "E-commerce Development"]
        },
        {
          title: "Web Programming",
          items: ["JavaScript", "PHP", "Python", "Ruby", "Java"]
        },
        {
          title: "Application Development",
          items: ["Mobile Apps", "Desktop Applications", "Web Applications", "Game Development", "API Development"]
        },
        {
          title: "E-Commerce",
          items: ["Shopify", "WooCommerce", "BigCommerce", "Magento", "OpenCart"]
        },
        {
          title: "Data & Analytics",
          items: ["Data Analysis", "Data Visualization", "Database Design", "Big Data", "Machine Learning"]
        },
        {
          title: "Technical Services",
          items: ["DevOps", "Support & IT", "Cybersecurity", "Blockchain & Cryptocurrency", "QA Testing"]
        }
      ]
    },
    {
      name: "Digital Marketing",
      sections: [
        {
          title: "Search",
          items: ["Search Engine Optimization (SEO)", "Local SEO", "E-Commerce SEO", "Video SEO", "SEO Audit"]
        },
        {
          title: "Social Media",
          items: ["Social Media Marketing", "Facebook Ads", "Instagram Marketing", "TikTok Shop", "LinkedIn Marketing"]
        },
        {
          title: "Paid Advertising",
          items: ["Google Ads", "Display Advertising", "PPC Management", "Retargeting", "Social Media Advertising"]
        },
        {
          title: "Marketing Strategy",
          items: ["Marketing Strategy", "Marketing Plans", "Brand Strategy", "Content Strategy", "Growth Marketing"]
        },
        {
          title: "Email & Automation",
          items: ["Email Marketing", "Marketing Automation", "Drip Campaigns", "Email Templates", "Lead Generation"]
        },
        {
          title: "Analytics & Optimization",
          items: ["Web Analytics", "Conversion Rate Optimization", "A/B Testing", "User Testing", "Marketing Analytics"]
        }
      ]
    },
    {
      name: "Video & Animation",
      sections: [
        {
          title: "Video Production",
          items: ["Video Editing", "Video Production", "Short Video Ads", "Video Trailers", "Explainer Videos"]
        },
        {
          title: "Animation",
          items: ["Character Animation", "Logo Animation", "3D Animation", "Motion Graphics", "Animated GIFs"]
        },
        {
          title: "Streaming & Audio",
          items: ["Live Action Explainers", "Unboxing Videos", "Product Photography", "Screencasting", "eLearning Videos"]
        },
        {
          title: "Special Effects",
          items: ["Visual Effects", "VFX", "Special Effects", "3D Modeling", "Rigging"]
        },
        {
          title: "Production Elements",
          items: ["Intros & Outros", "Visual Effects", "Subtitles & Captions", "Sound Effects", "Voice Over"]
        },
        {
          title: "Social & Marketing Videos",
          items: ["Social Media Videos", "Instagram Videos", "YouTube Videos", "TikTok Videos", "Facebook Videos"]
        }
      ]
    },
    {
      name: "Writing & Translation",
      sections: [
        {
          title: "Content Writing",
          items: ["Articles & Blog Posts", "Website Content", "Creative Writing", "Product Descriptions", "SEO Writing"]
        },
        {
          title: "Books & eBooks",
          items: ["Book Design", "Book Covers", "Book Layout Design & Typesetting", "Children's Book Illustration"]
        },
        {
          title: "Translation",
          items: ["General Translation", "Legal Translation", "Technical Translation", "Medical Translation", "Marketing Translation"]
        },
        {
          title: "Business Writing",
          items: ["Business Plans", "Grant Writing", "Technical Writing", "Case Studies", "White Papers"]
        },
        {
          title: "Editing & Proofreading",
          items: ["Proofreading", "Editing", "Content Reviews", "Fact Checking", "Grammar Checks"]
        },
        {
          title: "UX Writing",
          items: ["Microcopy", "User Guides", "App Content", "Product Descriptions", "Landing Page Copy"]
        }
      ]
    },
    {
      name: "Music & Audio",
      sections: [
        {
          title: "Music",
          items: ["Music Production", "Vocals & Singers", "Mixing & Mastering", "Session Musicians", "Songwriting"]
        },
        {
          title: "Audio Services",
          items: ["Voice Over", "Podcast Production", "Audio Editing", "Sound Effects", "Audio Ads"]
        },
        {
          title: "Music Lessons",
          items: ["Guitar Lessons", "Piano Lessons", "Vocal Lessons", "DJ Lessons", "Composition"]
        },
        {
          title: "Production",
          items: ["Producers & Composers", "Beats", "Jingles & Intros", "Audio Logo", "Audio Mixing"]
        },
        {
          title: "Streaming & Podcasts",
          items: ["Podcast Editing", "Podcast Marketing", "Streaming Production", "Audiobook Production", "Sound Design"]
        },
        {
          title: "Music Promotion",
          items: ["Music Promotion", "Music Marketing", "Spotify Promotion", "SoundCloud Promotion", "YouTube Music Promotion"]
        }
      ]
    },
    {
      name: "Business",
      sections: [
        {
          title: "Business Planning",
          items: ["Business Plans", "Market Research", "Business Consulting", "Financial Consulting", "Legal Consulting"]
        },
        {
          title: "Business Operations",
          items: ["Virtual Assistant", "Data Entry", "Customer Service", "E-Commerce Management", "Project Management"]
        },
        {
          title: "Sales & Marketing",
          items: ["Lead Generation", "Sales Funnel", "CRM Management", "Sales Copywriting", "Email Marketing"]
        },
        {
          title: "Administrative Support",
          items: ["Administrative Support", "Data Entry", "Customer Service", "Technical Support", "Office Management"]
        },
        {
          title: "Career Development",
          items: ["Resume Writing", "Cover Letters", "LinkedIn Profiles", "Job Search", "Career Counseling"]
        },
        {
          title: "Financial Services",
          items: ["Accounting", "Tax Preparation", "Financial Analysis", "Bookkeeping", "Financial Planning"]
        }
      ]
    },
    {
      name: "Finance",
      sections: [
        {
          title: "Accounting & Bookkeeping",
          items: ["Bookkeeping", "Financial Statements", "Tax Preparation", "Payroll", "QuickBooks"]
        },
        {
          title: "Financial Analysis",
          items: ["Financial Modeling", "Valuation", "Investment Analysis", "Risk Management", "Portfolio Management"]
        },
        {
          title: "Business Consulting",
          items: ["Business Plans", "Market Research", "Financial Consulting", "Legal Consulting", "Management Consulting"]
        },
        {
          title: "Investment & Trading",
          items: ["Stock Trading", "Forex Trading", "Cryptocurrency Trading", "Options Trading", "Investment Strategies"]
        },
        {
          title: "Tax Services",
          items: ["Tax Preparation", "Tax Planning", "IRS Representation", "State Taxes", "International Taxes"]
        },
        {
          title: "Insurance Services",
          items: ["Life Insurance", "Health Insurance", "Auto Insurance", "Home Insurance", "Business Insurance"]
        }
      ]
    },
    {
      name: "AI Services",
      sections: [
        {
          title: "AI Content Generation",
          items: ["AI Writing", "AI Art Generation", "AI Music Generation", "AI Video Generation", "AI Voice Generation"]
        },
        { 
          title: "AI Writing",
          items: ["AI Writing", "AI Content Writing", "AI Blog Writing", "AI Product Writing", "AI Technical Writing"]
        },
        {
          title: "AI Art Generation",
          items: ["AI Art Generation", "AI Portrait Generation", "AI Landscape Generation", "AI Animal Generation", "AI Portrait Generation"]
        },
        {
          title: "AI Music Generation",
          items: ["AI Music Generation", "AI Songwriting", "AI Music Composition", "AI Music Production", "AI Music Mixing"]
        },
        {
          title: "AI Video Generation",
          items: ["AI Video Generation", "AI Animation", "AI Video Editing", "AI Video Production", "AI Video Marketing"]
        },
        {
          title: "AI Voice Generation",
          items: ["AI Voice Generation", "AI Voice Over", "AI Voice Cloning", "AI Voice Synthesis", "AI Voice Recognition"]
        }
      ]
    },
    
  ];

  // For the mobile menu, we'll use a simplified version of categories
  const mobileCategories = mainCategories.map(category => ({
    name: category.name,
    subcategories: category.sections.slice(0, 2).flatMap(section => section.items.slice(0, 3))
  }));

  return (
    <>
      <header className={`sticky top-0 z-50 w-full bg-white shadow-sm transition-all duration-300 ${showSearchBar ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4">
          {/* Main Navbar */}
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center mr-10">
                <span className="text-2xl font-bold text-skillforge-primary">work<span className="text-orange-500 text-workvix-primary">vix</span></span>
              </Link>

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
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger
          className="text-gray-600 hover:text-skillforge-primary transition-colors bg-transparent z-[60]"
          onClick={() => setIsExploreOpen(prev => !prev)}
        >
          Explore
        </NavigationMenuTrigger>

        <NavigationMenuContent className="p-4 bg-white shadow-md rounded-md z-[60] border">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link to="/blog" className="text-sm text-gray-700 hover:text-skillforge-primary">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/explore-skills" className="text-sm text-gray-700 hover:text-skillforge-primary">
                Explore Skills
              </Link>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>

  <Link to="/premium-services" className="text-gray-600 hover:text-skillforge-primary transition-colors">
    <span className="text-2xl  text-skillforge-primary">work<span className="text-orange-500 text-workvix-primary">vix</span></span> Pro
  </Link>
  <Link to="/become-seller" className="text-gray-600 hover:text-skillforge-primary transition-colors">
    Become a Seller
  </Link>
  <Link to="/signin" className="text-gray-600 hover:text-skillforge-primary transition-colors">
    Sign In
  </Link>
  <Link to="/join">
    <Button className="bg-skillforge-primary hover:bg-skillforge-primary/90">Join</Button>
  </Link>
</div>

            {/* Mobile Menu Button */}
            <div className="md:hidden  w-full flex items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
  <button onClick={toggleMenu} className="text-gray-600 hover:text-skillforge-primary ">
    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
  </button>

  {isMenuOpen && (
    <div className="mt-4 space-y-4 bg-white shadow-lg p-4 rounded-md">
      {/* Explore Dropdown Items */}
      <div>
        <span className="block text-gray-600 font-medium">Explore</span>
        <div className="pl-4 mt-2 space-y-2">
          <Link to="/blog" className="block text-sm text-gray-700 hover:text-skillforge-primary">
            Blog
          </Link>
          <Link to="/explore-skills" className="block text-sm text-gray-700 hover:text-skillforge-primary">
            Explore Skills
          </Link>
        </div>
      </div>

      <Link to="/premium-services" className="block text-gray-600 hover:text-skillforge-primary">
        WorkVix Premium
      </Link>

      <Link to="/become-seller" className="block text-gray-600 hover:text-skillforge-primary">
        Become a Seller
      </Link>

      <Link to="/signin" className="block text-gray-600 hover:text-skillforge-primary">
        Sign In
      </Link>

      <Link to="/join">
        <Button className="w-full bg-skillforge-primary hover:bg-skillforge-primary/90 mt-2">
          Join
        </Button>
      </Link>
    </div>
  )}
</div>

          {/* Categories Navigation (Desktop) - Fiverr-like style */}
          <div className="hidden md:block border-t">
            <NavigationMenu className="w-full">
              <NavigationMenuList className="flex justify-between py-2">
                {mainCategories.map((category) => (
                  <NavigationMenuItem key={category.name}>
                    <NavigationMenuTrigger 
                      className="text-sm font-normal bg-transparent hover:bg-transparent hover:text-skillforge-primary z-[40]"
                      onMouseEnter={() => setActiveCategory(category.name)}
                    >
                      {category.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="z-[40]">
                      <MegaMenuContent sections={category.sections} />
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
                
                <Link to="/blog" className="px-2 py-1 text-gray-600 hover:text-skillforge-primary">Blog</Link>
                
                {mobileCategories.map((category) => (
                  <div key={category.name} className="px-2 py-1">
                    <div className="font-medium text-gray-600">{category.name}</div>
                    <div className="ml-4 mt-1 flex flex-col space-y-1">
                      {category.subcategories.slice(0, 4).map((subcat) => (
                        <a key={subcat} href="#" className="text-sm text-gray-500 hover:text-skillforge-primary">
                          {subcat}
                        </a>
                      ))}
                      <a href="#" className="text-xs text-skillforge-primary hover:underline">See all...</a>
                    </div>
                  </div>
                ))}
                
                <hr className="my-2" />
                <Link to="/become-seller" className="px-2 py-1 text-gray-600 hover:text-skillforge-primary">Become a Seller</Link>
                <Link to="/signin" className="px-2 py-1 text-gray-600 hover:text-skillforge-primary">Sign In</Link>
                <Link to="/join">
                  <Button className="bg-skillforge-primary hover:bg-skillforge-primary/90 w-full">Join</Button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Fixed secondary navigation that can appear on scroll */}
     {showSecondaryNav && (
        <div 
          ref={secondaryNavRef}
          className="fixed top-0 left-0 right-0 z-30 bg-white shadow-md transform transition-all duration-300 animate-fade-in"
          style={{ top: '80px' }} 
        >
          <div className="container mx-auto px-4">
            <div className="hidden md:flex items-center justify-between py-3 overflow-x-auto">
              <NavigationMenu className="w-full">
                <NavigationMenuList className="flex space-x-6 w-full justify-between">
                  {mainCategories.map((category) => (
                    <NavigationMenuItem key={category.name}>
                      <NavigationMenuTrigger 
                        className="whitespace-nowrap px-1 text-sm font-medium text-gray-700 hover:text-skillforge-primary transition-colors border-b-2 border-transparent hover:border-skillforge-primary bg-transparent hover:bg-transparent z-[30]"
                        onMouseEnter={() => setActiveCategory(category.name)}
                      >
                        {category.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="z-[30]">
                        <MegaMenuContent sections={category.sections} />
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
