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
import SubmitSupportTicket from '@/components/SubmitSupportTicket';

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

// Support Chat Section Types
interface SupportChat {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  subject: string;
  status: string;
}

interface SupportMessage {
  id: string;
  support_chat_id: string;
  sender_id: string;
  sender_type: 'client' | 'freelancer' | 'admin';
  content: string;
  read: boolean;
  created_at: string;
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

  // Support Chats State
  const [chats, setChats] = useState<SupportChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<SupportChat | null>(null);
  const [chatMessages, setChatMessages] = useState<SupportMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  useEffect(() => {
    fetchTickets();
    fetchAdmins();
    fetchChats();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('support_tickets' as any)
        .select(`
          *,
          user_profile:user_id(first_name, last_name, email, user_type),
          assigned_admin_profile:assigned_to_admin_id(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets((data as any[]) as SupportTicket[]);
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
        .from('profiles')
        .select(`
          id,
          email,
          first_name,
          last_name
        `)
        .eq('user_type', 'admin');

      if (error) throw error;
      const adminProfiles = (data as any[]).map(admin => ({
        id: admin.id,
        email: admin.email,
        first_name: admin.first_name || 'Admin',
        last_name: admin.last_name || '',
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

  const fetchChats = async () => {
    try {
      const { data, error } = await supabase
        .from('support_chats')
        .select('*')
        .order('updated_at', { ascending: false });
      if (!error) setChats(data || []);
    } catch (err) {
      // ignore for now
    }
  };

  const fetchChatMessages = async (chatId: string) => {
    setChatLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('support_chat_id', chatId)
        .order('created_at', { ascending: true });
      if (!error) setChatMessages(data || []);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSelectChat = (chat: SupportChat) => {
    setSelectedChat(chat);
    fetchChatMessages(chat.id);
  };

  const handleSendChatMessage = async () => {
    if (!selectedChat || !chatInput.trim()) return;
    setSendingChat(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase
        .from('support_messages')
        .insert([{
          support_chat_id: selectedChat.id,
          sender_id: user.id,
          sender_type: 'admin',
          content: chatInput.trim(),
        }]);
      // Send notification to the chat owner (freelancer or client)
      await supabase
        .from('notifications')
        .insert([{
          user_id: selectedChat.user_id,
          type: 'support_reply',
          message: 'Support has replied to your ticket.',
          read: false,
          created_at: new Date().toISOString(),
        }]);
      setChatInput('');
      fetchChatMessages(selectedChat.id);
      fetchChats(); // update chat list order
    } finally {
      setSendingChat(false);
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
        .from('support_tickets' as any)
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
        .from('support_tickets' as any)
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
    return <div className="p-6 text-center text-foreground">Loading support tickets...</div>;
  }

  if (error) {
    return <div className="p-6 text-center font-bold text-foreground">Your support tickets will appear here.</div>;
  }

  return (
    <div className="p-6 bg-background min-h-screen pb-8">
      {/* User-facing support ticket submission form */}
     
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-foreground">Manage Support Tickets</CardTitle>
          <Button onClick={fetchTickets} variant="outline" className="flex items-center space-x-2">
            <RefreshCcw className="h-4 w-4" />
            <span>Refresh Tickets</span>
          </Button>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-center text-muted-foreground">No support tickets found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground">Subject</TableHead>
                    <TableHead className="text-foreground">User</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Priority</TableHead>
                    <TableHead className="text-foreground">Assigned To</TableHead>
                    <TableHead className="text-foreground">Created</TableHead>
                    <TableHead className="text-right text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium max-w-[200px] truncate text-foreground">{ticket.subject}</TableCell>
                      <TableCell className="text-foreground">{ticket.user_profile?.first_name || 'N/A'} ({ticket.user_profile?.user_type || 'N/A'})</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.status === 'open' ? 'bg-primary/10 text-primary' :
                          ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-muted text-foreground'
                        }`}>
                          {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.replace('_', ' ').slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          'bg-muted text-foreground'
                        }`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-foreground">{ticket.assigned_admin_profile?.first_name || 'Unassigned'}</TableCell>
                      <TableCell className="text-foreground">{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right whitespace-nowrap text-foreground">
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
      <Card className="bg-card shadow-lg rounded-lg w-full mb-12">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">Support Chats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Chat List */}
            <div className="w-full md:w-1/3 max-h-96 overflow-y-auto border-r border-gray-200 pr-4">
              <h4 className="font-semibold mb-2">All Chats</h4>
              <ul>
                {chats.length === 0 ? (
                  <li className="text-gray-400 text-sm">No support chats found.</li>
                ) : (
                  chats.map(chat => (
                    <li
                      key={chat.id}
                      className={`p-2 rounded cursor-pointer mb-1 ${selectedChat?.id === chat.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                      onClick={() => handleSelectChat(chat)}
                    >
                      <div className="font-medium text-gray-900 text-sm truncate">{chat.subject || 'No subject'}</div>
                      <div className="text-xs text-gray-500">{new Date(chat.updated_at).toLocaleString()}</div>
                    </li>
                  ))
                )}
              </ul>
            </div>
            {/* Chat Messages */}
            <div className="flex-1">
              {selectedChat ? (
                <div className="flex flex-col h-96">
                  <div className="flex-1 overflow-y-auto border rounded p-3 bg-white mb-2">
                    {chatLoading ? (
                      <div className="text-center text-gray-400">Loading messages...</div>
                    ) : chatMessages.length === 0 ? (
                      <div className="text-center text-gray-400">No messages yet.</div>
                    ) : (
                      chatMessages.map(msg => (
                        <div key={msg.id} className={`mb-3 flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`rounded-lg px-3 py-2 max-w-xs text-sm ${msg.sender_type === 'admin' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'}`}>
                            <div>{msg.content}</div>
                            <div className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString()}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border rounded px-3 py-2 text-sm"
                      placeholder="Type a message..."
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleSendChatMessage(); }}
                      disabled={sendingChat}
                    />
                    <Button onClick={handleSendChatMessage} disabled={sendingChat || !chatInput.trim()}>
                      Send
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center mt-12">Select a chat to view messages.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="mt-16 w-full">
        <SubmitSupportTicket />
      </div>

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

export default ManageSupportTickets;