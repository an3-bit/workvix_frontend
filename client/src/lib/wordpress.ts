// WordPress API utility functions for WorkVix blog integration

// WordPress API base URL - direct connection for production
const WORDPRESS_API_BASE = 'https://workvix.com/wp-json/wp/v2';

export interface WordPressPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  link: string;
  slug: string;
}

export interface WordPressCategory {
  id: number;
  name: string;
  count: number;
  slug: string;
}

/**
 * Fetch blog posts from WordPress API
 */
export const fetchWordPressPosts = async (perPage: number = 12): Promise<WordPressPost[]> => {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/posts?_embed&per_page=${perPage}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('WordPress API is not returning JSON. REST API might be disabled.');
    }
    
    const data = await response.json();
    
    return data.map((post: any) => {
      // Extract featured image
      const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                           post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
                           'https://via.placeholder.com/600x400?text=WorkVix+Blog';
      
      // Extract category
      const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';
      
      // Calculate read time based on content length
      const contentLength = post.content?.rendered?.length || 0;
      const readTime = Math.ceil(contentLength / 200) + ' min read';
      
      // Extract excerpt
      const excerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || 
                     post.content?.rendered?.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
      
      return {
        id: post.id,
        title: post.title?.rendered || 'Untitled',
        excerpt: excerpt,
        content: post.content?.rendered || '',
        category: category,
        date: new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        readTime: readTime,
        image: featuredImage,
        author: {
          name: post._embedded?.author?.[0]?.name || 'WorkVix Team',
          avatar: post._embedded?.author?.[0]?.avatar_urls?.['48'] || 
                 'https://via.placeholder.com/48?text=WV'
        },
        link: post.link || `https://workvix.com/blog/${post.slug}`,
        slug: post.slug
      };
    });
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    
    // Return fallback data if WordPress API is unavailable
    return [
      {
        id: 1,
        title: "The Power of Voiceovers in Social Media Marketing: A Guide for Digital Marketing Students",
        excerpt: "Discover how voiceovers can transform your social media content and boost engagement. Learn practical tips for creating compelling voice content that converts...",
        content: `<p>In our visually-obsessed digital landscape, where every brand is fighting for eyeball real estate with increasingly creative content, voice has become the secret sauce that transforms good content into "wait, let me watch that again" content.</p>
        <p>Voiceovers are ubiquitous in social media; product demonstrations actually demonstrating something useful, explainers explaining in a way that doesn't lead you into an existential crisis, storytimes that make boring experiences sound exciting, tutorials that don't make you want to chuck your phone, ads that don't make your skin crawl the moment you have to press the skip button and even the memes that are somehow more entertaining when they're done as a voiceover.</p>
        <h2>The Power of Voiceovers In Social Media Marketing</h2>
        <h3>They Humanize Content</h3>
        <p>At a time when brands end up sounding as though they were scripted by robot committees, a sincere, human voiceover is equivalent to having an actual individual in customer service.</p>
        <h3>Give A Boost To Engagement Like A Triple Caffeine Shot</h3>
        <p>Voiceovers keep people on-screen longer than background music or texts overlays – it's what makes one read or simply see what your project is about.</p>
        <h3>Drive Conversions (The Ultimate Goal)</h3>
        <p>The voice-based call-to-action, such as "Swipe Up" or "Click The Link In Bio", is more psychologically heavy than the instructions defined in written form.</p>`,
        category: "Digital Marketing",
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        readTime: "8 min read",
        image: "https://via.placeholder.com/600x400?text=Voiceover+Marketing",
        author: {
          name: "WorkVix Team",
          avatar: "https://via.placeholder.com/48?text=WV"
        },
        link: "https://workvix.com/blog/the-power-of-voiceovers-in-social-media-marketing-a-guide-for-digital-marketing-students/",
        slug: "the-power-of-voiceovers-in-social-media-marketing-a-guide-for-digital-marketing-students"
      },
      {
        id: 2,
        title: "Getting Started with Freelancing",
        excerpt: "Learn the essential steps to begin your freelancing journey and build a successful career...",
        content: "Freelancing offers incredible opportunities for those who want to work independently...",
        category: "Freelancing",
        date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        readTime: "5 min read",
        image: "https://via.placeholder.com/600x400?text=Freelancing+Guide",
        author: {
          name: "WorkVix Team",
          avatar: "https://via.placeholder.com/48?text=WV"
        },
        link: "https://workvix.com/blog/getting-started-freelancing",
        slug: "getting-started-freelancing"
      },
      {
        id: 2,
        title: "Building Your Online Portfolio",
        excerpt: "Create a compelling portfolio that showcases your skills and attracts potential clients...",
        content: "Your portfolio is often the first impression potential clients have of your work...",
        category: "Business",
        date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        readTime: "4 min read",
        image: "https://via.placeholder.com/600x400?text=Portfolio+Tips",
        author: {
          name: "WorkVix Team",
          avatar: "https://via.placeholder.com/48?text=WV"
        },
        link: "https://workvix.com/blog/building-portfolio",
        slug: "building-portfolio"
      },
      {
        id: 3,
        title: "Effective Client Communication",
        excerpt: "Master the art of professional communication to build lasting client relationships...",
        content: "Clear and professional communication is the foundation of successful client relationships...",
        category: "Business",
        date: new Date(Date.now() - 172800000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        readTime: "6 min read",
        image: "https://via.placeholder.com/600x400?text=Communication+Skills",
        author: {
          name: "WorkVix Team",
          avatar: "https://via.placeholder.com/48?text=WV"
        },
        link: "https://workvix.com/blog/client-communication",
        slug: "client-communication"
      }
    ];
  }
};

/**
 * Fetch categories from WordPress API
 */
export const fetchWordPressCategories = async (): Promise<WordPressCategory[]> => {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      count: cat.count,
      slug: cat.slug
    }));
  } catch (error) {
    console.error('Error fetching WordPress categories:', error);
    // Return fallback categories
    return [
      { id: 1, name: "Freelancing", count: 10, slug: "freelancing" },
      { id: 2, name: "Business", count: 8, slug: "business" },
      { id: 3, name: "Marketing", count: 5, slug: "marketing" },
      { id: 4, name: "Design", count: 12, slug: "design" },
      { id: 5, name: "Development", count: 15, slug: "development" },
      { id: 6, name: "Music & Audio", count: 7, slug: "music-audio" },
    ];
  }
};

/**
 * Fetch posts by category
 */
export const fetchWordPressPostsByCategory = async (categorySlug: string, perPage: number = 12): Promise<WordPressPost[]> => {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/posts?categories=${categorySlug}&_embed&per_page=${perPage}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((post: any) => {
      // Same mapping logic as fetchWordPressPosts
      const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                           post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
                           'https://via.placeholder.com/600x400?text=WorkVix+Blog';
      
      const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';
      
      const contentLength = post.content?.rendered?.length || 0;
      const readTime = Math.ceil(contentLength / 200) + ' min read';
      
      const excerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || 
                     post.content?.rendered?.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
      
      return {
        id: post.id,
        title: post.title?.rendered || 'Untitled',
        excerpt: excerpt,
        content: post.content?.rendered || '',
        category: category,
        date: new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        readTime: readTime,
        image: featuredImage,
        author: {
          name: post._embedded?.author?.[0]?.name || 'WorkVix Team',
          avatar: post._embedded?.author?.[0]?.avatar_urls?.['48'] || 
                 'https://via.placeholder.com/48?text=WV'
        },
        link: post.link || `https://workvix.com/blog/${post.slug}`,
        slug: post.slug
      };
    });
  } catch (error) {
    console.error('Error fetching WordPress posts by category:', error);
    throw error;
  }
};

/**
 * Search posts
 */
export const searchWordPressPosts = async (searchTerm: string, perPage: number = 12): Promise<WordPressPost[]> => {
  try {
    const response = await fetch(`${WORDPRESS_API_BASE}/posts?search=${encodeURIComponent(searchTerm)}&_embed&per_page=${perPage}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.map((post: any) => {
      // Same mapping logic as fetchWordPressPosts
      const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                           post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url ||
                           'https://via.placeholder.com/600x400?text=WorkVix+Blog';
      
      const category = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized';
      
      const contentLength = post.content?.rendered?.length || 0;
      const readTime = Math.ceil(contentLength / 200) + ' min read';
      
      const excerpt = post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || 
                     post.content?.rendered?.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
      
      return {
        id: post.id,
        title: post.title?.rendered || 'Untitled',
        excerpt: excerpt,
        content: post.content?.rendered || '',
        category: category,
        date: new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        readTime: readTime,
        image: featuredImage,
        author: {
          name: post._embedded?.author?.[0]?.name || 'WorkVix Team',
          avatar: post._embedded?.author?.[0]?.avatar_urls?.['48'] || 
                 'https://via.placeholder.com/48?text=WV'
        },
        link: post.link || `https://workvix.com/blog/${post.slug}`,
        slug: post.slug
      };
    });
  } catch (error) {
    console.error('Error searching WordPress posts:', error);
    throw error;
  }
}; 