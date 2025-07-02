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
import { RefreshCcw, Edit, Trash, Eye, DollarSign, Calendar, User, CreditCard } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

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
  job_title?: { title: string } | null;
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

  const [isViewPaymentDialogOpen, setIsViewPaymentDialogOpen] = useState(false);
  const [paymentToView, setPaymentToView] = useState<Payment | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const [useSample, setUseSample] = useState(false);

  const samplePayments = [
    {
      id: 'paym1',
      user_id: 'user1',
      amount: 120.5,
      type: 'job_payment',
      status: 'completed',
      description: 'Payment for Job #1',
      related_job_id: 'job1',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      user_profile: { first_name: 'Alice', last_name: 'Smith', email: 'alice@example.com', user_type: 'client' },
      job_title: { title: 'Logo Design' },
    },
    {
      id: 'paym2',
      user_id: 'user2',
      amount: 75.0,
      type: 'withdrawal',
      status: 'pending',
      description: 'Withdrawal request',
      related_job_id: null,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      user_profile: { first_name: 'Bob', last_name: 'Jones', email: 'bob@example.com', user_type: 'freelancer' },
      job_title: null,
    },
    {
      id: 'paym3',
      user_id: 'user3',
      amount: 200.0,
      type: 'deposit',
      status: 'completed',
      description: 'Deposit to wallet',
      related_job_id: null,
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
      user_profile: { first_name: 'Carol', last_name: 'Lee', email: 'carol@example.com', user_type: 'client' },
      job_title: null,
    },
    {
      id: 'paym4',
      user_id: 'user4',
      amount: 50.0,
      type: 'refund',
      status: 'refunded',
      description: 'Refund for Job #2',
      related_job_id: 'job2',
      created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 20).toISOString(),
      user_profile: { first_name: 'Dave', last_name: 'Kim', email: 'dave@example.com', user_type: 'client' },
      job_title: { title: 'Website Fix' },
    },
    {
      id: 'paym5',
      user_id: 'user5',
      amount: 300.0,
      type: 'job_payment',
      status: 'failed',
      description: 'Payment for Job #3',
      related_job_id: 'job3',
      created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      user_profile: { first_name: 'Eve', last_name: 'Wong', email: 'eve@example.com', user_type: 'freelancer' },
      job_title: { title: 'App Development' },
    },
  ];

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
          user_profile:user_id(id, email, first_name, last_name, user_type),
          job_title:related_job_id(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data as Payment[]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Error fetching payments:', message);
      setError('Failed to fetch payments: ' + message);
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Error updating payment status:', message);
      toast({
        title: 'Error',
        description: 'Failed to update payment status: ' + message,
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Error deleting payment:', message);
      toast({
        title: 'Error',
        description: 'Failed to delete payment: ' + message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayment = async (paymentId: string) => {
    setViewLoading(true);
    setIsViewPaymentDialogOpen(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`*, user_profile:user_id(email), job_title:related_job_id(title)`)
        .eq('id', paymentId)
        .single();
      if (error) throw error;
      setPaymentToView(data as Payment);
    } catch (err: unknown) {
      setPaymentToView(null);
      const message = err instanceof Error ? err.message : String(err);
      toast({
        title: 'Error',
        description: 'Failed to fetch payment details: ' + message,
        variant: 'destructive',
      });
    } finally {
      setViewLoading(false);
    }
  };

  const displayPayments = useSample ? samplePayments : payments;

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💳</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No payments found</h3>
          <p className="text-gray-500 text-sm sm:text-base">Your payments will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-16">
      <div className="flex items-center gap-4 mb-4">
        <Switch checked={useSample} onCheckedChange={setUseSample} id="sample-toggle" />
        <label htmlFor="sample-toggle" className="text-xs text-foreground cursor-pointer">Use Sample Data</label>
      </div>
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card rounded-t-lg">
          <div>
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
              <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              Manage Payments
            </CardTitle>
            <p className="text-foreground text-sm sm:text-base mt-1">
              Monitor and manage all payment transactions
            </p>
          </div>
          <Button 
            onClick={fetchPayments} 
            variant="outline" 
            className="flex items-center gap-2 bg-card text-foreground border border-border hover:bg-muted"
          >
            <RefreshCcw className="h-4 w-4" />
            <span className="text-sm sm:text-base">Refresh</span>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {displayPayments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No payment records found</h3>
              <p className="text-gray-500 text-sm sm:text-base">Payments will appear here once transactions are made.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Mobile Cards View */}
              <div className="block lg:hidden space-y-4 p-4">
                {displayPayments.map((payment) => (
                  <div key={payment.id} className="bg-card rounded-lg border border-border p-4 shadow-sm text-foreground">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-gray-500">
                            {payment.id.substring(0, 8)}...
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold text-gray-900">${payment.amount.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <User className="h-4 w-4" />
                          <span>{payment.user_profile ? payment.user_profile.email : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(payment.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewPayment(payment.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditPaymentStatus(payment)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeletePayment(payment)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      <TableHead className="font-semibold text-foreground">ID</TableHead>
                      <TableHead className="font-semibold text-foreground">Amount</TableHead>
                      <TableHead className="font-semibold text-foreground">Type</TableHead>
                      <TableHead className="font-semibold text-foreground">Status</TableHead>
                      <TableHead className="font-semibold text-foreground">User</TableHead>
                      <TableHead className="font-semibold text-foreground">Related Job</TableHead>
                      <TableHead className="font-semibold text-foreground">Date</TableHead>
                      <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayPayments.map((payment) => (
                      <TableRow key={payment.id} className="bg-card hover:bg-muted">
                        <TableCell className="font-medium truncate max-w-[120px] text-sm text-foreground">
                          {payment.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="font-semibold text-green-600 text-foreground">${payment.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-sm text-foreground">{payment.type}</TableCell>
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
                        <TableCell className="text-sm text-foreground">{payment.user_profile ? payment.user_profile.email : 'N/A'}</TableCell>
                        <TableCell className="text-sm text-foreground">{payment.job_title?.title || 'N/A'}</TableCell>
                        <TableCell className="text-sm text-foreground">{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewPayment(payment.id)}
                              className="h-8 w-8 p-0"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditPaymentStatus(payment)}
                              className="h-8 w-8 p-0"
                              title="Edit Status"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDeletePayment(payment)}
                              className="h-8 w-8 p-0"
                              title="Delete Payment"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <footer className="fixed bottom-0 left-0 w-full z-50 border-t border-border bg-card py-2 px-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>Admin Dashboard © {new Date().getFullYear()} WorkVix</span>
        <div className="flex items-center gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-black transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 2H21l-7.19 8.24L22 22h-6.47l-5.1-6.2L4 22H1l7.64-8.74L2 2h6.47l4.73 5.75L17.53 2zm-2.13 16.98h1.77l-5.13-6.24-1.77 2.13 5.13 6.24z"/></svg></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/></svg></a>
        </div>
      </footer>

      {/* Edit Payment Status Dialog */}
      <Dialog open={isEditPaymentDialogOpen} onOpenChange={setIsEditPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold">
              Edit Payment Status: {paymentToEdit?.id.substring(0, 8)}...
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium">Current Status:</Label>
              <p className="font-semibold text-sm sm:text-base">{paymentToEdit?.status}</p>
            </div>
            <div>
              <Label htmlFor="new-payment-status" className="text-sm font-medium">New Status</Label>
              <Select onValueChange={(value: Payment['status']) => setEditPaymentStatus(value)} value={editPaymentStatus}>
                <SelectTrigger id="new-payment-status" className="h-10">
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
            <Button variant="outline" onClick={() => setIsEditPaymentDialogOpen(false)} className="text-sm">
              Cancel
            </Button>
            <Button onClick={submitUpdatePaymentStatus} disabled={loading || !editPaymentStatus} className="text-sm">
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold">Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm sm:text-base">
              Are you sure you want to delete payment transaction {paymentToDelete?.id.substring(0, 8)}...?
            </p>
            <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)} className="text-sm">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeletePayment} disabled={loading} className="text-sm">
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Payment Details Dialog */}
      <Dialog open={isViewPaymentDialogOpen} onOpenChange={setIsViewPaymentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold">Payment Details</DialogTitle>
          </DialogHeader>
          {viewLoading ? (
            <div className="py-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading...</p>
            </div>
          ) : paymentToView ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium w-20">ID:</Label>
                    <span className="font-mono text-sm">{paymentToView.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium w-20">Amount:</Label>
                    <span className="font-bold text-green-600">${paymentToView.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium w-20">Type:</Label>
                    <span className="text-sm">{paymentToView.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium w-20">Status:</Label>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      paymentToView.status === 'completed' ? 'bg-green-100 text-green-800' :
                      paymentToView.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      paymentToView.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {paymentToView.status}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium w-20">User:</Label>
                    <span className="text-sm">{paymentToView.user_profile ? paymentToView.user_profile.email : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium w-20">Related Job:</Label>
                    <span className="text-sm">{paymentToView.job_title?.title || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium w-20">Description:</Label>
                    <span className="text-sm">{paymentToView.description || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-sm font-medium">Created At:</Label>
                    <p className="text-gray-600">{new Date(paymentToView.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Updated At:</Label>
                    <p className="text-gray-600">{new Date(paymentToView.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-red-500">
              <p className="text-sm">No payment details found.</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewPaymentDialogOpen(false)} className="text-sm">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagePayments;
