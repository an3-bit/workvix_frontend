import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X, RefreshCcw, Eye } from 'lucide-react';

interface FreelancerApplication {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  portfolio_url: string | null;
  experience_years: number | null;
  specializations: string[] | null;
  created_at: string;
  reviewed_at: string | null;
  reviewer_id: string | null;
  user_profile?: { first_name: string; last_name: string; email: string } | null; // Joined from profiles
}

const ManageFreelancerApplications: React.FC = () => {
  const [applications, setApplications] = useState<FreelancerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<FreelancerApplication | null>(null);

  const [isConfirmActionDialogOpen, setIsConfirmActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [applicationToAction, setApplicationToAction] = useState<FreelancerApplication | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('freelancer_applications')
        .select(`
          *,
          user_profile:user_id(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data as FreelancerApplication[]);
    } catch (err: any) {
      console.error('Error fetching applications:', err.message);
      setError('Failed to fetch applications: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch applications.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application: FreelancerApplication) => {
    setSelectedApplication(application);
    setIsViewDetailsDialogOpen(true);
  };

  const handleApproveReject = (application: FreelancerApplication, type: 'approve' | 'reject') => {
    setApplicationToAction(application);
    setActionType(type);
    setIsConfirmActionDialogOpen(true);
  };

  const confirmAction = async () => {
    if (!applicationToAction || !actionType) return;

    setLoading(true);
    try {
      const newStatus = actionType === 'approve' ? 'approved' : 'rejected';
      
      const { error: updateError } = await supabase
        .from('freelancer_applications')
        .update({ 
          status: newStatus, 
          reviewed_at: new Date().toISOString(),
          reviewer_id: (await supabase.auth.getUser()).data.user?.id // Log admin who reviewed
        })
        .eq('id', applicationToAction.id);

      if (updateError) throw updateError;

      // If approved, also update the user's profile to 'freelancer' user_type
      if (newStatus === 'approved') {
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ user_type: 'freelancer' })
          .eq('id', applicationToAction.user_id);

        if (profileUpdateError) console.error('Error updating user profile type:', profileUpdateError.message);
      }

      toast({
        title: `Application ${actionType === 'approve' ? 'Approved' : 'Rejected'}`,
        description: `Application for ${applicationToAction.user_profile?.first_name} has been ${newStatus}.`,
      });
      setIsConfirmActionDialogOpen(false);
      setApplicationToAction(null);
      setActionType(null);
      fetchApplications();
    } catch (err: any) {
      console.error('Error processing application:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to process application: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading applications...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">Freelancer Applications</CardTitle>
          <Button onClick={fetchApplications} variant="outline" className="flex items-center space-x-2">
            <RefreshCcw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center text-gray-500">No new applications found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Specializations</TableHead>
                    <TableHead>Portfolio</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.user_profile?.first_name} {app.user_profile?.last_name}</TableCell>
                      <TableCell>{app.user_profile?.email}</TableCell>
                      <TableCell>{app.experience_years || 'N/A'} yrs</TableCell>
                      <TableCell className="max-w-[150px] truncate">{app.specializations?.join(', ') || 'N/A'}</TableCell>
                      <TableCell>
                        {app.portfolio_url ? (
                          <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            View
                          </a>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetails(app)}
                          className="mr-1"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {app.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveReject(app, 'approve')}
                              className="bg-green-600 hover:bg-green-700 text-white mr-1"
                              title="Approve Application"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleApproveReject(app, 'reject')}
                              title="Reject Application"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Application Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Application Details: {selectedApplication?.user_profile?.first_name} {selectedApplication?.user_profile?.last_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-gray-700">
            <div>
              <Label className="font-semibold">Email:</Label>
              <p>{selectedApplication?.user_profile?.email}</p>
            </div>
            <div>
              <Label className="font-semibold">Experience:</Label>
              <p>{selectedApplication?.experience_years || 'N/A'} years</p>
            </div>
            <div>
              <Label className="font-semibold">Specializations:</Label>
              <p>{selectedApplication?.specializations?.join(', ') || 'N/A'}</p>
            </div>
            {selectedApplication?.portfolio_url && (
              <div>
                <Label className="font-semibold">Portfolio URL:</Label>
                <a 
                  href={selectedApplication.portfolio_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline flex items-center mt-1"
                >
                  {selectedApplication.portfolio_url}
                </a>
              </div>
            )}
            <div>
              <Label className="font-semibold">Status:</Label>
              <p>{selectedApplication?.status}</p>
            </div>
            <div>
              <Label className="font-semibold">Applied On:</Label>
              <p>{new Date(selectedApplication?.created_at || '').toLocaleDateString()}</p>
            </div>
            {selectedApplication?.reviewed_at && (
              <div>
                <Label className="font-semibold">Reviewed On:</Label>
                <p>{new Date(selectedApplication.reviewed_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Approve/Reject Dialog */}
      <Dialog open={isConfirmActionDialogOpen} onOpenChange={setIsConfirmActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to {actionType} the application for {applicationToAction?.user_profile?.first_name} {applicationToAction?.user_profile?.last_name}?</p>
            <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmActionDialogOpen(false)}>Cancel</Button>
            <Button 
              variant={actionType === 'approve' ? 'default' : 'destructive'} 
              onClick={confirmAction} 
              disabled={loading}
            >
              {loading ? 'Processing...' : (actionType === 'approve' ? 'Approve' : 'Reject')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageFreelancerApplications;