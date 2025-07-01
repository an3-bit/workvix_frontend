import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trash, Eye, RefreshCcw, MessageCircle, Download } from 'lucide-react';

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
        .order('created_at', { ascending: false })
        .limit(20); // Show only the 20 most recent messages

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
    <div className="p-0 sm:p-6 min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-100">
      <Card className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-2 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-blue-600 drop-shadow-lg" />
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Recent Messages</span>
            <span className="text-base font-normal text-gray-500 hidden sm:inline">(Most Recent First, showing up to 20)</span>
          </div>
          <Button onClick={fetchMessages} variant="outline" className="flex items-center space-x-2 mt-2 sm:mt-0">
            <RefreshCcw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages found.</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="overflow-x-auto rounded-lg hidden sm:block">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sender</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Attachment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message, idx) => (
                      <TableRow key={message.id} className={`transition-all duration-300 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50/60 hover:shadow-md animate-fade-in-row`}>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm border inline-flex items-center gap-1 ${
                            message.sender_profile?.user_type === 'admin' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            message.sender_profile?.user_type === 'client' ? 'bg-green-100 text-green-800 border-green-200' :
                            message.sender_profile?.user_type === 'freelancer' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'
                          }`}>
                            {message.sender_profile?.first_name || 'N/A'}
                            <span className="ml-1">({message.sender_profile?.user_type || 'N/A'})</span>
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {message.content || 'N/A'}
                          {message.read ? (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Read</span>
                          ) : (
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">Unread</span>
                          )}
                        </TableCell>
                        <TableCell>{message.chat_info?.job?.title || 'N/A'}</TableCell>
                        <TableCell>
                          {message.attachment_url ? (
                            <a href={message.attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                              <Download className="h-4 w-4 mr-1" /> File
                            </a>
                          ) : 'No'}
                        </TableCell>
                        <TableCell>{new Date(message.created_at).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteMessage(message)}
                            className="transition-transform hover:scale-110 hover:bg-red-100 hover:text-red-700"
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
              {/* Mobile Card View */}
              <div className="flex flex-col gap-4 sm:hidden">
                {messages.map((message) => (
                  <div key={message.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 animate-fade-in-row">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm border inline-flex items-center gap-1 ${
                        message.sender_profile?.user_type === 'admin' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        message.sender_profile?.user_type === 'client' ? 'bg-green-100 text-green-800 border-green-200' :
                        message.sender_profile?.user_type === 'freelancer' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {message.sender_profile?.first_name || 'N/A'}
                        <span className="ml-1">({message.sender_profile?.user_type || 'N/A'})</span>
                      </span>
                      <span className="text-xs text-gray-500">{new Date(message.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-900 font-medium break-words">{message.content || 'N/A'}</span>
                      {message.read ? (
                        <span className="mt-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold w-max">Read</span>
                      ) : (
                        <span className="mt-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold w-max">Unread</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span>Job: {message.chat_info?.job?.title || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {message.attachment_url ? (
                        <a href={message.attachment_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                          <Download className="h-4 w-4 mr-1" /> File
                        </a>
                      ) : <span className="text-gray-400">No Attachment</span>}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMessage(message)}
                        className="flex-1 transition-transform hover:scale-105 hover:bg-red-100 hover:text-red-700"
                        title="Delete Message"
                      >
                        <Trash className="h-4 w-4 mr-1" />Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
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