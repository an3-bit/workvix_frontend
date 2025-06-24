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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash, Briefcase, Eye, Download } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  min_budget: number | null;
  max_budget: number | null;
  client_id: string;
  freelancer_id?: string | null; // Optional, as jobs might be unassigned
  status: 'open' | 'assigned' | 'completed' | 'disputed' | 'cancelled';
  created_at: string;
  attachment_url?: string | null;
  client: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  freelancer?: {
    first_name: string;
    last_name: string;
    email: string;
  } | null;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: 'client' | 'freelancer' | 'admin';
}

const ManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isAllocateDialogOpen, setIsAllocateDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [availableFreelancers, setAvailableFreelancers] = useState<Profile[]>([]);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string | null>(null);
  const [newJobStatus, setNewJobStatus] = useState<Job['status'] | ''>(''); // For changing job status

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);

  // Get the 'status' parameter from the URL
  const { status } = useParams<{ status?: string }>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>(status);

  // Update filterStatus when the URL parameter changes
  useEffect(() => {
    setFilterStatus(status);
  }, [status]);


  useEffect(() => {
    fetchJobs(filterStatus); // Pass the filterStatus to fetchJobs
    fetchFreelancers();
  }, [filterStatus]); // Re-fetch jobs when filterStatus changes


  const fetchJobs = async (statusFilter?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('jobs')
        .select(`
          id, title, description, category, budget, min_budget, max_budget, client_id, freelancer_id, status, created_at, attachment_url,
          profiles!fk_jobs_client (first_name, last_name, email),
          freelancer:freelancer_id (first_name, last_name, email)
        `); // Select both client and freelancer details

      if (statusFilter && statusFilter !== 'all') { // Apply filter if it's not 'all' and exists
        if (statusFilter === 'open') {
          // Open jobs are those with status 'open' AND freelancer_id is null
          query = query.eq('status', 'open').is('freelancer_id', null);
        } else if (statusFilter === 'assigned') {
          // Assigned jobs are those with status 'assigned' AND freelancer_id is not null
          query = query.eq('status', 'assigned').not('freelancer_id', 'is', null);
        } else {
          // For other specific statuses (completed, disputed, cancelled)
          query = query.eq('status', statusFilter);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data as Job[]);
    } catch (err: any) {
      console.error('Error fetching jobs:', err.message);
      setError('Failed to fetch jobs: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch jobs.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFreelancers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('user_type', 'freelancer');

      if (error) throw error;
      setAvailableFreelancers(data as Profile[]);
    } catch (err: any) {
      console.error('Error fetching freelancers:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to fetch freelancers.',
        variant: 'destructive',
      });
    }
  };

  const handleAllocateJob = (job: Job) => {
    setSelectedJob(job);
    setSelectedFreelancerId(job.freelancer_id || null); // Pre-select if already assigned
    setNewJobStatus(job.status); // Pre-select current status
    setIsAllocateDialogOpen(true);
  };

  const submitAllocateJob = async () => {
    if (!selectedJob) return;

    setLoading(true);
    try {
      const updateData: { freelancer_id?: string | null; status?: Job['status'] } = {};

      // Handle freelancer assignment/unassignment
      if (selectedFreelancerId) {
        updateData.freelancer_id = selectedFreelancerId;
        // If an open job is assigned a freelancer, change status to 'assigned'
        if (selectedJob.status === 'open' && newJobStatus === 'open') { // Only change if status hasn't been manually overridden
          updateData.status = 'assigned';
        }
      } else {
        // If freelancer is explicitly unselected or no freelancer was selected and user wants to unassign
        updateData.freelancer_id = null;
        // If status was assigned and now freelancer is unassigned, set status to open
        if (selectedJob.status === 'assigned' && newJobStatus === 'assigned') { // Only change if status hasn't been manually overridden
          updateData.status = 'open';
        }
      }

      // Allow manual status override if selected and different from previous state
      if (newJobStatus && newJobStatus !== selectedJob.status) {
        updateData.status = newJobStatus;
        // If status is manually set to 'open', also ensure freelancer is unassigned
        if (newJobStatus === 'open') {
          updateData.freelancer_id = null;
        }
      }
      
      const { error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', selectedJob.id);

      if (error) throw error;

      toast({
        title: 'Job Updated',
        description: `Job "${selectedJob.title}" has been updated.`,
      });
      setIsAllocateDialogOpen(false);
      fetchJobs(filterStatus); // Refresh the job list with current filter
    } catch (err: any) {
      console.error('Error updating job:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to update job: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;

    setLoading(true);
    try {
      // Consider deleting associated chats, offers, notifications related to this job
      // For simplicity, we just delete the job itself. RLS should handle admin permissions.
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobToDelete.id);

      if (error) throw error;

      toast({
        title: 'Job Deleted',
        description: `Job "${jobToDelete.title}" has been deleted.`,
      });
      setIsConfirmDeleteDialogOpen(false);
      setJobToDelete(null);
      fetchJobs(filterStatus); // Refresh with current filter
    } catch (err: any) {
      console.error('Error deleting job:', err.message);
      toast({
        title: 'Error',
        description: 'Failed to delete job: ' + err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsViewDetailsDialogOpen(true);
  };

  const filteredJobs = jobs.filter(job => {
    if (!filterStatus || filterStatus === 'all') {
      return true;
    }
    if (filterStatus === 'open') {
      return job.status === 'open' && !job.freelancer_id;
    }
    if (filterStatus === 'assigned') {
      return job.status === 'assigned' && job.freelancer_id;
    }
    return job.status === filterStatus;
  });


  if (loading) {
    return <div className="p-6 text-center">Loading jobs...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Manage Jobs {filterStatus && filterStatus !== 'all' ? `(${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Jobs)` : ''}
          </CardTitle>
          <Button onClick={() => fetchJobs(filterStatus)} variant="outline">Refresh Jobs</Button>
        </CardHeader>
        <CardContent>
          {filteredJobs.length === 0 ? (
            <p className="text-center text-gray-500">No {filterStatus && filterStatus !== 'all' ? filterStatus : ''} jobs found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Assigned Freelancer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.category}</TableCell>
                      <TableCell>${job.budget}</TableCell>
                      <TableCell>{job.client?.first_name} {job.client?.last_name} ({job.client?.email})</TableCell>
                      <TableCell>
                        {job.freelancer ? `${job.freelancer.first_name} ${job.freelancer.last_name} (${job.freelancer.email})` : 'Unassigned'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          job.status === 'open' ? 'bg-blue-100 text-blue-800' :
                          job.status === 'assigned' ? 'bg-purple-100 text-purple-800' :
                          job.status === 'completed' ? 'bg-green-100 text-green-800' :
                          job.status === 'disputed' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(job)}
                          className="mr-1"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAllocateJob(job)}
                          className="mr-1"
                          title="Allocate/Update Job"
                        >
                          <Briefcase className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteJob(job)}
                          title="Delete Job"
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

      {/* Allocate/Update Job Dialog */}
      <Dialog open={isAllocateDialogOpen} onOpenChange={setIsAllocateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Job: {selectedJob?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="freelancer-select">Assign Freelancer</Label>
              <Select onValueChange={setSelectedFreelancerId} value={selectedFreelancerId || ''}>
                <SelectTrigger id="freelancer-select">
                  <SelectValue placeholder="Choose a freelancer (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassign</SelectItem> {/* Option to unassign */}
                  {availableFreelancers.length === 0 && (
                    <SelectItem value="" disabled>No freelancers available</SelectItem>
                  )}
                  {availableFreelancers.map((freelancer) => (
                    <SelectItem key={freelancer.id} value={freelancer.id}>
                      {freelancer.first_name} {freelancer.last_name} ({freelancer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="job-status-select">Update Status</Label>
              <Select onValueChange={(value: Job['status']) => setNewJobStatus(value)} value={newJobStatus}>
                <SelectTrigger id="job-status-select">
                  <SelectValue placeholder="Select job status" />
                </SelectTrigger>
                <SelectContent>
                  {['open', 'assigned', 'completed', 'disputed', 'cancelled'].map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAllocateDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitAllocateJob} disabled={loading}>
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
            <p>Are you sure you want to delete the job "{jobToDelete?.title}"?</p>
            <p className="text-sm text-red-500 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteJob} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Job Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Job Details: {selectedJob?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-gray-700">
            <div>
              <Label className="font-semibold">Description:</Label>
              <p className="whitespace-pre-wrap">{selectedJob?.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Category:</Label>
                <p>{selectedJob?.category}</p>
              </div>
              <div>
                <Label className="font-semibold">Budget:</Label>
                <p>${selectedJob?.budget} {selectedJob?.min_budget && selectedJob?.max_budget && `(${selectedJob.min_budget}-${selectedJob.max_budget})`}</p>
              </div>
            </div>
            <div>
              <Label className="font-semibold">Client:</Label>
              <p>{selectedJob?.client?.first_name} {selectedJob?.client?.last_name} ({selectedJob?.client?.email})</p>
            </div>
            <div>
              <Label className="font-semibold">Assigned Freelancer:</Label>
              <p>{selectedJob?.freelancer ? `${selectedJob.freelancer.first_name} ${selectedJob.freelancer.last_name} (${selectedJob.freelancer.email})` : 'N/A'}</p>
            </div>
            <div>
              <Label className="font-semibold">Status:</Label>
              <p>{selectedJob?.status}</p>
            </div>
            {selectedJob?.attachment_url && (
              <div>
                <Label className="font-semibold">Attachment:</Label>
                <a
                  href={selectedJob.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center mt-1"
                >
                  <Download className="h-4 w-4 mr-2" /> Download File ({selectedJob.attachment_url.split('/').pop()})
                </a>
              </div>
            )}
            <div>
              <Label className="font-semibold">Posted On:</Label>
              <p>{new Date(selectedJob?.created_at || '').toLocaleDateString()}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageJobs;