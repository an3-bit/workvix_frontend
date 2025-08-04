import axios from 'axios';
import { logger } from '../utils/logger.js';

const WORDPRESS_API_BASE = 'https://workvix.com/wp-json/wp/v2';

// @desc    Get all blog posts
// @route   GET /api/blog/posts
// @access  Public
export const getBlogPosts = async (req, res) => {
  try {
    const { per_page = 12, page = 1 } = req.query;
    
    const response = await axios.get(`${WORDPRESS_API_BASE}/posts`, {
      params: {
        _embed: true,
        per_page,
        page
      }
    });

    const posts = response.data.map(post => ({
      id: post.id,
      title: post.title?.rendered || 'Untitled',
      excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '',
      content: post.content?.rendered || '',
      category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized',
      date: new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      readTime: Math.ceil((post.content?.rendered?.length || 0) / 200) + ' min read',
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
             'https://via.placeholder.com/600x400?text=WorkVix+Blog',
      author: {
        name: post._embedded?.author?.[0]?.name || 'WorkVix Team',
        avatar: post._embedded?.author?.[0]?.avatar_urls?.['48'] || 
               'https://via.placeholder.com/48?text=WV'
      },
      link: post.link || `https://workvix.com/blog/${post.slug}`,
      slug: post.slug
    }));

    res.json({
      success: true,
      data: posts,
      pagination: {
        total: parseInt(response.headers['x-wp-total'] || 0),
        totalPages: parseInt(response.headers['x-wp-totalpages'] || 0),
        currentPage: parseInt(page),
        perPage: parseInt(per_page)
      }
    });
  } catch (error) {
    logger.error('Error fetching blog posts:', error);
    
    // Return fallback data
    const fallbackPosts = [
      {
        id: 1,
        title: "The Power of Voiceovers in Social Media Marketing: A Guide for Digital Marketing Students",
        excerpt: "Discover how voiceovers can transform your social media content and boost engagement...",
        content: "In our visually-obsessed digital landscape...",
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
      }
    ];

    res.json({
      success: true,
      data: fallbackPosts,
      message: 'Using fallback data due to WordPress API issues'
    });
  }
};

// @desc    Get single blog post
// @route   GET /api/blog/posts/:slug
// @access  Public
export const getBlogPost = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const response = await axios.get(`${WORDPRESS_API_BASE}/posts`, {
      params: {
        slug,
        _embed: true
      }
    });

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const post = response.data[0];
    const formattedPost = {
      id: post.id,
      title: post.title?.rendered || 'Untitled',
      excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '',
      content: post.content?.rendered || '',
      category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized',
      date: new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      readTime: Math.ceil((post.content?.rendered?.length || 0) / 200) + ' min read',
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
             'https://via.placeholder.com/600x400?text=WorkVix+Blog',
      author: {
        name: post._embedded?.author?.[0]?.name || 'WorkVix Team',
        avatar: post._embedded?.author?.[0]?.avatar_urls?.['48'] || 
               'https://via.placeholder.com/48?text=WV'
      },
      link: post.link || `https://workvix.com/blog/${post.slug}`,
      slug: post.slug
    };

    res.json({
      success: true,
      data: formattedPost
    });
  } catch (error) {
    logger.error('Error fetching blog post:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog post'
    });
  }
};

// @desc    Get blog categories
// @route   GET /api/blog/categories
// @access  Public
export const getBlogCategories = async (req, res) => {
  try {
    const response = await axios.get(`${WORDPRESS_API_BASE}/categories`);
    
    const categories = response.data.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: cat.count,
      slug: cat.slug
    }));

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    logger.error('Error fetching blog categories:', error);
    
    // Return fallback categories
    const fallbackCategories = [
      { id: 1, name: "Freelancing", count: 10, slug: "freelancing" },
      { id: 2, name: "Business", count: 8, slug: "business" },
      { id: 3, name: "Marketing", count: 5, slug: "marketing" },
      { id: 4, name: "Design", count: 12, slug: "design" },
      { id: 5, name: "Development", count: 15, slug: "development" },
      { id: 6, name: "Digital Marketing", count: 7, slug: "digital-marketing" }
    ];

    res.json({
      success: true,
      data: fallbackCategories,
      message: 'Using fallback data due to WordPress API issues'
    });
  }
};

// @desc    Search blog posts
// @route   GET /api/blog/search
// @access  Public
export const searchBlogPosts = async (req, res) => {
  try {
    const { q, per_page = 12 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const response = await axios.get(`${WORDPRESS_API_BASE}/posts`, {
      params: {
        search: q,
        _embed: true,
        per_page
      }
    });

    const posts = response.data.map(post => ({
      id: post.id,
      title: post.title?.rendered || 'Untitled',
      excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '',
      content: post.content?.rendered || '',
      category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized',
      date: new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      readTime: Math.ceil((post.content?.rendered?.length || 0) / 200) + ' min read',
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
             'https://via.placeholder.com/600x400?text=WorkVix+Blog',
      author: {
        name: post._embedded?.author?.[0]?.name || 'WorkVix Team',
        avatar: post._embedded?.author?.[0]?.avatar_urls?.['48'] || 
               'https://via.placeholder.com/48?text=WV'
      },
      link: post.link || `https://workvix.com/blog/${post.slug}`,
      slug: post.slug
    }));

    res.json({
      success: true,
      data: posts,
      searchQuery: q,
      total: parseInt(response.headers['x-wp-total'] || 0)
    });
  } catch (error) {
    logger.error('Error searching blog posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching blog posts'
    });
  }
}; 