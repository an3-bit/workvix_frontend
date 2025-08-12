// src/data/servicesData.ts

export interface Service {
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  description: string;
  detailedDescription: string;
  image: string;
  features: string[];
  pricing: {
    starting: string;
    popular: string;
    premium: string;
  };
  deliveryTime: string;
  tags: string[];
}

export const servicesData: Service[] = [
  // ===== Graphics & Design =====
  // Logo & Brand Identity
  {
    slug: "logo-design",
    name: "Logo Design",
    category: "Graphics & Design",
    subcategory: "Logo & Brand Identity",
    description: "Custom logo designs that capture your brand's essence and stand out in any market.",
    detailedDescription: "Get a professional logo design that perfectly represents your brand identity. Our expert designers create memorable, scalable logos that work across all platforms - from business cards to billboards. We provide multiple concepts, unlimited revisions, and all file formats you need.",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    features: [
      "Multiple logo concepts",
      "Unlimited revisions",
      "All file formats (AI, EPS, PNG, JPG, SVG)",
      "Brand guidelines included",
      "Commercial usage rights",
      "Vector and raster formats"
    ],
    pricing: {
      starting: "$25",
      popular: "$75",
      premium: "$150"
    },
    deliveryTime: "3-7 days",
    tags: ["logo", "branding", "identity", "graphic design", "business logo", "startup logo"]
  },
  {
    slug: "brand-style-guides",
    name: "Brand Style Guides",
    category: "Graphics & Design",
    subcategory: "Logo & Brand Identity",
    description: "Comprehensive brand style guides to maintain consistent visual identity across all platforms.",
    detailedDescription: "Establish a strong brand presence with our comprehensive style guides. We create detailed documentation covering logo usage, color palettes, typography, imagery style, and brand voice guidelines to ensure consistency across all your marketing materials.",
    image: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg",
    features: [
      "Logo usage guidelines",
      "Color palette specifications",
      "Typography guidelines",
      "Brand voice documentation",
      "Application examples",
      "Digital and print specifications"
    ],
    pricing: {
      starting: "$50",
      popular: "$150",
      premium: "$300"
    },
    deliveryTime: "5-10 days",
    tags: ["brand guidelines", "style guide", "brand identity", "corporate identity", "branding"]
  },
  {
    slug: "business-cards-stationery",
    name: "Business Cards & Stationery",
    category: "Graphics & Design",
    subcategory: "Logo & Brand Identity",
    description: "Professional business cards and stationery designs that make lasting impressions.",
    detailedDescription: "Create professional business cards and stationery that reflect your brand's quality and attention to detail. We design business cards, letterheads, envelopes, and other corporate stationery with print-ready files and multiple layout options.",
    image: "https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg",
    features: [
      "Business card design",
      "Letterhead design",
      "Envelope design",
      "Print-ready files",
      "Multiple layout options",
      "Premium paper recommendations"
    ],
    pricing: {
      starting: "$15",
      popular: "$45",
      premium: "$95"
    },
    deliveryTime: "2-5 days",
    tags: ["business cards", "stationery", "corporate design", "print design", "professional"]
  },
  {
    slug: "fonts-typography",
    name: "Fonts & Typography",
    category: "Graphics & Design",
    subcategory: "Logo & Brand Identity",
    description: "Custom fonts and typography solutions tailored to your brand personality.",
    detailedDescription: "Develop unique typography solutions that enhance your brand's voice. From custom font creation to typography pairing recommendations, we help you establish a distinctive typographic identity that resonates with your audience.",
    image: "https://images.pexels.com/photos/276467/pexels-photo-276467.jpeg",
    features: [
      "Custom font creation",
      "Typography pairing",
      "Font licensing guidance",
      "Web font optimization",
      "Typography guidelines",
      "Multiple font weights"
    ],
    pricing: {
      starting: "$30",
      popular: "$100",
      premium: "$250"
    },
    deliveryTime: "7-14 days",
    tags: ["typography", "custom fonts", "font design", "typeface", "lettering"]
  },
  {
    slug: "logo-maker-tool",
    name: "Logo Maker Tool",
    category: "Graphics & Design",
    subcategory: "Logo & Brand Identity",
    description: "Easy-to-use online logo maker tools for instant professional logo creation.",
    detailedDescription: "Access our intuitive logo maker tool to create professional logos instantly. Choose from thousands of templates, customize colors and fonts, and download your logo in multiple formats. Perfect for startups and small businesses on a budget.",
    image: "https://images.pexels.com/photos/590037/pexels-photo-590037.jpeg",
    features: [
      "Thousands of templates",
      "Drag-and-drop editor",
      "Instant download",
      "Multiple file formats",
      "Color customization",
      "Icon library access"
    ],
    pricing: {
      starting: "$5",
      popular: "$15",
      premium: "$35"
    },
    deliveryTime: "Instant",
    tags: ["logo maker", "DIY logo", "logo generator", "online tool", "instant logo"]
  },

  // Programming & Tech - Web & App Development
  {
    slug: "website-development",
    name: "Website Development",
    category: "Programming & Tech",
    subcategory: "Web & App Development",
    description: "Professional website development services from landing pages to complex web applications.",
    detailedDescription: "Get a custom website built with modern technologies and best practices. We develop responsive, fast-loading websites optimized for search engines and user experience. From simple landing pages to complex web applications, we deliver solutions that drive results.",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg",
    features: [
      "Responsive design",
      "SEO optimization",
      "Fast loading speeds",
      "Modern technologies",
      "Cross-browser compatibility",
      "Mobile-first approach"
    ],
    pricing: {
      starting: "$5",
      popular: "$100",
      premium: "$500"
    },
    deliveryTime: "7-30 days",
    tags: ["website development", "web design", "responsive design", "HTML", "CSS", "JavaScript"]
  },
  {
    slug: "mobile-app-development",
    name: "Mobile App Development",
    category: "Programming & Tech",
    subcategory: "Web & App Development",
    description: "Native and cross-platform mobile app development for iOS and Android.",
    detailedDescription: "Transform your ideas into powerful mobile applications. We develop native iOS and Android apps, as well as cross-platform solutions using React Native and Flutter. Our apps are user-friendly, secure, and optimized for performance.",
    image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg",
    features: [
      "Native iOS/Android development",
      "Cross-platform solutions",
      "App Store optimization",
      "User-friendly interfaces",
      "Backend integration",
      "Performance optimization"
    ],
    pricing: {
      starting: "$500",
      popular: "$2000",
      premium: "$8000"
    },
    deliveryTime: "14-60 days",
    tags: ["mobile app", "iOS development", "Android development", "React Native", "Flutter"]
  },
  {
    slug: "ecommerce-development",
    name: "E-commerce Development",
    category: "Programming & Tech",
    subcategory: "Web & App Development",
    description: "Complete e-commerce solutions with secure payment processing and inventory management.",
    detailedDescription: "Build a successful online store with our comprehensive e-commerce development services. We create secure, scalable online shops with payment gateway integration, inventory management, and customer management systems.",
    image: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg",
    features: [
      "Payment gateway integration",
      "Inventory management",
      "Customer accounts",
      "Order management",
      "SSL security",
      "Mobile optimization"
    ],
    pricing: {
      starting: "$300",
      popular: "$1200",
      premium: "$4000"
    },
    deliveryTime: "10-45 days",
    tags: ["ecommerce", "online store", "shopping cart", "payment integration", "WooCommerce", "Shopify"]
  },

  // Digital Marketing - Social Media
  {
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    category: "Digital Marketing",
    subcategory: "Social Media",
    description: "Comprehensive social media marketing strategies to grow your online presence and engagement.",
    detailedDescription: "Boost your brand's social media presence with our strategic marketing services. We create engaging content, manage your social accounts, run targeted ad campaigns, and provide detailed analytics to maximize your ROI across all major platforms.",
    image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg",
    features: [
      "Content strategy development",
      "Account management",
      "Targeted advertising",
      "Community engagement",
      "Analytics and reporting",
      "Multi-platform management"
    ],
    pricing: {
      starting: "$100",
      popular: "$400",
      premium: "$1200"
    },
    deliveryTime: "Ongoing",
    tags: ["social media", "Facebook marketing", "Instagram marketing", "Twitter marketing", "LinkedIn marketing"]
  },
  {
    slug: "influencer-marketing",
    name: "Influencer Marketing",
    category: "Digital Marketing",
    subcategory: "Social Media",
    description: "Connect with relevant influencers to amplify your brand reach and credibility.",
    detailedDescription: "Leverage the power of influencer marketing to reach new audiences and build trust. We identify, connect, and manage relationships with influencers who align with your brand values and target audience.",
    image: "https://images.pexels.com/photos/3059654/pexels-photo-3059654.jpeg",
    features: [
      "Influencer identification",
      "Campaign strategy",
      "Content collaboration",
      "Performance tracking",
      "ROI measurement",
      "Long-term partnerships"
    ],
    pricing: {
      starting: "$150",
      popular: "$600",
      premium: "$2000"
    },
    deliveryTime: "7-30 days",
    tags: ["influencer marketing", "brand partnerships", "social influence", "content collaboration"]
  },

  // Writing & Translation - Writing
  {
    slug: "content-writing",
    name: "Content Writing",
    category: "Writing & Translation",
    subcategory: "Writing",
    description: "High-quality, SEO-optimized content for blogs, websites, and digital marketing.",
    detailedDescription: "Get compelling, well-researched content that engages your audience and ranks well in search engines. Our experienced writers create blog posts, articles, website copy, and marketing content tailored to your brand voice and objectives.",
    image: "https://images.pexels.com/photos/261579/pexels-photo-261579.jpeg",
    features: [
      "SEO optimization",
      "Original research",
      "Brand voice alignment",
      "Engaging headlines",
      "Call-to-action integration",
      "Plagiarism-free content"
    ],
    pricing: {
      starting: "$10",
      popular: "$50",
      premium: "$150"
    },
    deliveryTime: "1-7 days",
    tags: ["content writing", "blog writing", "SEO content", "article writing", "copywriting"]
  },
  {
    slug: "copywriting",
    name: "Copywriting",
    category: "Writing & Translation",
    subcategory: "Writing",
    description: "Persuasive copywriting that converts readers into customers and drives action.",
    detailedDescription: "Transform your marketing with compelling copy that sells. Our copywriters craft persuasive sales pages, email campaigns, ad copy, and marketing materials that connect with your audience and drive conversions.",
    image: "https://images.pexels.com/photos/356043/pexels-photo-356043.jpeg",
    features: [
      "Sales page copy",
      "Email campaigns",
      "Ad copy creation",
      "Landing page copy",
      "Product descriptions",
      "Conversion optimization"
    ],
    pricing: {
      starting: "$25",
      popular: "$100",
      premium: "$300"
    },
    deliveryTime: "2-10 days",
    tags: ["copywriting", "sales copy", "email marketing", "ad copy", "conversion copywriting"]
  },

  // Video & Animation - Video Production
  {
    slug: "video-editing",
    name: "Video Editing",
    category: "Video & Animation",
    subcategory: "Video Production",
    description: "Professional video editing services for engaging content across all platforms.",
    detailedDescription: "Transform raw footage into polished, professional videos that captivate your audience. Our video editors provide color correction, audio enhancement, transitions, effects, and optimized output for any platform or purpose.",
    image: "https://images.pexels.com/photos/320617/pexels-photo-320617.jpeg",
    features: [
      "Color correction",
      "Audio enhancement",
      "Smooth transitions",
      "Visual effects",
      "Multiple format export",
      "Platform optimization"
    ],
    pricing: {
      starting: "$20",
      popular: "$100",
      premium: "$400"
    },
    deliveryTime: "2-10 days",
    tags: ["video editing", "video production", "YouTube videos", "promotional videos", "social media videos"]
  },
  {
    slug: "2d-animation",
    name: "2D Animation",
    category: "Video & Animation",
    subcategory: "Animation",
    description: "Creative 2D animation videos for branding, education, and entertainment purposes.",
    detailedDescription: "Bring your ideas to life with custom 2D animations that tell your story effectively. From explainer videos to character animations, we create engaging animated content that simplifies complex concepts and entertains your audience.",
    image: "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg",
    features: [
      "Custom character design",
      "Explainer videos",
      "Motion graphics",
      "Storyboard creation",
      "Voiceover sync",
      "Multiple resolutions"
    ],
    pricing: {
      starting: "$50",
      popular: "$300",
      premium: "$1000"
    },
    deliveryTime: "5-20 days",
    tags: ["2D animation", "explainer videos", "animated videos", "motion graphics", "character animation"]
  },

  // Music & Audio - Music Production
  {
    slug: "songwriting",
    name: "Songwriting",
    category: "Music & Audio",
    subcategory: "Music Production",
    description: "Original songwriting services to create memorable music for your projects.",
    detailedDescription: "Get original songs written specifically for your project, brand, or personal use. Our talented songwriters create lyrics and melodies that resonate with your target audience and convey your intended message effectively.",
    image: "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg",
    features: [
      "Original lyrics",
      "Melody composition",
      "Multiple revisions",
      "Genre flexibility",
      "Demo recording",
      "Commercial rights"
    ],
    pricing: {
      starting: "$50",
      popular: "$200",
      premium: "$500"
    },
    deliveryTime: "3-14 days",
    tags: ["songwriting", "original music", "lyrics", "melody", "custom songs", "music composition"]
  },
  {
    slug: "music-production",
    name: "Music Production",
    category: "Music & Audio",
    subcategory: "Music Production",
    description: "Complete music production services from composition to final mastering.",
    detailedDescription: "Get professional music production services that bring your musical vision to life. From initial composition to final mastering, we handle every aspect of music production with industry-standard equipment and techniques.",
    image: "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg",
    features: [
      "Full composition",
      "Professional recording",
      "Mixing and mastering",
      "Multiple format delivery",
      "Unlimited revisions",
      "Commercial licensing"
    ],
    pricing: {
      starting: "$100",
      popular: "$500",
      premium: "$1500"
    },
    deliveryTime: "7-30 days",
    tags: ["music production", "recording", "mixing", "mastering", "original music", "audio production"]
  },

  // Business - Business Consulting
  {
    slug: "business-planning",
    name: "Business Planning",
    category: "Business",
    subcategory: "Business Consulting",
    description: "Comprehensive business plans to guide your company's growth and secure funding.",
    detailedDescription: "Develop a roadmap for success with our professional business planning services. We create detailed business plans that include market analysis, financial projections, competitive analysis, and strategic recommendations to help you achieve your goals.",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    features: [
      "Executive summary",
      "Market analysis",
      "Financial projections",
      "Competitive analysis",
      "Marketing strategy",
      "Implementation timeline"
    ],
    pricing: {
      starting: "$200",
      popular: "$800",
      premium: "$2000"
    },
    deliveryTime: "7-21 days",
    tags: ["business plan", "business strategy", "market analysis", "financial planning", "startup planning"]
  },

  // Data & Analytics - Data Analysis
  {
    slug: "data-visualization",
    name: "Data Visualization",
    category: "Data & Analytics",
    subcategory: "Data Analysis",
    description: "Transform complex data into clear, actionable visual insights and interactive dashboards.",
    detailedDescription: "Make your data tell a story with professional data visualization services. We create interactive dashboards, charts, and infographics that make complex information easy to understand and act upon.",
    image: "https://images.pexels.com/photos/669622/pexels-photo-669622.jpeg",
    features: [
      "Interactive dashboards",
      "Custom charts and graphs",
      "Infographic design",
      "Real-time data updates",
      "Multiple data sources",
      "Export capabilities"
    ],
    pricing: {
      starting: "$75",
      popular: "$300",
      premium: "$800"
    },
    deliveryTime: "3-14 days",
    tags: ["data visualization", "dashboards", "charts", "infographics", "data analysis", "business intelligence"]
  },

  // Photography - Photography Services
  {
    slug: "product-photography",
    name: "Product Photography",
    category: "Photography",
    subcategory: "Photography Services",
    description: "Professional product photography that showcases your items in the best light.",
    detailedDescription: "Increase your sales with stunning product photography that highlights your items' best features. Our photographers use professional lighting and styling to create images that convert browsers into buyers.",
    image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
    features: [
      "Professional lighting",
      "Multiple angles",
      "Styling assistance",
      "Background removal",
      "High-resolution images",
      "E-commerce optimization"
    ],
    pricing: {
      starting: "$30",
      popular: "$150",
      premium: "$400"
    },
    deliveryTime: "2-7 days",
    tags: ["product photography", "e-commerce photos", "Amazon photos", "commercial photography", "professional photos"]
  },

  // AI Services - AI Solutions
  {
    slug: "ai-chatbots",
    name: "AI Chatbots",
    category: "AI Services",
    subcategory: "AI Solutions",
    description: "Custom AI chatbot development for customer service and business automation.",
    detailedDescription: "Automate customer interactions with intelligent AI chatbots that provide 24/7 support, answer common questions, and guide users through your sales funnel. Our chatbots integrate with your existing systems and learn from interactions.",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
    features: [
      "Natural language processing",
      "24/7 availability",
      "Multi-platform integration",
      "Learning capabilities",
      "Conversation analytics",
      "Seamless handoff to humans"
    ],
    pricing: {
      starting: "$200",
      popular: "$800",
      premium: "$2500"
    },
    deliveryTime: "7-21 days",
    tags: ["AI chatbot", "customer service", "automation", "artificial intelligence", "conversational AI"]
  },
  {
    slug: "ai-content-creation",
    name: "AI Content Creation",
    category: "AI Services",
    subcategory: "AI Solutions",
    description: "Leverage AI to create high-quality content at scale for your marketing needs.",
    detailedDescription: "Scale your content production with AI-powered writing services. We use advanced AI tools to create blog posts, social media content, product descriptions, and marketing copy that maintains your brand voice and engages your audience.",
    image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
    features: [
      "Brand voice training",
      "Multiple content types",
      "SEO optimization",
      "Bulk content generation",
      "Human editing included",
      "Plagiarism checking"
    ],
    pricing: {
      starting: "$25",
      popular: "$150",
      premium: "$500"
    },
    deliveryTime: "1-5 days",
    tags: ["AI content", "automated writing", "content generation", "AI copywriting", "bulk content"]
  }
];

// Helper function to get services by category
export const getServicesByCategory = (category: string) => {
  return servicesData.filter(service => service.category === category);
};

// Helper function to get services by subcategory
export const getServicesBySubcategory = (subcategory: string) => {
  return servicesData.filter(service => service.subcategory === subcategory);
};

// Helper function to get service by slug
export const getServiceBySlug = (slug: string) => {
  return servicesData.find(service => service.slug === slug);
};

// Helper function to get related services
export const getRelatedServices = (currentSlug: string, limit: number = 4) => {
  const currentService = servicesData.find(service => service.slug === currentSlug);
  if (!currentService) return [];
  
  return servicesData
    .filter(service => 
      service.slug !== currentSlug && 
      (service.category === currentService.category || 
       service.subcategory === currentService.subcategory)
    )
    .slice(0, limit);
};