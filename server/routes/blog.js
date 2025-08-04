import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { getBlogPosts, getBlogPost, getBlogCategories, searchBlogPosts } from '../controllers/blogController.js';

const router = express.Router();

// WordPress proxy middleware
const wordpressProxy = createProxyMiddleware({
  target: 'https://workvix.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/wordpress': '/wp-json/wp/v2'
  },
  onProxyRes: function (proxyRes, req, res) {
    // Add CORS headers to the proxied response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
  }
});

// WordPress proxy route
router.use('/wordpress', wordpressProxy);

// Blog API routes
router.get('/posts', getBlogPosts);
router.get('/posts/:slug', getBlogPost);
router.get('/categories', getBlogCategories);
router.get('/search', searchBlogPosts);

export default router; 