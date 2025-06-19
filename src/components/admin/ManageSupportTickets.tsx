import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Edit, Trash, RefreshCcw, MessageSquare, Tag } from 'lucide-react';

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string | null;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to_admin_id: string | null;
  created_at: string;
  updated_at: string;
  user_profile?: { first_name: string; last_name: string; email: string; user_type: string } | null;
  assigned_admin_profile?: { first_name: string; last_name: string; email: string } | null;
}

interface AdminProfile { // For assigning tickets
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const ManageSupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isEditTicketDialogOpen, setIsEditTicketDialogOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState<SupportTicket | null>(null);
  const [editFormData, setEditFormData] = useState({
    subject: '',
    description: '',
    status: '' as 'open' | 'in_progress' | 'resolved' | 'closed',
    priority: '' as 'low' | 'medium' | 'high' | 'urgent',
    assigned_to_admin_id: '' as string | null,
  });
  const [availableAdmins, setAvailableAdmins] = useState<AdminProfile[]>([]);

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(null);

  useEffect(() => {
    fetchTickets();
    fetchAdmins();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          user_profile:user_id(first_name, last_name, email, user_type),
          assigned_admin_profile:assigned_to_admin_id(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data as SupportTicket[]);
    } catch (err: any) {
      console.error('Error fetching tickets:', err.message);
      setError('Failed to fetch tickets: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch tickets.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('support_users') // Assuming support_users table contains admin email and ID is user.id
        .select(`
          id:user_id, -- Maps the support_users id to auth.users id
          email,
          user_profile:id(first_name, last_name) -- Join back to profiles to get name
        `);

      if (error) throw error;
      const adminProfiles = data.map(admin => ({
        id: admin.id,
        email: admin.email,
        first_name: admin.user_profile?.first_name || 'Admin',
        last_name: admin.user_profile?.last_name || '',
      }));
      setAvailableAdmins(adminProfiles as AdminProfile[]);
    } catch (err: any) {
      console.error('Error fetching admins:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch admin list.',
        variant: 'destructive',
      });
    }
  };

  const handleEditTicket = (ticket: SupportTicket) => {
    setTicketToEdit(ticket);
    setEditFormData({
      subject: ticket.subject,
      description: ticket.description || '',
      status: ticket.status,
      priority: ticket.priority,
      assigned_to_admin_id: ticket.assigned_to_admin_id || '',
    });
    setIsEditTicketDialogOpen(true);
  };

  const submitEditTicket = async () => {
    if (!ticketToEdit) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({
          subject: editFormData.subject,
          description: editFormData.description || null,
          status: editFormData.status,
          priority: editFormData.priority,
          assigned_to_admin_id: editFormData.assigned_to_admin_id || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketToEdit.id);

      if (error) throw error;

      toast({
        title: 'Ticket Updated',
        description: `Ticket ${ticketToEdit.id.substring(0, 8)}... updated successfully.`,
      });
      setIsEditTicketDialogOpen(false);
      setTicketToEdit(null);
      fetchTickets();
    } catch (err: any) {
      console.error('Error updating ticket:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to update ticket: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = (ticket: SupportTicket) => {
    setTicketToDelete(ticket);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteTicket = async () => {
    if (!ticketToDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('support_tickets')
        .delete()
        .eq('id', ticketToDelete.id);

      if (error) throw error;

      toast({
        title: 'Ticket Deleted',
        description: `Ticket ${ticketToDelete.id.substring(0, 8)}... has been deleted.`,
      });
      setIsConfirmDeleteDialogOpen(false);
      setTicketToDelete(null);
      fetchTickets();
    } catch (err: any) {
      console.error('Error deleting ticket:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to delete ticket: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading support tickets...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">Manage Support Tickets</CardTitle>
          <Button onClick={fetchTickets} variant="outline" className="flex items-center space-x-2">
            <RefreshCcw className="h-4 w-4" />
            <span>Refresh Tickets</span>
          </Button>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-center text-gray-500">No support tickets found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{ticket.subject}</TableCell>
                      <TableCell>{ticket.user_profile?.first_name || 'N/A'} ({ticket.user_profile?.user_type || 'N/A'})</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                          ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{ticket.assigned_admin_profile?.first_name || 'Unassigned'}</TableCell>
                      <TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditTicket(ticket)}
                          className="mr-1"
                          title="Edit Ticket"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteTicket(ticket)}
                          title="Delete Ticket"
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

      {/* Edit Support Ticket Dialog */}
      <Dialog open={isEditTicketDialogOpen} onOpenChange={setIsEditTicketDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Support Ticket: {ticketToEdit?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-subject">Subject</Label>
              <Input
                id="edit-subject"
                value={editFormData.subject}
                onChange={(e) => setEditFormData({ ...editFormData, subject: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select onValueChange={(value: 'open' | 'in_progress' | 'resolved' | 'closed') => setEditFormData({ ...editFormData, status: value })} value={editFormData.status}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-priority">Priority</Label>
                <Select onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setEditFormData({ ...editFormData, priority: value })} value={editFormData.priority}>
                  <SelectTrigger id="edit-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-assigned-to">Assigned To</Label>
              <Select onValueChange={(value: string) => setEditFormData({ ...editFormData, assigned_to_admin_id: value || null })} value={editFormData.assigned_to_admin_id || ''}>
                <SelectTrigger id="edit-assigned-to">
                  <SelectValue placeholder="Assign an admin (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {availableAdmins.map(admin => (
                    <SelectItem key={admin.id} value={admin.id}>
                      {admin.first_name} {admin.last_name} ({admin.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTicketDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitEditTicket} disabled={loading || !editFormData.subject}>
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
            <p>Are you sure you want to delete support ticket "{ticketToDelete?.subject}"?</p>
            <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteTicket} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageSupportTickets;