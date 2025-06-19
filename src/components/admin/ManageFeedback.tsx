import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Edit, Trash, RefreshCcw, MessageSquare, Star } from 'lucide-react';

interface Feedback {
  id: string;
  user_id: string;
  rating: number; // 1-5
  comment: string;
  related_job_id: string | null;
  created_at: string;
  is_resolved: boolean;
  user_profile?: { first_name: string; last_name: string; email: string } | null;
  job_title?: { title: string } | null;
}

const ManageFeedback: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [feedbackToEdit, setFeedbackToEdit] = useState<Feedback | null>(null);
  const [editComment, setEditComment] = useState('');
  const [editIsResolved, setEditIsResolved] = useState(false);

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          user_profile:user_id(first_name, last_name, email),
          job_title:related_job_id(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbackList(data as Feedback[]);
    } catch (err: any) {
      console.error('Error fetching feedback:', err.message);
      setError('Failed to fetch feedback: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch feedback.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditFeedback = (feedback: Feedback) => {
    setFeedbackToEdit(feedback);
    setEditComment(feedback.comment || '');
    setEditIsResolved(feedback.is_resolved);
    setIsEditDialogOpen(true);
  };

  const submitEditFeedback = async () => {
    if (!feedbackToEdit) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ 
          comment: editComment, 
          is_resolved: editIsResolved 
        })
        .eq('id', feedbackToEdit.id);

      if (error) throw error;

      toast({
        title: 'Feedback Updated',
        description: `Feedback ${feedbackToEdit.id.substring(0, 8)}... updated successfully.`,
      });
      setIsEditDialogOpen(false);
      setFeedbackToEdit(null);
      fetchFeedback();
    } catch (err: any) {
      console.error('Error updating feedback:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to update feedback: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = (feedback: Feedback) => {
    setFeedbackToDelete(feedback);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteFeedback = async () => {
    if (!feedbackToDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackToDelete.id);

      if (error) throw error;

      toast({
        title: 'Feedback Deleted',
        description: `Feedback ${feedbackToDelete.id.substring(0, 8)}... has been deleted.`,
      });
      setIsConfirmDeleteDialogOpen(false);
      setFeedbackToDelete(null);
      fetchFeedback();
    } catch (err: any) {
      console.error('Error deleting feedback:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to delete feedback: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
    ));
  };

  if (loading) {
    return <div className="p-6 text-center">Loading feedback...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">Manage Feedback</CardTitle>
          <Button onClick={fetchFeedback} variant="outline" className="flex items-center space-x-2">
            <RefreshCcw className="h-4 w-4" />
            <span>Refresh Feedback</span>
          </Button>
        </CardHeader>
        <CardContent>
          {feedbackList.length === 0 ? (
            <p className="text-center text-gray-500">No feedback found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Related Job</TableHead>
                    <TableHead>Resolved</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbackList.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>{feedback.user_profile?.first_name || 'N/A'} ({feedback.user_profile?.email})</TableCell>
                      <TableCell className="flex items-center">
                        {renderStars(feedback.rating)}
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">{feedback.comment}</TableCell>
                      <TableCell>{feedback.job_title?.title || 'N/A'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          feedback.is_resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {feedback.is_resolved ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(feedback.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditFeedback(feedback)}
                          className="mr-1"
                          title="Edit Feedback"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteFeedback(feedback)}
                          title="Delete Feedback"
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

      {/* Edit Feedback Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Feedback: {feedbackToEdit?.id.substring(0, 8)}...</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-comment">Comment</Label>
              <Textarea
                id="edit-comment"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-resolved"
                checked={editIsResolved}
                onCheckedChange={(checked) => setEditIsResolved(Boolean(checked))}
              />
              <Label htmlFor="is-resolved">Mark as Resolved</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitEditFeedback} disabled={loading}>
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
            <p>Are you sure you want to delete this feedback?</p>
            <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteFeedback} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageFeedback;
