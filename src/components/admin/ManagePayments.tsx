import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCcw, Edit, Trash, Eye } from 'lucide-react';

interface Payment {
  id: string;
  user_id: string;
  amount: number;
  type: 'job_payment' | 'withdrawal' | 'deposit' | 'refund' | string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | string;
  description?: string;
  related_job_id?: string | null;
  created_at: string;
  updated_at: string;
  user_profile?: {
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
  } | null;
  job_title?: { title: string } | null; // Joined from jobs table if related
}

const ManagePayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isEditPaymentDialogOpen, setIsEditPaymentDialogOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<Payment | null>(null);
  const [editPaymentStatus, setEditPaymentStatus] = useState<Payment['status']>('');

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);


  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          user_profile:user_id(first_name, last_name, email, user_type),
          job_title:related_job_id(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data as Payment[]);
    } catch (err: any) {
      console.error('Error fetching payments:', err.message);
      setError('Failed to fetch payments: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch payments.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPaymentStatus = (payment: Payment) => {
    setPaymentToEdit(payment);
    setEditPaymentStatus(payment.status);
    setIsEditPaymentDialogOpen(true);
  };

  const submitUpdatePaymentStatus = async () => {
    if (!paymentToEdit || !editPaymentStatus) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: editPaymentStatus, updated_at: new Date().toISOString() })
        .eq('id', paymentToEdit.id);

      if (error) throw error;

      toast({
        title: 'Payment Status Updated',
        description: `Payment ${paymentToEdit.id} status updated to ${editPaymentStatus}.`,
      });
      setIsEditPaymentDialogOpen(false);
      setPaymentToEdit(null);
      fetchPayments();
    } catch (err: any) {
      console.error('Error updating payment status:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to update payment status: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = (payment: Payment) => {
    setPaymentToDelete(payment);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeletePayment = async () => {
    if (!paymentToDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentToDelete.id);

      if (error) throw error;

      toast({
        title: 'Payment Deleted',
        description: `Payment ${paymentToDelete.id} has been deleted.`,
      });
      setIsConfirmDeleteDialogOpen(false);
      setPaymentToDelete(null);
      fetchPayments();
    } catch (err: any) {
      console.error('Error deleting payment:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to delete payment: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading payments...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">Manage Payments</CardTitle>
          <Button onClick={fetchPayments} variant="outline" className="flex items-center space-x-2">
            <RefreshCcw className="h-4 w-4" />
            <span>Refresh Payments</span>
          </Button>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-center text-gray-500">No payment records found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Related Job</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium truncate max-w-[120px]">{payment.id.substring(0, 8)}...</TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell>{payment.user_profile ? `${payment.user_profile.first_name} (${payment.user_profile.user_type})` : 'N/A'}</TableCell>
                      <TableCell>{payment.job_title?.title || 'N/A'}</TableCell>
                      <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditPaymentStatus(payment)}
                          className="mr-1"
                          title="Edit Status"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeletePayment(payment)}
                          title="Delete Payment"
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

      {/* Edit Payment Status Dialog */}
      <Dialog open={isEditPaymentDialogOpen} onOpenChange={setIsEditPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Payment Status: {paymentToEdit?.id.substring(0, 8)}...</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Current Status:</Label>
              <p className="font-semibold">{paymentToEdit?.status}</p>
            </div>
            <div>
              <Label htmlFor="new-payment-status">New Status</Label>
              <Select onValueChange={(value: Payment['status']) => setEditPaymentStatus(value)} value={editPaymentStatus}>
                <SelectTrigger id="new-payment-status">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent>
                  {['pending', 'completed', 'failed', 'refunded'].map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditPaymentDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitUpdatePaymentStatus} disabled={loading || !editPaymentStatus}>
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
            <p>Are you sure you want to delete payment transaction {paymentToDelete?.id.substring(0, 8)}...?</p>
            <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeletePayment} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePayments;
