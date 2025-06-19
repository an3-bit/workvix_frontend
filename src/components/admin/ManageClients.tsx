import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface ClientProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  created_at: string;
  user_type: 'client';
}

const ManageClients: React.FC = () => {
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<ClientProfile | null>(null);

  const [isEditClientDialogOpen, setIsEditClientDialogOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<ClientProfile | null>(null);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'client')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data as ClientProfile[]);
    } catch (err: any) {
      console.error('Error fetching clients:', err.message);
      setError('Failed to fetch clients: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch clients.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = (client: ClientProfile) => {
    setClientToDelete(client);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;

    setLoading(true);
    try {
      // IMPORTANT: If you have foreign key constraints with ON DELETE RESTRICT/NO ACTION,
      // you might need to manually delete associated records (e.g., jobs, messages, offers)
      // before deleting the profile, or set up ON DELETE CASCADE in your database.
      // For this example, RLS is set up to allow admin to delete profiles.
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', clientToDelete.id);

      if (error) throw error;

      toast({
        title: 'Client Deleted',
        description: `Client ${clientToDelete.first_name} ${clientToDelete.last_name} has been deleted.`,
      });
      setIsConfirmDeleteDialogOpen(false);
      setClientToDelete(null);
      fetchClients(); // Refresh the client list
    } catch (err: any) {
      console.error('Error deleting client:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to delete client: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClient = (client: ClientProfile) => {
    setClientToEdit(client);
    setEditFormData({
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email,
      phone: client.phone || '',
    });
    setIsEditClientDialogOpen(true);
  };

  const submitEditClient = async () => {
    if (!clientToEdit) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editFormData.first_name,
          last_name: editFormData.last_name,
          // email: editFormData.email, // Email changes can be complex (auth.users table)
          phone: editFormData.phone || null,
        })
        .eq('id', clientToEdit.id);

      if (error) throw error;

      toast({
        title: 'Client Updated',
        description: `Client ${editFormData.first_name} ${editFormData.last_name} updated successfully.`,
      });
      setIsEditClientDialogOpen(false);
      setClientToEdit(null);
      fetchClients(); // Refresh the client list
    } catch (err: any) {
      console.error('Error updating client:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to update client: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading clients...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">Manage Clients</CardTitle>
          <Button onClick={fetchClients} variant="outline">Refresh Clients</Button>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <p className="text-center text-gray-500">No clients found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Registered On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.first_name} {client.last_name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone || 'N/A'}</TableCell>
                      <TableCell>{new Date(client.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClient(client)}
                          className="mr-1"
                          title="Edit Client"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteClient(client)}
                          title="Delete Client"
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

      {/* Edit Client Dialog */}
      <Dialog open={isEditClientDialogOpen} onOpenChange={setIsEditClientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client: {clientToEdit?.first_name} {clientToEdit?.last_name}</DialogTitle>
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
            {/* Email is typically managed via auth.users table directly or through Supabase functions for security */}
            <div>
              <Label htmlFor="edit-email">Email (Cannot be changed here)</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                disabled // Email changes are usually handled differently for auth security
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditClientDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitEditClient} disabled={loading}>
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
            <p>Are you sure you want to delete client {clientToDelete?.first_name} {clientToDelete?.last_name}?</p>
            <p className="text-sm text-red-500 mt-2">This action might also delete associated data (e.g., jobs created by this client) depending on your database cascade rules. This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteClient} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageClients;
