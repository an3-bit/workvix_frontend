
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
import { MegaMenuContent } from "@/components/MegaMenuContent";

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
      
      // Check if we can find the categories section element
      const categoriesSection = document.getElementById('categories-section');
      
      if (categoriesSection) {
        const categoriesSectionTop = categoriesSection.getBoundingClientRect().top + window.scrollY;
        const categoriesSectionBottom = categoriesSectionTop + categoriesSection.offsetHeight;
        
        // Show secondary nav only when user is at the categories section
        setShowSecondaryNav(
          position >= categoriesSectionTop - window.innerHeight/2 && 
          position < categoriesSectionBottom
        );
      } else {
        // For development/testing, show after scrolling down a bit if section not found
        setShowSecondaryNav(position > 500 && position < 1200);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Add an id to the categories section for easier reference
    const categoriesElement = document.querySelector('.categories-section');
    if (categoriesElement) {
      categoriesElement.id = 'categories-section';
    }
    
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

  // Secondary navigation data with detailed mega menu content
  const secondaryNavItems = [
    {
      name: "Graphics & Design",
      sections: [
        {
          title: "Logo & Brand Identity",
          items: ["Logo Design", "Brand Style Guides", "Business Cards", "Stationery Design", "Fonts & Typography"]
        },
        {
          title: "Web & App Design",
          items: ["Website Design", "App Design", "UX Design", "Landing Page Design", "Icon Design"]
        },
        {
          title: "Visual Design",
          items: ["Image Editing", "Social Media Design", "Presentation Design", "Infographic Design", "Vector Tracing"]
        },
        {
          title: "Print Design",
          items: ["Flyer Design", "Brochure Design", "Poster Design", "Catalog Design", "Menu Design"]
        },
        {
          title: "Packaging & Labels",
          items: ["Packaging Design", "Book Cover Design", "Product Label Design", "Bag & Merchandise Design"]
        },
        {
          title: "Illustration",
          items: ["Character Design", "Pattern Design", "Portraits & Caricatures", "Cartoons & Comics", "Technical Drawing"]
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
      name: "Writing & Translation",
      sections: [
        {
          title: "Content Writing",
          items: ["Articles & Blog Posts", "Website Content", "Creative Writing", "Product Descriptions", "SEO Writing"]
        },
        {
          title: "Business Writing",
          items: ["Business Plans", "Grant Writing", "Technical Writing", "Case Studies", "White Papers"]
        },
        {
          title: "Translation",
          items: ["General Translation", "Legal Translation", "Technical Translation", "Medical Translation", "Marketing Translation"]
        },
        {
          title: "Editing & Proofreading",
          items: ["Proofreading", "Editing", "Content Reviews", "Fact Checking", "Grammar Checks"]
        },
        {
          title: "Book & eBook",
          items: ["Book Writing", "eBook Writing", "Ghost Writing", "Book Editing", "Self Publish Your Book"]
        },
        {
          title: "UX Writing",
          items: ["Microcopy", "User Guides", "App Content", "Product Descriptions", "Landing Page Copy"]
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
      name: "Photography",
      sections: [
        {
          title: "Photography Services",
          items: ["Product Photography", "Portrait Photography", "Event Photography", "Food Photography", "Real Estate Photography"]
        },
        {
          title: "Photo Editing",
          items: ["Photo Retouching", "Image Manipulation", "Background Removal", "Color Correction", "Photo Restoration"]
        },
        {
          title: "Commercial Photography",
          items: ["Product Photography", "Fashion Photography", "Food Photography", "Real Estate Photography", "Architecture Photography"]
        },
        {
          title: "Special Photography",
          items: ["Aerial Photography", "360 Photography", "Corporate Photography", "Stock Photos", "Virtual Photography"]
        },
        {
          title: "Photo Enhancements",
          items: ["Photo Enhancement", "HDR Photos", "Image Manipulation", "Headshot Retouching", "Product Photo Enhancement"]
        },
        {
          title: "Photography Tutorials",
          items: ["Photography Courses", "Photo Editing Tutorials", "Lightroom Presets", "Photography Tips", "Photography Guides"]
        }
      ]
    }
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 w-full bg-white shadow-sm transition-all duration-300 ${showSearchBar ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4">
          {/* Main Navbar */}
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center">
              {/* Logo */}
              <Link to="/" className="flex items-center mr-10">
                <span className="text-2xl font-bold text-skillforge-primary">Skill<span className="text-skillforge-secondary">Forge</span></span>
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
              <Link to="/blog" className="text-gray-600 hover:text-skillforge-primary transition-colors">Blog</Link>
              <Link to="/become-seller" className="text-gray-600 hover:text-skillforge-primary transition-colors">Become a Seller</Link>
              <Link to="/signin" className="text-gray-600 hover:text-skillforge-primary transition-colors">Sign In</Link>
              <Link to="/join">
                <Button className="bg-skillforge-primary hover:bg-skillforge-primary/90">Join</Button>
              </Link>
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
                
                <Link to="/blog" className="px-2 py-1 text-gray-600 hover:text-skillforge-primary">Blog</Link>
                
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

      {/* Secondary Navigation that appears at the Popular Services section */}
      {showSecondaryNav && (
        <div 
          ref={secondaryNavRef}
          className="fixed left-0 right-0 z-30 bg-white shadow-md transform transition-all duration-300 animate-fade-in"
          style={{ top: '80px' }} // Position it below the main navbar
        >
          <div className="container mx-auto px-4">
            <div className="hidden md:flex items-center justify-between py-3 overflow-x-auto">
              <NavigationMenu className="w-full">
                <NavigationMenuList className="flex space-x-6 w-full justify-between">
                  {secondaryNavItems.map((item) => (
                    <NavigationMenuItem key={item.name}>
                      <NavigationMenuTrigger className="whitespace-nowrap px-1 text-sm font-medium text-gray-700 hover:text-skillforge-primary transition-colors border-b-2 border-transparent hover:border-skillforge-primary bg-transparent hover:bg-transparent">
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <MegaMenuContent sections={item.sections} />
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
