
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Nav2 from '@/components/Nav2';
import { User, Save, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface FreelancerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio?: string;
  skills?: string[];
  hourly_rate?: number;
  portfolio_links?: string[];
}

const FreelancerProfile: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signin');
        return;
      }

      const { data: profileData } = await supabase
        .from('freelancers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('freelancers')
        .update({
          bio: profile.bio,
          skills: profile.skills,
          hourly_rate: profile.hourly_rate,
          portfolio_links: profile.portfolio_links
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });

      // Redirect back to dashboard
      navigate('/freelancer');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim() || !profile) return;
    
    const updatedSkills = [...(profile.skills || []), newSkill.trim()];
    setProfile({ ...profile, skills: updatedSkills });
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    if (!profile) return;
    
    const updatedSkills = (profile.skills || []).filter(skill => skill !== skillToRemove);
    setProfile({ ...profile, skills: updatedSkills });
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Nav2 />
        <div className="pt-20 text-center">
          <p className="text-gray-600">Profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <User className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Freelancer Profile</h1>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profile.first_name}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={profile.last_name}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio *
                  </label>
                  <textarea
                    value={profile.bio || ''}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                  />
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate (USD) *
                  </label>
                  <input
                    type="number"
                    value={profile.hourly_rate || ''}
                    onChange={(e) => setProfile({ ...profile, hourly_rate: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="25"
                    min="1"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills *
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(profile.skills || []).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add a skill (e.g., React, Graphic Design, Writing)"
                    />
                    <Button onClick={addSkill} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Portfolio Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio Links (Optional)
                  </label>
                  <textarea
                    value={(profile.portfolio_links || []).join('\n')}
                    onChange={(e) => setProfile({ 
                      ...profile, 
                      portfolio_links: e.target.value.split('\n').filter(link => link.trim()) 
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/yourprofile&#10;https://dribbble.com/yourprofile&#10;https://yourportfolio.com"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Add one URL per line to showcase your work
                  </p>
                </div>

                {/* Save Button */}
                <div className="flex justify-between items-center pt-6">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/freelancer')}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfile;
