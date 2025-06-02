
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Clock, User, Trash2, MessageCircle } from 'lucide-react';
import Nav2 from '@/components/Nav2';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: '1',
      title: 'Modern Website Design & Development',
      freelancer: {
        name: 'Sarah Johnson',
        rating: 4.9,
        avatar: '/api/placeholder/40/40'
      },
      price: 299,
      deliveryTime: '3 days',
      category: 'Web Design',
      image: '/api/placeholder/300/200',
      tags: ['WordPress', 'Responsive', 'SEO'],
      savedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Professional Logo Design Package',
      freelancer: {
        name: 'Mike Chen',
        rating: 4.8,
        avatar: '/api/placeholder/40/40'
      },
      price: 89,
      deliveryTime: '2 days',
      category: 'Graphic Design',
      image: '/api/placeholder/300/200',
      tags: ['Logo', 'Branding', 'Vector'],
      savedAt: '2024-01-12'
    },
    {
      id: '3',
      title: 'Social Media Marketing Strategy',
      freelancer: {
        name: 'Emma Wilson',
        rating: 5.0,
        avatar: '/api/placeholder/40/40'
      },
      price: 199,
      deliveryTime: '5 days',
      category: 'Digital Marketing',
      image: '/api/placeholder/300/200',
      tags: ['Instagram', 'Facebook', 'Content'],
      savedAt: '2024-01-10'
    }
  ]);

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Heart className="h-8 w-8 text-red-500 mr-3" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-2">
                {wishlistItems.length} saved services
              </p>
            </div>
            <Button variant="outline">
              <Heart className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">Save services you're interested in to easily find them later</p>
              <Button className="bg-skillforge-primary hover:bg-skillforge-primary/90">
                Browse Services
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    >
                      <Heart className="h-4 w-4 text-red-500 fill-current" />
                    </button>
                    <Badge className="absolute top-3 left-3 bg-white text-gray-700">
                      {item.category}
                    </Badge>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {/* Freelancer Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <img 
                        src={item.freelancer.avatar} 
                        alt={item.freelancer.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.freelancer.name}</div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                          {item.freelancer.rating}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Pricing and Delivery */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.deliveryTime}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        ${item.price}
                      </div>
                    </div>

                    {/* Saved Date */}
                    <div className="text-xs text-gray-500 mb-4">
                      Saved on {formatDate(item.savedAt)}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-skillforge-primary hover:bg-skillforge-primary/90">
                        Order Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
