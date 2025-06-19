import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RefreshCcw, Save } from 'lucide-react';

interface Setting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  description: string | null;
  last_updated_at: string;
  updated_by: string | null; // UUID of admin who updated
}

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      
      const { data, error } = await (supabase as any)
        .from('system_settings')
        .select('*')
        .order('setting_key', { ascending: true });

      if (error) throw error;
      setSettings(data as Setting[]);

      // Initialize editValues with current settings
      const initialEditValues: { [key: string]: string } = {};
      data.forEach((setting: Setting) => {
        initialEditValues[setting.setting_key] = setting.setting_value || '';
      });
      setEditValues(initialEditValues);

    } catch (err: any) {
      console.error('Error fetching settings:', err.message);
      setError('Failed to fetch settings: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch system settings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setEditValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const currentAdminId = userData.user?.id;
      if (!currentAdminId) throw new Error('Admin user not found.');
      const updates = settings.map(setting => {
        const newValue = editValues[setting.setting_key];
        if (newValue !== (setting.setting_value || '')) {
          
          return (supabase as any)
            .from('system_settings')
            .update({ 
              setting_value: newValue, 
              last_updated_at: new Date().toISOString(),
              updated_by: currentAdminId
            })
            .eq('setting_key', setting.setting_key);
        }
        return null;
      }).filter(Boolean); // Filter out nulls

      if (updates.length > 0) {
        await Promise.all(updates);
        toast({
          title: 'Settings Saved',
          description: 'System settings updated successfully.',
        });
        fetchSettings(); // Re-fetch to ensure latest data and timestamps
      } else {
        toast({
          title: 'No Changes',
          description: 'No changes were made to the settings.',
        });
      }
    } catch (err: any) {
      console.error('Error saving settings:', err.message);
      toast({
        title: 'Error',
        description: err.message || 'Failed to save settings.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading system settings...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">System Settings</CardTitle>
          <div className="space-x-2">
            <Button onClick={fetchSettings} variant="outline" className="flex items-center space-x-2">
              <RefreshCcw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button onClick={handleSaveChanges} disabled={saving} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {settings.length === 0 ? (
            <p className="text-center text-gray-500">No system settings found.</p>
          ) : (
            <div className="space-y-6">
              {settings.map((setting) => (
                <div key={setting.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <Label htmlFor={setting.setting_key} className="font-semibold block mb-1">
                    {setting.setting_key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Label>
                  <p className="text-sm text-gray-500 mb-2">{setting.description}</p>
                  {setting.setting_key.includes('content') || setting.setting_key.includes('description') ? (
                    <Textarea
                      id={setting.setting_key}
                      value={editValues[setting.setting_key] || ''}
                      onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <Input
                      id={setting.setting_key}
                      value={editValues[setting.setting_key] || ''}
                      onChange={(e) => handleValueChange(setting.setting_key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemSettings;