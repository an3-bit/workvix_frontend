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
import { Edit, Trash, Briefcase, Eye, Download, UserCheck, CheckCircle, AlertTriangle, Unlock, Menu, ListChecks, ListOrdered, CheckCircle2, XOctagon, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useParams } from 'react-router-dom'; // Import useParams to get URL parameters
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

const jobStatusFilters = [
  { key: 'all', label: 'All Jobs', icon: <ListOrdered className="w-5 h-5 mr-2" /> },
  { key: 'open', label: 'Open', icon: <Unlock className="w-5 h-5 mr-2" /> },
  { key: 'assigned', label: 'Assigned', icon: <UserCheck className="w-5 h-5 mr-2" /> },
  { key: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-5 h-5 mr-2" /> },
  { key: 'disputed', label: 'Disputed', icon: <AlertTriangle className="w-5 h-5 mr-2" /> },
  { key: 'cancelled', label: 'Cancelled', icon: <XOctagon className="w-5 h-5 mr-2" /> },
];

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

  // Add a state for the active tab
  const [activeTab, setActiveTab] = useState<string>('all');

  // Update filterStatus when the active tab changes
  useEffect(() => {
    setFilterStatus(activeTab === 'all' ? undefined : activeTab);
  }, [activeTab]);

  useEffect(() => {
    fetchJobs(filterStatus); // Pass the filterStatus to fetchJobs
    fetchFreelancers();
  }, [filterStatus]); // Re-fetch jobs when filterStatus changes

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768); // expanded on desktop, collapsed on mobile

  const fetchJobs = async (statusFilter?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('jobs')
        .select(`
          id, title, description, category, budget, min_budget, max_budget, client_id, freelancer_id, status, created_at, attachment_url,
          client:profiles!fk_client_profile (first_name, last_name, email),
          freelancer:profiles!fk_freelancer_profile (first_name, last_name, email)
        `); // Select both client and freelancer details with correct alias and constraint names

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
        .select('*')
        .eq('user_type', 'freelancer');
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
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

  // Debug log
  console.log('Filter:', filterStatus, 'Jobs:', jobs);

  const filteredJobs = jobs.filter(job => {
    if (!filterStatus || filterStatus === 'all') return true;

    switch (filterStatus) {
      case 'open':
        // Open jobs: status is 'open' and not assigned
        return job.status === 'open' && !job.freelancer_id;
      case 'assigned':
        // Assigned jobs: status is 'assigned' and has a freelancer
        return job.status === 'assigned' && !!job.freelancer_id;
      case 'completed':
        return job.status === 'completed';
      case 'disputed':
        return job.status === 'disputed';
      case 'cancelled':
        return job.status === 'cancelled';
      default:
        return job.status === filterStatus;
    }
  });


  if (loading) {
    return <div className="p-6 text-center">Loading jobs...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-background min-h-screen pb-8">
      <div className="flex flex-row gap-0">
        {/* Sidebar */}
        <aside className={`transition-all duration-200 bg-card border-r border-border ${sidebarOpen ? 'w-full md:w-64' : 'w-16'} p-4 flex flex-col items-center md:items-stretch min-h-screen`}>
          <button
            className="mb-4 p-2 rounded hover:bg-gray-100 focus:outline-none self-end md:self-start"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Menu className="w-6 h-6" />
          </button>
          <nav className="space-y-2 w-full">
            {jobStatusFilters.map(filter => (
              <button
                key={filter.key}
                className={`flex items-center w-full px-3 py-2 rounded-lg transition font-bold text-base text-left ${activeTab === filter.key ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'} ${!sidebarOpen ? 'justify-center' : ''}`}
                onClick={() => setActiveTab(filter.key)}
              >
                {filter.icon}
                {sidebarOpen && <span>{filter.label}</span>}
              </button>
            ))}
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 flex flex-col min-h-screen bg-card text-foreground">
          <div className="max-w-6xl mx-auto w-full flex flex-col h-full">
            <h1 className="text-4xl font-extrabold mb-6 flex items-center"><Briefcase className="w-8 h-8 mr-2 text-blue-600" /> Manage Jobs</h1>
            {/* Jobs List/Table Container */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-120px)]"> {/* Adjust 120px if your header is taller/shorter */}
              {/* Responsive jobs list: table on desktop, cards on mobile */}
              <div className="hidden sm:block">
                <Card className="border border-border shadow-2xl rounded-2xl bg-card animate-fade-in">
                  <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 p-4 sm:p-6">
                    <CardTitle className="font-bold text-lg sm:text-2xl text-foreground w-full sm:w-auto break-words whitespace-normal m-0 p-0">
                      {activeTab === 'all' ? 'All Jobs' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Jobs`}
                    </CardTitle>
                    <Button onClick={() => fetchJobs(filterStatus)} variant="outline" className="mt-2 sm:mt-0">Refresh Jobs</Button>
                  </CardHeader>
                  <CardContent>
                    {filteredJobs.length === 0 ? (
                      <p className="text-center text-gray-500">No {filterStatus && filterStatus !== 'all' ? filterStatus : ''} jobs found.</p>
                    ) : (
                      <>
                        <Table className="min-w-full">
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredJobs.map((job, idx) => (
                              <TableRow key={job.id} className={`transition-all duration-300 ${idx % 2 === 0 ? 'bg-muted' : 'bg-card'} hover:bg-blue-50/60 dark:hover:bg-blue-900/40 hover:shadow-md animate-fade-in-row`}>
                                <TableCell className="font-medium text-foreground">{job.title}</TableCell>
                                <TableCell>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm border inline-flex items-center gap-1 transition-all duration-200 ${
                                    job.status === 'open' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                    job.status === 'assigned' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                    job.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                                    job.status === 'disputed' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                    'bg-gray-100 text-gray-800 border-gray-200'
                                  }`}>
                                    {job.status === 'open' && <Unlock className="h-3 w-3 mr-1" />}
                                    {job.status === 'assigned' && <UserCheck className="h-3 w-3 mr-1" />}
                                    {job.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                                    {job.status === 'disputed' && <AlertTriangle className="h-3 w-3 mr-1" />}
                                    {job.status}
                                  </span>
                                </TableCell>
                                <TableCell className="text-right whitespace-nowrap">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewDetails(job)}
                                    className="mr-1 transition-transform hover:scale-110 hover:bg-blue-50 hover:text-blue-700"
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAllocateJob(job)}
                                    className="mr-1 transition-transform hover:scale-110 hover:bg-purple-50 hover:text-purple-700"
                                    title="Allocate/Update Job"
                                  >
                                    <Briefcase className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteJob(job)}
                                    className="transition-transform hover:scale-110 hover:bg-red-100 hover:text-red-700"
                                    title="Delete Job"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
              <div className="block sm:hidden space-y-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="p-4 flex flex-col gap-2 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-lg truncate">{job.title}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${job.status === 'open' ? 'bg-blue-100 text-blue-800' : job.status === 'assigned' ? 'bg-purple-100 text-purple-800' : job.status === 'completed' ? 'bg-green-100 text-green-800' : job.status === 'disputed' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>{job.status.replace('_', ' ')}</span>
                    </div>
                    <div className="text-sm text-gray-500 truncate">{job.description}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(job)}><Eye className="w-4 h-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteJob(job)}><Trash className="w-4 h-4" /></Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

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
        </main>
      </div>
    </div>
  );
};

export default ManageJobs;