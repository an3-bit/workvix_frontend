import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trash, Eye, RefreshCcw } from 'lucide-react';

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
  attachment_url?: string | null;
  sender_profile?: { first_name: string; last_name: string; email: string; user_type: string } | null;
  chat_info?: { client_id: string; freelancer_id: string; job: { title: string } } | null; // For joined chat details
}

const ManageMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender_profile:sender_id(first_name, last_name, email, user_type),
          chat_info:chat_id(client_id, freelancer_id, job:job_id(title))
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data as Message[]);
    } catch (err: any) {
      console.error('Error fetching messages:', err.message);
      setError('Failed to fetch messages: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch messages.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = (message: Message) => {
    setMessageToDelete(message);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;

    setLoading(true);
    try {
      // If messages have attachments, you might want to delete the file from storage too.
      // This would require fetching the file path from the attachment_url and calling supabase.storage.from().remove()
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageToDelete.id);

      if (error) throw error;

      toast({
        title: 'Message Deleted',
        description: `Message ${messageToDelete.id.substring(0, 8)}... has been deleted.`,
      });
      setIsConfirmDeleteDialogOpen(false);
      setMessageToDelete(null);
      fetchMessages();
    } catch (err: any) {
      console.error('Error deleting message:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to delete message: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading messages...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">Manage Messages</CardTitle>
          <Button onClick={fetchMessages} variant="outline" className="flex items-center space-x-2">
            <RefreshCcw className="h-4 w-4" />
            <span>Refresh Messages</span>
          </Button>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sender</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Chat ID</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Attachment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>{message.sender_profile?.first_name} ({message.sender_profile?.user_type})</TableCell>
                      <TableCell className="max-w-[200px] truncate">{message.content || 'N/A'}</TableCell>
                      <TableCell>{message.chat_id.substring(0, 8)}...</TableCell>
                      <TableCell>{message.chat_info?.job?.title || 'N/A'}</TableCell>
                      <TableCell>
                        {message.attachment_url ? (
                          <a href={message.attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            <Download className="h-4 w-4 inline mr-1" /> File
                          </a>
                        ) : 'No'}
                      </TableCell>
                      <TableCell>{new Date(message.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteMessage(message)}
                          title="Delete Message"
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

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this message?</p>
            <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteMessage} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageMessages;