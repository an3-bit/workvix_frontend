
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from './Navbar';
import Footer from './Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const JOB_CATEGORIES = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Logo Design",
  "Graphic Design",
  "Content Writing",
  "Video Editing",
  "Voice Over",
  "Translation",
  "Data Entry",
  "Virtual Assistant",
  "Social Media Management",
  "SEO",
  "Marketing",
  "Other"
];

const PostJobForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    minBudget: '',
    maxBudget: '',
    description: '',
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  type FormErrors = {
    title?: string;
    category?: string;
    minBudget?: string;
    maxBudget?: string;
    description?: string;
  };
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const selectCategory = (category) => {
    setFormData({
      ...formData,
      category,
    });
    setShowDropdown(false);
    
    // Clear error when field is edited
    if (errors.category) {
      setErrors({
        ...errors,
        category: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (!formData.minBudget) newErrors.minBudget = 'Minimum budget is required';
    if (!formData.maxBudget) newErrors.maxBudget = 'Maximum budget is required';
    if (Number(formData.minBudget) > Number(formData.maxBudget)) {
      newErrors.maxBudget = 'Maximum budget must be greater than minimum budget';
    }
    if (!formData.description.trim()) newErrors.description = 'Job description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: 'Authentication Required',
          description: 'You must be logged in to post a job.',
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      // Calculate average budget
      const minBudget = Number(formData.minBudget);
      const maxBudget = Number(formData.maxBudget);
      const averageBudget = (minBudget + maxBudget) / 2;
      
      // Insert job into Supabase
      const { data, error } = await supabase
        .from('jobs')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            min_budget: minBudget,
            max_budget: maxBudget,
            budget: averageBudget,
            status: 'open',
            category: formData.category,
            client_id: session.user.id
          }
        ])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Show success message
      toast({
        title: 'Job Posted Successfully',
        description: 'Your job has been posted and is now visible to freelancers.',
      });
      
      // Navigate to the job posted notification page
      navigate('/job-posted-notification');
      
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: 'Error Posting Job',
        description: error.message || 'Failed to post job. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-skillforge-secondary p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Post a New Job</h1>
            <p className="text-gray-200 mt-1">Fill in the details to find the perfect freelancer</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Job Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-skillforge-primary focus:outline-none ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. Professional WordPress Website Development"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            
            {/* Job Category */}
            <div className="relative">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <div 
                className={`w-full px-4 py-2 border rounded-md bg-white flex justify-between items-center cursor-pointer ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className={formData.category ? 'text-gray-900' : 'text-gray-400'}>
                  {formData.category || 'Select a category'}
                </span>
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              
              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {JOB_CATEGORIES.map((category) => (
                    <div
                      key={category}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => selectCategory(category)}
                    >
                      {formData.category === category && (
                        <Check className="h-4 w-4 text-skillforge-primary mr-2" />
                      )}
                      <span className={formData.category === category ? 'font-medium' : ''}>
                        {category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Budget Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Range
              </label>
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="minBudget"
                    value={formData.minBudget}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-skillforge-primary focus:outline-none ${
                      errors.minBudget ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Min"
                    min="1"
                  />
                  {errors.minBudget && (
                    <p className="mt-1 text-sm text-red-600">{errors.minBudget}</p>
                  )}
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="maxBudget"
                    value={formData.maxBudget}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-skillforge-primary focus:outline-none ${
                      errors.maxBudget ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Max"
                    min={formData.minBudget || '1'}
                  />
                  {errors.maxBudget && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxBudget}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Job Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-skillforge-primary focus:outline-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe your project in detail. Include the scope, timeline, deliverables, and any specific requirements."
              ></textarea>
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="text-sm text-red-600">{errors.description}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {formData.description.length} characters 
                  </p>
                )}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full py-3 bg-skillforge-primary hover:bg-skillforge-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Job'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PostJobForm;
