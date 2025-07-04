import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash, RefreshCcw } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  expiration_date: string | null;
  usage_limit: number | null;
  current_usage_count: number;
  created_at: string;
  is_active: boolean;
}

const ManageCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null); // For edit mode
  const [couponFormData, setCouponFormData] = useState({
    code: '',
    discount_percentage: '',
    expiration_date: '',
    usage_limit: '',
    is_active: true,
  });

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data as Coupon[]);
    } catch (err: any) {
      console.error('Error fetching coupons:', err.message);
      setError('Failed to fetch coupons: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch coupons.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = () => {
    setEditingCoupon(null); // Clear editing state for add mode
    setCouponFormData({
      code: '',
      discount_percentage: '',
      expiration_date: '',
      usage_limit: '',
      is_active: true,
    });
    setIsAddEditDialogOpen(true);
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponFormData({
      code: coupon.code,
      discount_percentage: coupon.discount_percentage.toString(),
      expiration_date: coupon.expiration_date ? new Date(coupon.expiration_date).toISOString().split('T')[0] : '', // Format to YYYY-MM-DD
      usage_limit: coupon.usage_limit?.toString() || '',
      is_active: coupon.is_active,
    });
    setIsAddEditDialogOpen(true);
  };

  const handleSubmitCoupon = async () => {
    setLoading(true);
    try {
      const payload = {
        code: couponFormData.code,
        discount_percentage: parseFloat(couponFormData.discount_percentage),
        expiration_date: couponFormData.expiration_date ? new Date(couponFormData.expiration_date).toISOString() : null,
        usage_limit: couponFormData.usage_limit ? parseInt(couponFormData.usage_limit) : null,
        is_active: couponFormData.is_active,
      };

      if (editingCoupon) {
        // Update existing coupon
        const { error } = await supabase
          .from('coupons')
          .update(payload)
          .eq('id', editingCoupon.id);

        if (error) throw error;
        toast({ title: 'Success', description: 'Coupon updated successfully.' });
      } else {
        // Add new coupon
        const { error } = await supabase
          .from('coupons')
          .insert([payload]);

        if (error) throw error;
        toast({ title: 'Success', description: 'Coupon added successfully.' });
      }
      
      setIsAddEditDialogOpen(false);
      fetchCoupons();
    } catch (err: any) {
      console.error('Error submitting coupon:', err.message);
      toast({
        title: 'Error',
        description: err.message || 'Failed to save coupon.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCoupon = (coupon: Coupon) => {
    setCouponToDelete(coupon);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteCoupon = async () => {
    if (!couponToDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', couponToDelete.id);

      if (error) throw error;

      toast({
        title: 'Coupon Deleted',
        description: `Coupon code "${couponToDelete.code}" has been deleted.`,
      });
      setIsConfirmDeleteDialogOpen(false);
      setCouponToDelete(null);
      fetchCoupons();
    } catch (err: any) {
      console.error('Error deleting coupon:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to delete coupon: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading coupons...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-background pb-16">
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-foreground">Manage Coupons</CardTitle>
          <div className="space-x-2">
            <Button onClick={fetchCoupons} variant="outline" className="flex items-center space-x-2">
              <RefreshCcw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
            <Button onClick={handleAddCoupon} className="flex items-center space-x-2">
              <PlusCircle className="h-4 w-4" />
              <span>Add Coupon</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <p className="text-center text-gray-500">No coupons found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount (%)</TableHead>
                    <TableHead>Expires On</TableHead>
                    <TableHead>Usage Limit</TableHead>
                    <TableHead>Used</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">{coupon.code}</TableCell>
                      <TableCell>{coupon.discount_percentage}%</TableCell>
                      <TableCell>{coupon.expiration_date ? new Date(coupon.expiration_date).toLocaleDateString() : 'Never'}</TableCell>
                      <TableCell>{coupon.usage_limit || 'No Limit'}</TableCell>
                      <TableCell>{coupon.current_usage_count}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {coupon.is_active ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditCoupon(coupon)}
                          className="mr-1"
                          title="Edit Coupon"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteCoupon(coupon)}
                          title="Delete Coupon"
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

      {/* Add/Edit Coupon Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="coupon-code">Code</Label>
              <Input
                id="coupon-code"
                value={couponFormData.code}
                onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value })}
                placeholder="e.g., BLACKFRIDAY20"
                required
              />
            </div>
            <div>
              <Label htmlFor="discount-percentage">Discount Percentage (%)</Label>
              <Input
                id="discount-percentage"
                type="number"
                value={couponFormData.discount_percentage}
                onChange={(e) => setCouponFormData({ ...couponFormData, discount_percentage: e.target.value })}
                min="0"
                max="100"
                step="0.01"
                required
              />
            </div>
            <div>
              <Label htmlFor="expiration-date">Expiration Date (Optional)</Label>
              <Input
                id="expiration-date"
                type="date"
                value={couponFormData.expiration_date}
                onChange={(e) => setCouponFormData({ ...couponFormData, expiration_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="usage-limit">Usage Limit (Optional, total times)</Label>
              <Input
                id="usage-limit"
                type="number"
                value={couponFormData.usage_limit}
                onChange={(e) => setCouponFormData({ ...couponFormData, usage_limit: e.target.value })}
                min="1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-active"
                checked={couponFormData.is_active}
                onCheckedChange={(checked) => setCouponFormData({ ...couponFormData, is_active: Boolean(checked) })}
              />
              <Label htmlFor="is-active">Is Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitCoupon} disabled={loading || !couponFormData.code || !couponFormData.discount_percentage}>
              {loading ? 'Saving...' : 'Save Coupon'}
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
            <p>Are you sure you want to delete coupon code "{couponToDelete?.code}"?</p>
            <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteCoupon} disabled={loading}>
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
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors flex items-center"><span className="bg-blue-700 text-white font-bold rounded-sm text-xs px-1 mr-1" style={{fontFamily:'Arial'}}>in</span><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/></svg></a>
        </div>
      </footer>
    </div>
  );
};

export default ManageCoupons;
