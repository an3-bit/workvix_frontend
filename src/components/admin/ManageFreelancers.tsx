import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label'; // Ensure Label is imported
import { Edit, Trash, Eye } from 'lucide-react';

interface FreelancerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  bio?: string;
  skills?: string[]; // Assuming skills are stored as an array of strings
  created_at: string;
  user_type: 'freelancer';
}

const ManageFreelancers: React.FC = () => {
  const [freelancers, setFreelancers] = useState<FreelancerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [freelancerToDelete, setFreelancerToDelete] = useState<FreelancerProfile | null>(null);

  const [isEditFreelancerDialogOpen, setIsEditFreelancerDialogOpen] = useState(false);
  const [freelancerToEdit, setFreelancerToEdit] = useState<FreelancerProfile | null>(null);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: '',
    skills: '', // Will handle as comma-separated string for input
  });

  useEffect(() => {
    fetchFreelancers();
  }, []);

  const fetchFreelancers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'freelancer')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFreelancers(data as FreelancerProfile[]);
    } catch (err: any) {
      console.error('Error fetching freelancers:', err.message);
      setError('Failed to fetch freelancers: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch freelancers.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFreelancer = (freelancer: FreelancerProfile) => {
    setFreelancerToDelete(freelancer);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteFreelancer = async () => {
    if (!freelancerToDelete) return;

    setLoading(true);
    try {
      // IMPORTANT: Consider actions for jobs assigned to this freelancer,
      // and other related data (e.g., offers, messages).
      // For simplicity, we're just deleting the profile here.
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', freelancerToDelete.id);

      if (error) throw error;

      toast({
        title: 'Freelancer Deleted',
        description: `Freelancer ${freelancerToDelete.first_name} ${freelancerToDelete.last_name} has been deleted.`,
      });
      setIsConfirmDeleteDialogOpen(false);
      setFreelancerToDelete(null);
      fetchFreelancers();
    } catch (err: any) {
      console.error('Error deleting freelancer:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to delete freelancer: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditFreelancer = (freelancer: FreelancerProfile) => {
    setFreelancerToEdit(freelancer);
    setEditFormData({
      first_name: freelancer.first_name,
      last_name: freelancer.last_name,
      email: freelancer.email,
      phone: freelancer.phone || '',
      bio: freelancer.bio || '',
      skills: Array.isArray(freelancer.skills) ? freelancer.skills.join(', ') : '',
    });
    setIsEditFreelancerDialogOpen(true);
  };

  const submitEditFreelancer = async () => {
    if (!freelancerToEdit) return;

    setLoading(true);
    try {
      const skillsArray = editFormData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editFormData.first_name,
          last_name: editFormData.last_name,
          // email: editFormData.email, // Email changes can be complex (auth.users table)
          phone: editFormData.phone || null,
          bio: editFormData.bio || null,
          skills: skillsArray.length > 0 ? skillsArray : null,
        })
        .eq('id', freelancerToEdit.id);

      if (error) throw error;

      toast({
        title: 'Freelancer Updated',
        description: `Freelancer ${editFormData.first_name} ${editFormData.last_name} updated successfully.`,
      });
      setIsEditFreelancerDialogOpen(false);
      setFreelancerToEdit(null);
      fetchFreelancers();
    } catch (err: any) {
      console.error('Error updating freelancer:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to update freelancer: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading freelancers...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-background min-h-screen pb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">Manage Freelancers</CardTitle>
          <Button onClick={fetchFreelancers} variant="outline">Refresh Freelancers</Button>
        </CardHeader>
        <CardContent>
          {freelancers.length === 0 ? (
            <p className="text-center text-gray-500">No freelancers found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Registered On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {freelancers.map((freelancer) => (
                    <TableRow key={freelancer.id}>
                      <TableCell className="font-medium">{freelancer.first_name} {freelancer.last_name}</TableCell>
                      <TableCell>{freelancer.email}</TableCell>
                      <TableCell>{freelancer.phone || 'N/A'}</TableCell>
                      <TableCell>{Array.isArray(freelancer.skills) && freelancer.skills.length > 0 ? freelancer.skills.join(', ') : 'N/A'}</TableCell>
                      <TableCell>{new Date(freelancer.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditFreelancer(freelancer)}
                          className="mr-1"
                          title="Edit Freelancer"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteFreelancer(freelancer)}
                          title="Delete Freelancer"
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

      {/* Edit Freelancer Dialog */}
      <Dialog open={isEditFreelancerDialogOpen} onOpenChange={setIsEditFreelancerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Freelancer: {freelancerToEdit?.first_name} {freelancerToEdit?.last_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-first-name">First Name</Label>
              <Input
                id="edit-first-name"
                value={editFormData.first_name}
                onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-last-name">Last Name</Label>
              <Input
                id="edit-last-name"
                value={editFormData.last_name}
                onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email (Cannot be changed here)</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-bio">Bio</Label>
              <Textarea
                id="edit-bio"
                value={editFormData.bio}
                onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-skills">Skills (comma-separated)</Label>
              <Input
                id="edit-skills"
                placeholder="e.g., React, Node.js, Design"
                value={editFormData.skills}
                onChange={(e) => setEditFormData({ ...editFormData, skills: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditFreelancerDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitEditFreelancer} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
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
            <p>Are you sure you want to delete freelancer {freelancerToDelete?.first_name} {freelancerToDelete?.last_name}?</p>
            <p className="text-sm text-red-500 mt-2">This action cannot be undone and might affect associated data.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteFreelancer} disabled={loading}>
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

export default ManageFreelancers;
