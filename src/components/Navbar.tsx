import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MegaMenuContent } from './MegaMenuContent';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [hideSecondaryMenu, setHideSecondaryMenu] = useState(false);
  const secondaryNavRef = useRef<HTMLDivElement | null>(null);
  const exploreMenuRef = useRef<HTMLDivElement | null>(null);

  // Enhanced MegaMenu component
  const scrollSecondaryNav = (direction: 'left' | 'right') => {
    const scrollAmount = 200;
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

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreMenuRef.current && !exploreMenuRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollPosition(currentScrollY);
      setShowSearchBar(currentScrollY > 100);

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
          title: "Digital Marketing",
          items: ["Social Media Ads", "Email Marketing", "Website Analytics", "SEO Optimization", "Affiliate Marketing"]
        },
        {
          title: "Writing & Translation",
          items: ["Content Writing", "Copywriting", "Translation Services", "Proofreading & Editing", "Grammar & Spelling"]
        },
        {
          title: "Video & Animation",
          items: ["Video Editing", "2D Animation", "3D Animation", "Motion Graphics", "Animated GIFs"]
        },
        {
          title: "Music & Audio",
          items: ["Songwriting", "Music Production", "Audio Editing", "Sound Effects", "Music Licensing"]
        },
      ]
    },
    {
      name: "Data & Analytics",
      sections: [
        {
          title: "Data Analysis",
          items: ["Data Visualization", "Statistical Analysis", "Predictive Analytics", "Data Mining", "Business Intelligence"]
        },
        {
          title: "Market Research",
          items: ["Surveys & Polls", "Competitor Analysis", "Consumer Insights", "Market Trends", "Industry Reports"]
        },
        {
          title: "Database Management",
          items: ["Database Design", "SQL Development", "Data Warehousing", "ETL Processes", "NoSQL Databases"]
        },
        {
          title: "Web Analytics",
          items: ["Google Analytics", "Conversion Rate Optimization", "User Behavior Tracking", "A/B Testing", "Web Performance"]
        },
        {
          title: "AI & Machine Learning",
          items: ["Machine Learning Models", "Natural Language Processing", "Computer Vision", "AI Chatbots", "Deep Learning"]
        }
      ]
    },
    { name: "Business ",
      sections: [
        {
          title: "Business Consulting",
          items: ["Business Planning", "Strategic Planning", "Market Research", "Financial Analysis", "Business Strategy"]
        },
        {
          title: "Sales & Marketing",
          items: ["Email Marketing", "Social Media Marketing", "SEO Optimization", "Content Marketing", "Lead Generation"]
        },
        {
          title: "Customer Support",
          items: ["Customer Service", "Customer Feedback", "Customer Satisfaction", "Customer Retention", "Customer Acquisition"]
        },
        {
          title: "Financial Planning",
          items: ["Budgeting", "Financial Planning", "Tax Planning", "Retirement Planning", "Investment Planning"]
        },
        {
          title: "Legal Services",
          items: ["Contract Writing", "Legal Consulting", "Legal Research", "Legal Documentation", "Legal Compliance"]
        },
      ]
        },
    {
      name: "Finance",
      sections: [
        {
          title: "Accounting Services",
          items: ["Bookkeeping", "Financial Statements", "Tax Preparation", "Payroll Services", "Accounts Payable/Receivable"]
        },
        {
          title: "Financial Analysis",
          items: ["Financial Modeling", "Budgeting & Forecasting", "Variance Analysis", "Cash Flow Management", "Cost Analysis"]
        },
        {
          title: "Investment Consulting",
          items: ["Portfolio Management", "Investment Strategy", "Risk Assessment", "Market Research", "Retirement Planning"]
        },
        {
          title: "Tax Consulting",
          items: ["Tax Planning", "Tax Compliance", "International Taxation", "Sales Tax Consulting", "IRS Representation"]
        },
        {
          title: "Business Valuation",
          items: ["Business Appraisal", "Mergers & Acquisitions", "Due Diligence", "Valuation Reports", "Exit Strategy"]
        }
      ]
    },
    {
      name: "Video & Animation",
      sections: [
        {
          title: "Video Production",
          items: ["Video Editing", "Cinematography", "Scriptwriting", "Storyboarding", "Post-Production"]
        },
        {
          title: "Animation",
          items: ["2D Animation", "3D Animation", "Motion Graphics", "Character Animation", "Stop Motion"]
        },
        {
          title: "Live Streaming",
          items: ["Live Event Streaming", "Webinars", "Virtual Events", "Live Q&A Sessions", "Interactive Streaming"]
        },
        {
          title: "Video Marketing",
          items: ["Video SEO", "YouTube Marketing", "Social Media Video Ads", "Video Content Strategy", "Video Analytics"]
        },
        {
          title: "Voice Over",
          items: ["Narration", "Character Voices", "Commercial Voice Overs", "Podcast Voice Overs", "Audiobook Narration"]
        }
      ]
    },
    {
      name: "Programming & Tech",
      sections: [
        {          title: "Software Development",
          items: ["Custom Software", "Web Applications", "Mobile Apps", "Desktop Applications", "API Development"]
        },
        {          title: "Data Science",
          items: ["Data Analysis", "Machine Learning", "Data Visualization", "Big Data", "AI Development"]
        },
        {
          title: "Cybersecurity",
          items: ["Penetration Testing", "Network Security", "Application Security", "Incident Response", "Security Audits"]
        },
        {
          title: "Cloud Computing",
          items: ["AWS", "Azure", "Google Cloud", "Cloud Migration", "Cloud Security"]
        },
        {
          title: "Blockchain",
          items: ["Smart Contracts", "DApps", "Blockchain Development", "Cryptocurrency Consulting", "NFT Development"]
        }
      ]
    },
    {
      name: "Digital Marketing",
      sections: [
        {          title: "SEO & SEM",
          items: ["Search Engine Optimization", "Pay-Per-Click Advertising", "Keyword Research", "Link Building", "Local SEO"]
        },
        {          title: "Social Media Marketing",
          items: ["Social Media Management", "Content Creation", "Influencer Marketing", "Social Media Advertising", "Analytics"]
        },
        {
          title: "Content Marketing",
          items: ["Blog Writing", "Content Strategy", "Copywriting", "Content Distribution", "Content Optimization"]
        },
        {
          title: "Email Marketing",
          items: ["Email Campaigns", "Newsletter Design", "List Building", "Email Automation", "Analytics"]
        },
        {
          title: "Affiliate Marketing",
          items: ["Affiliate Program Setup", "Affiliate Management", "Affiliate Analytics", "Affiliate Training", "Affiliate Tools"]
        }
      ]
    },
    {
      name: "Writing & Translation",
      sections: [
        {          title: "Writing Services",
          items: ["Content Writing", "Blog Writing", "Article Writing", "Press Release Writing", "Editorial Writing"]
        },
        {          title: "Translation Services",
          items: ["English to Spanish", "Spanish to English", "French to English", "German to English", "Portuguese to English"]
        },
        {
          title: "Editing & Proofreading",
          items: ["Grammar Checking", "Spelling Checking", "Punctuation Checking", "Style Checking", "Formatting"]
        },
        {
          title: "Transcription Services",
          items: ["Audio to Text", "Video to Text", "Document to Text", "Text to Audio", "Text to Video"]
        },
        {
          title: "Creative Writing",
          items: ["Fiction Writing", "Non-Fiction Writing", "Poetry Writing", "Script Writing", "Storytelling"] 
        } 
      ]
    },
    {
      name: "AI Services",
      sections: [
        {
          title: "AI Development",
          items: ["Custom AI Solutions", "Machine Learning Models", "Natural Language Processing", "Computer Vision", "AI Chatbots"]
        },
        {
          title: "AI Content Creation",
          items: ["AI-Generated Text", "AI Art Generation", "AI Music Composition", "AI Video Creation", "AI-Powered SEO"]
        },
        {
          title: "AI Consulting",
          items: ["AI Strategy", "AI Implementation", "AI Training", "AI Ethics Consulting", "AI Performance Optimization"]
        },
        {
          title: "AI Tools & Resources",
          items: ["AI APIs", "AI Frameworks", "AI Datasets", "AI Libraries", "AI Tutorials"]
        },
        {
          title: "AI Research",
          items: ["AI Trends Analysis", "AI Market Research", "AI Whitepapers", "AI Case Studies", "AI Conferences"]
        }
      ]
    }

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
              <div 
                className="relative"
                ref={exploreMenuRef}
                onMouseEnter={() => {
                  setIsExploreOpen(true);
                  setHideSecondaryMenu(true);
                }}
                onMouseLeave={() => {
                  setIsExploreOpen(false);
                  setHideSecondaryMenu(false);
                }}
              >
                <button 
                  className="text-gray-600 hover:text-skillforge-primary transition-colors"
                  onClick={() => {
                    setIsExploreOpen(!isExploreOpen);
                    setHideSecondaryMenu(!isExploreOpen);
                  }}
                >
                  Explore
                </button>
                
                {isExploreOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/blog"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-skillforge-primary"
                    >
                      Blog
                    </Link>
                    <Link
                      to="/explore-skills"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-skillforge-primary"
                    >
                      Explore Skills
                    </Link>
                  </div>
                )}
              </div>

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
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-gray-600 hover:text-skillforge-primary">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-2 py-2 bg-white shadow-lg rounded-md animate-fade-in">
              <div className="px-4 py-2">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search services..."
                    className="h-10 w-full rounded-md border border-input pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-skillforge-primary"
                  />
                </div>

                {/* Explore Dropdown */}
                <div className="mb-4">
                  <button 
                    onClick={() => setIsExploreOpen(!isExploreOpen)}
                    className="flex items-center justify-between w-full py-2 text-gray-600 hover:text-skillforge-primary"
                  >
                    <span>Explore</span>
                    {isExploreOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                  </button>
                  
                  {isExploreOpen && (
                    <div className="pl-4 mt-2 space-y-2">
                      <Link 
                        to="/blog" 
                        className="block py-1 text-sm text-gray-700 hover:text-skillforge-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Blog
                      </Link>
                      <Link 
                        to="/explore-skills" 
                        className="block py-1 text-sm text-gray-700 hover:text-skillforge-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Explore Skills
                      </Link>
                    </div>
                  )}
                </div>

                <Link 
                  to="/premium-services" 
                  className="block py-2 text-gray-600 hover:text-skillforge-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  WorkVix Premium
                </Link>
                <Link 
                  to="/become-seller" 
                  className="block py-2 text-gray-600 hover:text-skillforge-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Become a Seller
                </Link>
                <Link 
                  to="/signin" 
                  className="block py-2 text-gray-600 hover:text-skillforge-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/join" 
                  className="block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full bg-skillforge-primary hover:bg-skillforge-primary/90 mt-2">
                    Join
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Categories Navigation (Desktop) */}
          <div className="hidden md:block border-t">
            {!hideSecondaryMenu && (
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
            )}
          </div>
        </div>
      </header>

      {/* Fixed secondary navigation that can appear on scroll */}
      {showSecondaryNav && !hideSecondaryMenu && (
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