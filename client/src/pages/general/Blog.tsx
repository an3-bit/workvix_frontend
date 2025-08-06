// src/pages/Blog.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Search, ExternalLink, ArrowLeft, Calendar, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    fetchWordPressPosts,
    type WordPressPost
} from '@/lib/wordpress';

const Blog = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [blogPosts, setBlogPosts] = useState<WordPressPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPostSlug, setSelectedPostSlug] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const posts = await fetchWordPressPosts(20);
                setBlogPosts(posts);
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
        const matchesSearch =
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.category.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
    const regularPosts = filteredPosts.slice(1);

    const handleReadMore = (postSlug: string) => {
        setSelectedPostSlug(postSlug);
        window.scrollTo(0, 0);
    };

    const handleBackToBlog = () => {
        setSelectedPostSlug(null);
    };

    const selectedPost = blogPosts.find(post => post.slug === selectedPostSlug);

    const decodeEntities = (text: string) => {
        return text.replace(/&#\d+;|&quot;|&amp;|&lt;|&gt;/g, '').replace(/&[^;]+;/g, '');
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-grow">
                {selectedPostSlug ? (
                    // Single post view
                    <div className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-8">
                                <Button variant="ghost" onClick={handleBackToBlog}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Articles
                                </Button>
                            </div>
                            {selectedPost ? (
                                <>
                                    <h1 className="text-3xl font-bold mb-4">{decodeEntities(selectedPost.title)}</h1>
                                    <div className="flex gap-4 text-gray-600 text-sm mb-4">
                                        <div className="flex items-center gap-1"><Calendar size={14} /> {selectedPost.date}</div>
                                        <div className="flex items-center gap-1"><Clock size={14} /> 5 min read</div>
                                    </div>
                                    <Card>
                                        <CardContent>
                                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                                        </CardContent>
                                    </Card>
                                </>
                            ) : (
                                <div className="text-center py-12">Post not found.</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Hero */}
                        <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-center">
                            <h1 className="text-5xl font-bold mb-4">WorkVix <span className="text-blue-600">Blog</span></h1>
                            <p className="text-lg mb-6">Insights, tips, and strategies for freelancers and businesses</p>
                            <div className="max-w-md mx-auto relative">
                                <input
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-md"
                                    placeholder="Search articles..."
                                />
                                <Search className="absolute right-3 top-3 text-gray-400" size={18} />
                            </div>
                        </section>

                        {/* Blog Posts */}
                        <section className="container mx-auto px-4 py-12 space-y-10">
                            {loading ? (
                                <div className="text-center text-gray-500">Loading...</div>
                            ) : error ? (
                                <div className="text-center text-red-500">{error}</div>
                            ) : filteredPosts.length === 0 ? (
                                <div className="text-center text-gray-500">No articles found.</div>
                            ) : (
                                <>
                                    {featuredPost && (
                                        <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                            <div className="w-full md:w-1/2 overflow-hidden rounded-lg">
                                                <AspectRatio ratio={16 / 9}>
                                                    <img src={featuredPost.image} alt={featuredPost.title} className="object-cover w-full h-full rounded-lg" />
                                                </AspectRatio>
                                            </div>
                                            <div className="w-full md:w-1/2">
                                                <p className="text-xs text-blue-600 mb-1">{featuredPost.category}</p>
                                                <h2 className="text-xl font-semibold mb-2">{decodeEntities(featuredPost.title)}</h2>
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{decodeEntities(featuredPost.excerpt)}</p>
                                                <Button onClick={() => handleReadMore(featuredPost.slug)} className="bg-indigo-100 text-indigo-800">
                                                    Read more
                                                </Button>
                                                <p className="text-xs text-gray-500 mt-4">{featuredPost.date} &nbsp;•&nbsp; 5 min read</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {regularPosts.map(post => (
                                            <Card key={post.id} className="flex flex-col">
                                                <AspectRatio ratio={16 / 9}>
                                                    <img src={post.image} alt={post.title} className="object-cover w-full rounded-t-lg" />
                                                </AspectRatio>
                                                <CardHeader>
                                                    <p className="text-xs text-blue-600 mb-1">{post.category}</p>
                                                    <CardTitle className="text-lg">{decodeEntities(post.title)}</CardTitle>
                                                    <CardDescription className="text-xs text-gray-500">{post.date} • 5 min read</CardDescription>
                                                </CardHeader>
                                                <CardContent className="flex-grow text-sm text-gray-700 line-clamp-3">
                                                    {decodeEntities(post.excerpt)}
                                                </CardContent>
                                                <CardFooter>
                                                    <Button size="sm" variant="outline" onClick={() => handleReadMore(post.slug)}>
                                                        Read More
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            )}
                        </section>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Blog;
