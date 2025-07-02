import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, ChevronLeft, ChevronRight, User, Settings, ArrowRight } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MegaMenuContent } from './MegaMenuContent'; // Assuming this component is correctly defined

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSecondaryNav, setShowSecondaryNav] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null); // This will control the mega menu
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [hideSecondaryMenu, setHideSecondaryMenu] = useState(false); // Unused, consider removing if not needed
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const secondaryNavRef = useRef<HTMLDivElement | null>(null);
  const exploreMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const megaMenuTimeoutRef = useRef<number | null>(null); // To manage hover delays
  const heroRef = useRef<HTMLElement | null>(null);
  const categoriesRef = useRef<HTMLElement | null>(null);
  const prevShowSecondaryNav = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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
    // Close search when opening menu
    if (!isMenuOpen) {
      setIsSearchOpen(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Close menu when opening search
    if (!isSearchOpen) {
      setIsMenuOpen(false);
    }
  };

  // Handle click outside to close mobile menu and search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exploreMenuRef.current && !exploreMenuRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen, isSearchOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setShowSearchBar(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Show secondary nav only when Hero is out of view (regardless of Categories)
  useEffect(() => {
    heroRef.current = document.getElementById('hero-section') as HTMLElement;
    const heroSection = heroRef.current;
    if (!heroSection) return;

    let heroInView = true;

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroSection) {
            heroInView = entry.isIntersecting;
          }
        });
        setShowSecondaryNav(!heroInView);
      },
      {
        root: null,
        threshold: 0.1,
      }
    );
    observer.observe(heroSection);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Always scroll secondary nav to left when it appears (with timeout for rendering)
  useEffect(() => {
    if (showSecondaryNav && secondaryNavRef.current) {
      setTimeout(() => {
        if (secondaryNavRef.current) {
          secondaryNavRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }, 20);
    }
  }, [showSecondaryNav]);

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
      name: "Programming & Tech",
      sections: [
        {
          title: "Web & App Development",
          items: ["Website Development", "Mobile App Development", "E-commerce Development", "CMS Development", "API Integration"]
        },
        {
          title: "Software & IT",
          items: ["Custom Software", "DevOps & Cloud", "QA & Testing", "Cybersecurity", "Database Management"]
        },
        {
          title: "Game Development",
          items: ["Game Design", "Unity & Unreal", "2D/3D Games", "AR/VR Development", "Game Art"]
        },
        {
          title: "Other Tech",
          items: ["Chatbots", "Scripts & Automation", "Tech Support", "IoT", "Blockchain"]
        }
      ]
    },
    {
      name: "Digital Marketing",
      sections: [
        {
          title: "Social Media",
          items: ["Social Media Marketing", "Influencer Marketing", "Content Marketing", "Community Management", "Social Media Ads"]
        },
        {
          title: "SEO & SEM",
          items: ["SEO", "SEM", "Local SEO", "E-commerce SEO", "App Store Optimization"]
        },
        {
          title: "Email & Direct Marketing",
          items: ["Email Marketing", "SMS Marketing", "Newsletter", "Cold Outreach", "Marketing Automation"]
        },
        {
          title: "Other Marketing",
          items: ["Affiliate Marketing", "Video Marketing", "PR & Outreach", "Market Research", "Brand Strategy"]
        }
      ]
    },
    {
      name: "Video & Animation",
      sections: [
        {
          title: "Video Production",
          items: ["Video Editing", "Short Video Ads", "Animated Explainers", "Product Videos", "Spokesperson Videos"]
        },
        {
          title: "Animation",
          items: ["2D Animation", "3D Animation", "Whiteboard Animation", "Logo Animation", "GIF Animation"]
        },
        {
          title: "Other Video",
          items: ["Subtitles & Captions", "Visual Effects", "Video Marketing", "Slideshow Videos", "Book Trailers"]
        }
      ]
    },
    {
      name: "Writing & Translation",
      sections: [
        {
          title: "Writing",
          items: ["Articles & Blog Posts", "Website Content", "Product Descriptions", "Book Writing", "Creative Writing"]
        },
        {
          title: "Translation",
          items: ["Translation", "Localization", "Transcription", "Proofreading", "Editing"]
        },
        {
          title: "Other Writing",
          items: ["Resume Writing", "Cover Letters", "Technical Writing", "Press Releases", "Beta Reading"]
        }
      ]
    },
    {
      name: "Music & Audio",
      sections: [
        {
          title: "Music Production",
          items: ["Producers & Composers", "Mixing & Mastering", "Vocal Tuning", "Session Musicians", "Songwriting"]
        },
        {
          title: "Audio Services",
          items: ["Voice Over", "Podcast Editing", "Audiobook Production", "Sound Design", "Jingles & Intros"]
        },
        {
          title: "Other Audio",
          items: ["Music Lessons", "DJ Drops & Tags", "Audio Ads", "Meditation Music", "Remixing"]
        }
      ]
    },
    {
      name: "Business",
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
      name: "Lifestyle",
      sections: [
        {
          title: "Wellness & Fitness",
          items: ["Fitness Lessons", "Life Coaching", "Nutrition Advice", "Meditation", "Personal Training"]
        },
        {
          title: "Arts & Crafts",
          items: ["Craft Lessons", "Drawing & Painting", "DIY Projects", "Sewing", "Calligraphy"]
        },
        {
          title: "Other Lifestyle",
          items: ["Family & Genealogy", "Travel Planning", "Cooking Lessons", "Relationship Advice", "Spiritual & Healing"]
        }
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
    {
      name: "Photography",
      sections: [
        {
          title: "Photography Services",
          items: ["Portrait Photography", "Product Photography", "Event Photography", "Photo Editing", "Real Estate Photography"]
        },
        {
          title: "Other Photography",
          items: ["Drone Photography", "Pet Photography", "Nature Photography", "Photo Restoration", "Photography Lessons"]
        }
      ]
    },
    {
      name: "End-to-End Projects",
      sections: [
        {
          title: "Project Types",
          items: ["Website Projects", "App Projects", "Branding Projects", "Marketing Projects", "Video Projects"]
        },
        {
          title: "Other Projects",
          items: ["Business Plans", "E-commerce Projects", "Consulting Projects", "Design Projects", "Custom Projects"]
        }
      ]
    },
    {
      name: "AI Services",
      sections: [
        {
          title: "AI Solutions",
          items: ["AI Chatbots", "AI Content Creation", "AI Art & Design", "Machine Learning", "Other AI Services"]
        }
      ]
    }
  ];

  // Helper to find sections for a given category name
  const findCategorySections = (categoryName: string) => {
    const category = mainCategories.find(cat => cat.name === categoryName);
    return category ? category.sections : [];
  };

  const handleMouseEnterCategory = (categoryName: string) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    setActiveCategory(categoryName);
  };

  const handleMouseLeaveSecondaryNav = () => {
    megaMenuTimeoutRef.current = window.setTimeout(() => {
      setActiveCategory(null);
    }, 200); // Small delay to allow moving between links without closing
  };

  const handleMouseEnterMegaMenu = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
  };


  // For the mobile menu, we'll use a simplified version of categories
  const mobileCategories = mainCategories.map(category => ({
    name: category.name,
    subcategories: category.sections.slice(0, 2).flatMap(section => section.items.slice(0, 3))
  }));

  return (
    <>
      {/* Main Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-2 ${
          scrollPosition > 50 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
            : 'bg-white'
        }`}
        style={{ top: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-6 sm:h-8">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="text-2xl sm:text-3xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500 group-hover:from-green-700 group-hover:to-orange-600 transition-all duration-300">
                  WorkVix
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <div className="relative" ref={exploreMenuRef}>
                <button
                  onMouseEnter={() => setIsExploreOpen(true)}
                  onMouseLeave={() => setIsExploreOpen(false)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium"
                >
                  <span>Explore</span>
                  <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExploreOpen ? 'rotate-90' : ''}`} />
                </button>
                {isExploreOpen && (
                  <div
                    onMouseEnter={() => setIsExploreOpen(true)}
                    onMouseLeave={() => setIsExploreOpen(false)}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 p-2"
                  >
                    <Link to="/blog" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded">Blog</Link>
                    <Link to="/explore-skills" className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded">Explore Skills</Link>
                  </div>
                )}
              </div>
              <Link to="/join" className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium">
                Browse Jobs
              </Link>
              <Link to="/premium-services" className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500 font-medium transition-colors duration-200">
                WorkVix Pro
              </Link>
              <Link to="/become-seller" className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-medium">
                Become a Seller
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search Bar */}
              <form
                className="flex max-w-xs w-full"
                style={{ minWidth: 0 }}
                onSubmit={e => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="search-input rounded-l-md border-r-0"
                  style={{ minWidth: 0 }}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button rounded-l-none rounded-r-md flex items-center justify-center">
                  <Search className="h-4 w-4" />
                </button>
              </form>
              {/* Auth Buttons */}
              <Link to="/signin">
                <Button className="bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Sign In
                </Button>
              </Link>
              <Link to="/join">
                <Button className="bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <div 
              ref={mobileMenuRef}
              className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="text-xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-500">
                      WorkVix
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Navigation Links */}
                  <div className="space-y-4">
                    <Link 
                      to="/jobs" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-lg font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
                    >
                      Browse Jobs
                    </Link>
                    <Link 
                      to="/explore-skills" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-lg font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
                    >
                      Explore Skills
                    </Link>
                    <Link 
                      to="/blog" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-lg font-medium text-gray-700 hover:text-green-600 transition-colors duration-200"
                    >
                      Blog
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100" />

                  {/* Auth Section */}
                  <div className="space-y-4">
                    <Link 
                      to="/signin" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:border-green-600 hover:text-green-600 transition-all duration-200 font-medium"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/join" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full text-center py-3 px-4 bg-gradient-to-r from-green-600 to-orange-500 hover:from-green-700 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spacer for fixed navbar */}
        <div className="h-6 sm:h-8" />

        {/* Secondary Navigation Bar with Mega Menus */}
        {showSecondaryNav && (
          <nav 
            className="w-full bg-white border-b border-gray-100 shadow-sm z-40 sticky top-16 sm:top-20"
            onMouseLeave={handleMouseLeaveSecondaryNav}
          >
            <div
              ref={secondaryNavRef}
              className="relative flex overflow-x-auto no-scrollbar whitespace-nowrap px-2 sm:px-8 py-2 gap-2 sm:gap-4 lg:justify-center"
            >
              {/* Trending (no dropdown) */}
              <div className="relative">
                <button className="flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition focus:outline-none">
                  <span className="mr-1">Trending</span> <span role="img" aria-label="fire">🔥</span>
                </button>
              </div>

              {/* Iterate through mainCategories to create secondary nav links */}
              {mainCategories.map((category) => (
                <div key={category.name} className="relative">
                  <button
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition focus:outline-none 
                      ${activeCategory === category.name ? 'bg-green-100 text-green-700' : 'text-gray-700 hover:bg-green-50 hover:text-green-700'}`}
                    onMouseEnter={() => handleMouseEnterCategory(category.name)}
                  >
                    {category.name}
                  </button>
                </div>
              ))}
            </div>

            {/* Mega Menu Content - This will appear based on activeCategory */}
            {activeCategory && (
              <div
                className="absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-lg py-6"
                onMouseEnter={handleMouseEnterMegaMenu}
                onMouseLeave={handleMouseLeaveSecondaryNav}
              >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <MegaMenuContent sections={findCategorySections(activeCategory)} />
                </div>
              </div>
            )}
          </nav>
        )}
      </nav>
    </>
  );
};

export default Navbar;