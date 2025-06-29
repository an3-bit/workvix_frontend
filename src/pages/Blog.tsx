import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Book, BookOpen, FileText, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Blog post type definition
type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
};

const WORDPRESS_API = 'https://demo.wp-api.org/wp-json/wp/v2/posts?_embed'; // Placeholder WordPress API

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(WORDPRESS_API);
        const data = await res.json();
        const posts: BlogPost[] = data.map((post: any) => ({
          id: post.id,
          title: post.title.rendered,
          excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, ''),
          category: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Uncategorized',
          date: new Date(post.date).toLocaleDateString(),
          readTime: '5 min read', // Placeholder
          image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://via.placeholder.com/600x400',
          author: {
            name: post._embedded?.author?.[0]?.name || 'Unknown',
            avatar: post._embedded?.author?.[0]?.avatar_urls?.['48'] || 'https://via.placeholder.com/48'
          }
        }));
        setBlogPosts(posts);
      } catch (err) {
        setBlogPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categories for sidebar
  const categories = [
    { name: "Freelancing", count: 10 },
    { name: "Business", count: 8 },
    { name: "Hiring", count: 6 },
    { name: "Marketing", count: 5 },
    { name: "Design", count: 12 },
    { name: "Development", count: 15 },
    { name: "Trends", count: 7 },
  ];

  // Feature articles
  const featuredPosts = blogPosts.slice(0, 3);

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
              Workvix <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Blog</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Insights, tips, and strategies for freelancers and businesses
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full rounded-md border border-gray-300 py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-skillforge-primary"
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
          <div className="text-center py-12 text-lg text-gray-500">Loading blog posts...</div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {searchTerm && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  Search results for: <span className="text-skillforge-primary">{searchTerm}</span>
                </h2>
              </div>
            )}
            
            {/* Featured Article (only shown when not searching) */}
            {!searchTerm && filteredPosts.length > 0 && (
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
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                      Read More
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(searchTerm ? filteredPosts : filteredPosts.slice(1)).map((post) => (
                <Card key={post.id} className="overflow-hidden h-full border hover:border-skillforge-primary transition-all duration-300">
                  <div className="relative">
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="object-cover w-full h-full" 
                      />
                    </AspectRatio>
                    <div className="absolute top-2 left-2">
                      <span className="bg-skillforge-primary/90 text-white px-2 py-0.5 rounded-full text-xs">
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
                </Card>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">
                  We couldn't find any articles matching your search. Try using different keywords.
                </p>
              </div>
            )}
            
            {!searchTerm && filteredPosts.length > 0 && (
              <div className="mt-8 text-center">
                <Button variant="outline" className="px-8">
                  Load More Articles
                </Button>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Categories */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-skillforge-primary" />
                <h3 className="text-lg font-semibold">Categories</h3>
              </div>
              <Separator className="mb-4" />
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.name}>
                    <button className="flex items-center justify-between w-full px-2 py-1.5 text-left transition-colors hover:bg-gray-100 rounded">
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
                <Book className="h-5 w-5 text-skillforge-primary" />
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="bg-skillforge-primary/10 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-skillforge-primary" />
                <h3 className="text-lg font-semibold">Newsletter</h3>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Subscribe to our newsletter to get the latest articles and updates.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-skillforge-primary"
                />
                <Button className="w-full bg-skillforge-primary hover:bg-skillforge-primary/90">
                  Subscribe
                </Button>
              </div>
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
