
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';

const PostJobForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    min_budget: '',
    max_budget: ''
  });

  const categories = [
    'Web Development',
    'Mobile Development',
    'Design & Creative',
    'Writing & Translation',
    'Digital Marketing',
    'Video & Animation',
    'Music & Audio',
    'Programming & Tech',
    'Business',
    'Data'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.budget) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      // Create the job
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .insert([{
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budget: parseFloat(formData.budget),
          min_budget: formData.min_budget ? parseFloat(formData.min_budget) : null,
          max_budget: formData.max_budget ? parseFloat(formData.max_budget) : null,
          client_id: user.id,
          status: 'open'
        }])
        .select()
        .single();

      if (jobError) throw jobError;

      // Get all freelancers to send notifications
      const { data: freelancers, error: freelancersError } = await supabase
        .from('freelancers')
        .select('id');

      if (freelancersError) throw freelancersError;

      // Create notifications for all freelancers about the new job
      if (freelancers && freelancers.length > 0) {
        const notifications = freelancers.map(freelancer => ({
          user_id: freelancer.id,
          type: 'job_posted',
          message: `New job posted: "${formData.title}" - $${formData.budget}`,
          job_id: jobData.id,
          read: false
        }));

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notificationError) {
          console.error('Error creating notifications:', notificationError);
          // Don't fail the job creation if notifications fail
        }
      }

      toast({
        title: 'Job Posted Successfully',
        description: 'Your job has been posted and freelancers will be notified.',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        budget: '',
        min_budget: '',
        max_budget: ''
      });

      // Navigate to client dashboard or jobs page
      navigate('/client');
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to post job. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Post a New Job</CardTitle>
                <p className="text-gray-600">Find the perfect freelancer for your project</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Build a WordPress website"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your project requirements..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="budget">Budget ($) *</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="1000"
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="min_budget">Min Budget ($)</Label>
                      <Input
                        id="min_budget"
                        type="number"
                        placeholder="500"
                        value={formData.min_budget}
                        onChange={(e) => handleInputChange('min_budget', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max_budget">Max Budget ($)</Label>
                      <Input
                        id="max_budget"
                        type="number"
                        placeholder="2000"
                        value={formData.max_budget}
                        onChange={(e) => handleInputChange('max_budget', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? 'Posting...' : 'Post Job'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/client')}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PostJobForm;
