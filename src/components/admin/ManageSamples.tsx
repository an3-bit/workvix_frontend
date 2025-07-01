import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash, RefreshCcw, ExternalLink } from 'lucide-react';

interface Sample {
  id: string;
  title: string;
  description: string | null;
  sample_url: string;
  uploaded_by_user_id: string | null;
  created_at: string;
  is_approved: boolean;
  uploader_profile?: { first_name: string; last_name: string; email: string; user_type: string } | null;
}

const ManageSamples: React.FC = () => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editingSample, setEditingSample] = useState<Sample | null>(null);
  const [sampleFormData, setSampleFormData] = useState({
    title: '',
    description: '',
    sample_url: '',
    is_approved: true,
  });

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [sampleToDelete, setSampleToDelete] = useState<Sample | null>(null);

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('samples')
        .select(`
          *,
          uploader_profile:uploaded_by_user_id(first_name, last_name, email, user_type)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSamples(data as Sample[]);
    } catch (err: any) {
      console.error('Error fetching samples:', err.message);
      setError('Failed to fetch samples: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch samples.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSample = () => {
    setEditingSample(null);
    setSampleFormData({
      title: '',
      description: '',
      sample_url: '',
      is_approved: true,
    });
    setIsAddEditDialogOpen(true);
  };

  const handleEditSample = (sample: Sample) => {
    setEditingSample(sample);
    setSampleFormData({
      title: sample.title,
      description: sample.description || '',
      sample_url: sample.sample_url,
      is_approved: sample.is_approved,
    });
    setIsAddEditDialogOpen(true);
  };

  const handleSubmitSample = async () => {
    setLoading(true);
    try {
      // Get current admin user ID for 'updated_by' if needed, or if this is an admin-uploaded sample
      const { data: userData } = await supabase.auth.getUser();
      const adminId = userData.user?.id || null;

      const payload = {
        title: sampleFormData.title,
        description: sampleFormData.description || null,
        sample_url: sampleFormData.sample_url,
        is_approved: sampleFormData.is_approved,
        uploaded_by_user_id: adminId, // Admin is uploading/editing
      };

      if (editingSample) {
        // Update existing sample
        const { error } = await supabase
          .from('samples')
          .update(payload)
          .eq('id', editingSample.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Sample updated successfully.' });
      } else {
        // Add new sample
        const { error } = await supabase
          .from('samples')
          .insert([payload]);

        if (error) throw error;
        toast({ title: 'Success', description: 'Sample added successfully.' });
      }
      
      setIsAddEditDialogOpen(false);
      fetchSamples();
    } catch (err: any) {
      console.error('Error submitting sample:', err.message);
      toast({
        title: 'Error',
        description: err.message || 'Failed to save sample.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSample = (sample: Sample) => {
    setSampleToDelete(sample);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteSample = async () => {
    if (!sampleToDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('samples')
        .delete()
        .eq('id', sampleToDelete.id);

      if (error) throw error;

      toast({
        title: 'Sample Deleted',
        description: `Sample "${sampleToDelete.title}" has been deleted.`,
      });
      setIsConfirmDeleteDialogOpen(false);
      setSampleToDelete(null);
      fetchSamples();
    } catch (err: any) {
      console.error('Error deleting sample:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to delete sample: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading samples...</div>;
  }

  if (error) {
    return <div className="p-6 text-center font-bold">Your samples will appear here.</div>;
  }

  return (
<<<<<<< HEAD
    <div className="p-6 bg-background min-h-screen pb-8">
=======
    <div className="p-6 bg-background">
>>>>>>> 7438431 (admin dashboard)
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-foreground">Manage Samples</CardTitle>
          <div className="space-x-2">
            <Button onClick={fetchSamples} variant="outline" className="flex items-center space-x-2">
              <RefreshCcw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button onClick={handleAddSample} className="flex items-center space-x-2">
              <PlusCircle className="h-4 w-4" />
              <span>Add Sample</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {samples.length === 0 ? (
            <p className="text-center text-gray-500">No samples found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Uploader</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {samples.map((sample) => (
                    <TableRow key={sample.id}>
                      <TableCell className="font-medium">{sample.title}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{sample.description || 'N/A'}</TableCell>
                      <TableCell>
                        <a href={sample.sample_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                          <ExternalLink className="h-4 w-4 mr-1" /> View
                        </a>
                      </TableCell>
                      <TableCell>{sample.uploader_profile?.first_name || 'Admin'} ({sample.uploader_profile?.user_type || 'N/A'})</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          sample.is_approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {sample.is_approved ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(sample.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditSample(sample)}
                          className="mr-1"
                          title="Edit Sample"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteSample(sample)}
                          title="Delete Sample"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Sample Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSample ? 'Edit Sample' : 'Add New Sample'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="sample-title">Title</Label>
              <Input
                id="sample-title"
                value={sampleFormData.title}
                onChange={(e) => setSampleFormData({ ...sampleFormData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="sample-description">Description (Optional)</Label>
              <Textarea
                id="sample-description"
                value={sampleFormData.description}
                onChange={(e) => setSampleFormData({ ...sampleFormData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="sample-url">Sample URL</Label>
              <Input
                id="sample-url"
                type="url"
                value={sampleFormData.sample_url}
                onChange={(e) => setSampleFormData({ ...sampleFormData, sample_url: e.target.value })}
                placeholder="e.g., https://example.com/sample.pdf or /storage/public/samples/image.jpg"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-approved"
                checked={sampleFormData.is_approved}
                onCheckedChange={(checked) => setSampleFormData({ ...sampleFormData, is_approved: Boolean(checked) })}
              />
              <Label htmlFor="is-approved">Is Approved (Publicly Visible)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitSample} disabled={loading || !sampleFormData.title || !sampleFormData.sample_url}>
              {loading ? 'Saving...' : 'Save Sample'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete sample "{sampleToDelete?.title}"?</p>
            <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteSample} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="fixed bottom-0 left-0 w-full z-50 border-t border-border bg-card py-2 px-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>Admin Dashboard © {new Date().getFullYear()} WorkVix</span>
        <div className="flex items-center gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-black transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 2H21l-7.19 8.24L22 22h-6.47l-5.1-6.2L4 22H1l7.64-8.74L2 2h6.47l4.73 5.75L17.53 2zm-2.13 16.98h1.77l-5.13-6.24-1.77 2.13 5.13 6.24z"/></svg></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/></svg></a>
        </div>
      </footer>
    </div>
  );
};

export default ManageSamples;