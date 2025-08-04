import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Book, BookOpen, FileText, Search, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  fetchWordPressPosts, 
  fetchWordPressCategories, 
  fetchWordPressPostsByCategory,
  searchWordPressPosts,
  type WordPressPost,
  type WordPressCategory 
} from '@/lib/wordpress';

// Use WordPress types from utility
type BlogPost = WordPressPost;
type BlogCategory = WordPressCategory;

const Blog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [posts, cats] = await Promise.all([
          fetchWordPressPosts(12),
          fetchWordPressCategories()
        ]);
        
        setBlogPosts(posts);
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError('Failed to load blog posts. Please try again later.');
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           post.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Feature articles (first 3 posts)
  const featuredPosts = blogPosts.slice(0, 3);

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName === selectedCategory ? 'all' : categoryName);
  };

  const handleReadMore = (postSlug: string) => {
    navigate(`/blog/${postSlug}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 overflow-hidden">
        {/* Blurred Circles */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              WorkVix <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Blog</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Insights, tips, and strategies for freelancers and businesses
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full rounded-md border border-gray-300 py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-workvix-primary"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workvix-primary mx-auto mb-4"></div>
            <p className="text-lg text-gray-500">Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Unable to load blog posts</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-workvix-primary hover:bg-workvix-primary/90">
              Try Again
            </Button>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {searchTerm && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  Search results for: <span className="text-workvix-primary">{searchTerm}</span>
                </h2>
              </div>
            )}
            
            {selectedCategory !== 'all' && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  Category: <span className="text-workvix-primary">{selectedCategory}</span>
                </h2>
              </div>
            )}
            
            {/* Featured Article (only shown when not searching and no category filter) */}
            {!searchTerm && selectedCategory === 'all' && filteredPosts.length > 0 && (
              <div className="mb-12">
                <Card className="overflow-hidden border-0 shadow-lg">
                  <div className="relative">
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={filteredPosts[0].image} 
                        alt={filteredPosts[0].title}
                        className="object-cover w-full h-full" 
                      />
                    </AspectRatio>
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm shadow-lg">
                        {filteredPosts[0].category}
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl text-gray-900">{filteredPosts[0].title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <img 
                        src={filteredPosts[0].author.avatar} 
                        alt={filteredPosts[0].author.name} 
                        className="h-6 w-6 rounded-full" 
                      />
                      <span>{filteredPosts[0].author.name}</span>
                      <span>•</span>
                      <span>{filteredPosts[0].date}</span>
                      <span>•</span>
                      <span>{filteredPosts[0].readTime}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{filteredPosts[0].excerpt}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleReadMore(filteredPosts[0].link)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      Read More <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(searchTerm || selectedCategory !== 'all' ? filteredPosts : filteredPosts.slice(1)).map((post) => (
                <Card key={post.id} className="overflow-hidden h-full border hover:border-workvix-primary transition-all duration-300">
                  <div className="relative">
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="object-cover w-full h-full" 
                      />
                    </AspectRatio>
                    <div className="absolute top-2 left-2">
                      <span className="bg-workvix-primary/90 text-white px-2 py-0.5 rounded-full text-xs">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-gray-700 text-sm line-clamp-3">{post.excerpt}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name} 
                        className="h-5 w-5 rounded-full" 
                      />
                      <span>{post.author.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {post.readTime}
                    </div>
                  </CardFooter>
                  <div className="px-6 pb-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReadMore(post.slug)}
                      className="w-full"
                    >
                      Read Full Article <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">
                  We couldn't find any articles matching your criteria. Try adjusting your search or category filter.
                </p>
              </div>
            )}
            
            {!searchTerm && selectedCategory === 'all' && filteredPosts.length > 0 && (
              <div className="mt-8 text-center">
                <Button 
                  variant="outline" 
                  className="px-8"
                  onClick={() => window.open('https://workvix.com/blog/', '_blank')}
                >
                  View All Articles on Blog <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Categories */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-workvix-primary" />
                <h3 className="text-lg font-semibold">Categories</h3>
              </div>
              <Separator className="mb-4" />
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleCategoryClick('all')}
                    className={`flex items-center justify-between w-full px-2 py-1.5 text-left transition-colors rounded ${
                      selectedCategory === 'all' ? 'bg-workvix-primary/10 text-workvix-primary' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>All Categories</span>
                    <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-0.5">
                      {blogPosts.length}
                    </span>
                  </button>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <button 
                      onClick={() => handleCategoryClick(category.name)}
                      className={`flex items-center justify-between w-full px-2 py-1.5 text-left transition-colors rounded ${
                        selectedCategory === category.name ? 'bg-workvix-primary/10 text-workvix-primary' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-2 py-0.5">
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Featured Articles */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Book className="h-5 w-5 text-workvix-primary" />
                <h3 className="text-lg font-semibold">Featured Articles</h3>
              </div>
              <Separator className="mb-4" />
              <div className="space-y-4">
                {featuredPosts.map((post) => (
                  <div key={`featured-${post.id}`} className="flex gap-3">
                    <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="object-cover w-full h-full" 
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium line-clamp-2 mb-1">{post.title}</h4>
                      <p className="text-xs text-gray-500">{post.date}</p>
                      <button 
                        onClick={() => handleReadMore(post.link)}
                        className="text-xs text-workvix-primary hover:text-workvix-primary/80 mt-1"
                      >
                        Read more →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="bg-workvix-primary/10 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-workvix-primary" />
                <h3 className="text-lg font-semibold">Newsletter</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Subscribe to our newsletter to get the latest articles and updates.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-workvix-primary"
                />
                <Button className="w-full bg-workvix-primary hover:bg-workvix-primary/90">
                  Subscribe
                </Button>
              </div>
            </div>
            
            {/* Visit Blog */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Visit Our Full Blog</h3>
              <p className="text-sm mb-4 opacity-90">
                Explore more articles, tips, and insights on our WordPress blog.
              </p>
              <Button 
                variant="secondary" 
                className="w-full bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => window.open('https://workvix.com/blog/', '_blank')}
              >
                Go to Blog <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;
