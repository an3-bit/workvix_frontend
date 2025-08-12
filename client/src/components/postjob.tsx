import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const PostJobForm: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    min_budget: '',
    max_budget: '',
    urgency: '',
    deadline: '',
  });

  const categories = [
    'Web Development', 'Mobile Development', 'Design & Creative', 'Writing & Translation',
    'Digital Marketing', 'Video & Animation', 'Music & Audio', 'Programming & Tech',
    'Business', 'Data'
  ];

  const urgencies = ['Low', 'Medium', 'High'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };
const navigate = useNavigate();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.title || !formData.description || !formData.category || !formData.budget || !formData.urgency || !formData.deadline) {
    toast({
      title: 'Missing Information',
      description: 'Please fill in all required job fields.',
      variant: 'destructive',
    });
    return;
  }

  try {
    setLoading(true);

    let attachmentUrl: string | null = null;
    if (selectedFile) {
      // For now, you can send file as FormData if your backend supports it
      // Or first upload to storage and get a URL
    }

    // Payload matches DB schema exactly
    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      budget: parseFloat(formData.budget),
      min_budget: formData.min_budget ? parseFloat(formData.min_budget) : null,
      max_budget: formData.max_budget ? parseFloat(formData.max_budget) : null,
      urgency: formData.urgency,
      deadline: formData.deadline,
      attachment_url: attachmentUrl,
    };
  
  localStorage.setItem('pendingJob', JSON.stringify(payload));
  navigate('/job-posted-notification');

    // const res = await fetch('http://localhost:5000/jobs', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(payload),
    // });

    // if (!res.ok) {
    //   const err = await res.json();
    //   throw new Error(err.message || 'Failed to post job');
    // }

    // toast({
    //   title: 'Job Posted Successfully',
    //   description: 'Your job has been posted and freelancers will be notified.',
    // });

    // setFormData({
    //   title: '',
    //   description: '',
    //   category: '',
    //   budget: '',
    //   min_budget: '',
    //   max_budget: '',
    //   urgency: '',
    //   deadline: '',
    // });
    // setSelectedFile(null);

  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message || 'An error occurred while posting the job.',
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-8">
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
                    <Select
                      onValueChange={(value) => handleInputChange('category', value)}
                      value={formData.category}
                    >
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

                  {/* Urgency Field */}
                  <div>
                    <Label htmlFor="urgency">Urgency *</Label>
                    <Select
                      onValueChange={(value) => handleInputChange('urgency', value)}
                      value={formData.urgency}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencies.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Deadline Field */}
                  <div>
                    <Label htmlFor="deadline">Deadline *</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">Attachments (Optional)</h3>
                    <div>
                      <input
                        id="file-upload"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md border border-gray-300 transition-colors flex items-center"
                      >
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Choose File
                      </label>
                      {selectedFile ? (
                        <span className="ml-2 text-sm text-gray-600">{selectedFile.name}</span>
                      ) : (
                        <span className="ml-2 text-sm text-gray-500">No file chosen</span>
                      )}
                    </div>
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

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Posting...' : 'Post Job'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostJobForm;
