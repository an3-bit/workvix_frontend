
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import { Plus, Edit, Trash2, ExternalLink, Image, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  project_url?: string;
  technologies: string[];
  created_at: string;
}

const FreelancerPortfolio: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    project_url: '',
    technologies: ''
  });

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      // Mock data for now - in real app, fetch from database
      const mockItems: PortfolioItem[] = [
        {
          id: '1',
          title: 'E-commerce Website',
          description: 'Modern responsive e-commerce platform built with React and Node.js. Features include user authentication, payment integration, and admin dashboard.',
          image_url: '/placeholder.svg',
          project_url: 'https://example-ecommerce.com',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          created_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          title: 'Mobile Banking App UI',
          description: 'Clean and intuitive mobile banking application design with focus on user experience and security.',
          image_url: '/placeholder.svg',
          project_url: 'https://dribbble.com/shots/example',
          technologies: ['Figma', 'Adobe XD', 'Principle'],
          created_at: '2024-02-20T14:30:00Z'
        },
        {
          id: '3',
          title: 'Restaurant Management System',
          description: 'Complete restaurant management solution with order tracking, inventory management, and analytics.',
          image_url: '/placeholder.svg',
          technologies: ['Vue.js', 'Laravel', 'MySQL'],
          created_at: '2024-03-10T09:15:00Z'
        }
      ];

      setPortfolioItems(mockItems);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: PortfolioItem = {
      id: editingItem?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      image_url: formData.image_url || '/placeholder.svg',
      project_url: formData.project_url,
      technologies: formData.technologies.split(',').map(tech => tech.trim()),
      created_at: editingItem?.created_at || new Date().toISOString()
    };

    if (editingItem) {
      setPortfolioItems(prev => prev.map(item => 
        item.id === editingItem.id ? newItem : item
      ));
    } else {
      setPortfolioItems(prev => [newItem, ...prev]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      project_url: '',
      technologies: ''
    });
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url || '',
      project_url: item.project_url || '',
      technologies: item.technologies.join(', ')
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      setPortfolioItems(prev => prev.filter(item => item.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav2 />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
                <p className="text-gray-600 mt-2">Showcase your best work to attract clients</p>
              </div>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Project
              </Button>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {editingItem ? 'Edit Project' : 'Add New Project'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project URL
                      </label>
                      <input
                        type="url"
                        value={formData.project_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Technologies (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.technologies}
                      onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="React, Node.js, MongoDB"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      {editingItem ? 'Update Project' : 'Add Project'}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                      >
                        <Edit className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      {item.project_url && (
                        <a
                          href={item.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {item.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {item.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {portfolioItems.length === 0 && (
              <div className="text-center py-12">
                <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items yet</h3>
                <p className="text-gray-500 mb-4">Start building your portfolio to showcase your work to potential clients.</p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Project
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerPortfolio;
