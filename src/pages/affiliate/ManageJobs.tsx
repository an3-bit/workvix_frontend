import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Eye, Edit, Trash2, PieChart as PieIcon } from 'lucide-react';

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 mr-2 inline-block" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const statusOptions = ['all', 'open', 'in_progress', 'completed', 'cancelled'];
const categoryOptions = ['all', 'Web Development', 'Design', 'Writing', 'Marketing', 'Other'];
const pieColors = ['#6366f1', '#10b981', '#f59e42', '#f43f5e', '#3b82f6', '#a21caf', '#eab308', '#14b8a6', '#ef4444', '#64748b'];

function formatCurrency(num: string | number) {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '$0.00';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}
function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

const ManageJobs: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', client: '', budget: '', status: 'open', category: 'Web Development' });
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [customCategory, setCustomCategory] = useState('');
  const [editCustomCategory, setEditCustomCategory] = useState('');
  const [viewJob, setViewJob] = useState<any | null>(null);
  const [editJob, setEditJob] = useState<any | null>(null);
  const [removeJob, setRemoveJob] = useState<any | null>(null);
  const { toast } = useToast();

  // Fetch current affiliate user
  const [affiliateId, setAffiliateId] = useState<string | null>(null);
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAffiliateId(user?.id || null);
    };
    getUser();
  }, []);

  // Fetch referred jobs
  useEffect(() => {
    if (!affiliateId) return;
    setLoading(true);
    supabase
      .from('referred_jobs')
      .select('*')
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
        setJobs(data || []);
        setLoading(false);
      });
  }, [affiliateId]);

  // Add job
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateId) return;
    setAdding(true);
    const categoryToSave = form.category === 'Other' ? customCategory : form.category;
    const { error } = await supabase
      .from('referred_jobs')
      .insert({
        affiliate_id: affiliateId,
        job_title: form.title,
        client_name: form.client,
        budget: form.budget,
        status: form.status,
        category: categoryToSave
      });
    setAdding(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Job added successfully!' });
      setOpen(false);
      setForm({ title: '', client: '', budget: '', status: 'open', category: 'Web Development' });
      setCustomCategory('');
      setLoading(true);
      supabase
        .from('referred_jobs')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setJobs(data || []);
          setLoading(false);
        });
    }
  };

  // Edit job
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editJob) return;
    setAdding(true);
    const categoryToSave = editJob.category === 'Other' ? editCustomCategory : editJob.category;
    const { error } = await supabase
      .from('referred_jobs')
      .update({
        job_title: editJob.title,
        client_name: editJob.client,
        budget: editJob.budget,
        status: editJob.status,
        category: categoryToSave
      })
      .eq('id', editJob.id);
    setAdding(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Job updated successfully!' });
      setEditJob(null);
      setEditCustomCategory('');
      setLoading(true);
      supabase
        .from('referred_jobs')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setJobs(data || []);
          setLoading(false);
        });
    }
  };

  // Remove job
  const handleRemove = async () => {
    if (!removeJob) return;
    setAdding(true);
    const { error } = await supabase
      .from('referred_jobs')
      .delete()
      .eq('id', removeJob.id);
    setAdding(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Job removed successfully!' });
      setRemoveJob(null);
      setLoading(true);
      supabase
        .from('referred_jobs')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setJobs(data || []);
          setLoading(false);
        });
    }
  };

  // Search and filter
  const filteredJobs = jobs.filter(j => {
    const matchesStatus = status === 'all' || j.status === status;
    const matchesCategory = category === 'all' || j.category === category || (category === 'Other' && j.category !== undefined && !categoryOptions.includes(j.category));
    const matchesSearch =
      j.job_title?.toLowerCase().includes(search.toLowerCase()) ||
      j.client_name?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Stats
  const totalJobs = jobs.length;
  const openJobs = jobs.filter(j => j.status === 'open').length;
  const completedJobs = jobs.filter(j => j.status === 'completed').length;

  // Pie chart data (by status)
  const pieData = Object.entries(
    jobs.reduce((acc: Record<string, number>, j) => {
      const s = j.status || 'Unknown';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Referred Jobs</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Add Job</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Job</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" name="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required disabled={adding} />
              </div>
              <div>
                <Label htmlFor="client">Client Name</Label>
                <Input id="client" name="client" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} required disabled={adding} />
              </div>
              <div>
                <Label htmlFor="budget">Budget</Label>
                <Input id="budget" name="budget" type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} required disabled={adding} />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={e => {
                    setForm({ ...form, category: e.target.value });
                    if (e.target.value === 'Other') setCustomCategory('');
                  }}
                  disabled={adding}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base"
                  required
                >
                  {categoryOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {form.category === 'Other' && (
                  <div className="mt-2">
                    <Label htmlFor="custom-category">Describe Category</Label>
                    <Input
                      id="custom-category"
                      name="custom-category"
                      value={customCategory}
                      onChange={e => setCustomCategory(e.target.value)}
                      required
                      disabled={adding}
                      placeholder="Enter custom category or description"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  disabled={adding}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base"
                  required
                >
                  {statusOptions.filter(opt => opt !== 'all').map(opt => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                  ))}
                </select>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" disabled={adding}>
                  {adding && <Spinner />}Add Job
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Stats and Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-blue-600">{totalJobs}</div>
          <div className="text-gray-500">Total Jobs</div>
          <div className="mt-2 text-green-600 font-semibold">Open: {openJobs} | Completed: {completedJobs}</div>
        </div>
        <div className="col-span-2 bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-2"><PieIcon className="h-5 w-5 text-purple-600" /><span className="font-semibold">Jobs by Status</span></div>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full md:w-40 h-10 rounded-md border border-input bg-background px-3 py-2 text-base"
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt === 'all' ? 'All Statuses' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full md:w-48 h-10 rounded-md border border-input bg-background px-3 py-2 text-base"
          >
            {categoryOptions.map(opt => (
              <option key={opt} value={opt}>{opt === 'all' ? 'All Categories' : opt}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Main Content */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg font-semibold text-gray-900">Jobs you have referred will appear here.</span>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-32" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No jobs found yet. Start referring to see your jobs here!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Client</th>
                  <th className="px-4 py-2 text-left">Budget</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Date Posted</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map(job => (
                  <tr key={job.id} className="border-b">
                    <td className="px-4 py-2 font-medium">{job.job_title}</td>
                    <td className="px-4 py-2">{job.client_name}</td>
                    <td className="px-4 py-2">{formatCurrency(job.budget)}</td>
                    <td className="px-4 py-2">{job.category}</td>
                    <td className="px-4 py-2">{formatDate(job.created_at)}</td>
                    <td className="px-4 py-2 capitalize">{job.status}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button size="icon" variant="ghost" title="View" onClick={() => setViewJob(job)}><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" title="Edit" onClick={() => setEditJob({ ...job, title: job.job_title, client: job.client_name })}><Edit className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" title="Remove" onClick={() => setRemoveJob(job)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* View Job Modal */}
      <Dialog open={!!viewJob} onOpenChange={() => setViewJob(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>
          {viewJob && (
            <div className="space-y-2">
              <div><b>Title:</b> {viewJob.job_title}</div>
              <div><b>Client:</b> {viewJob.client_name}</div>
              <div><b>Budget:</b> {formatCurrency(viewJob.budget)}</div>
              <div><b>Category:</b> {viewJob.category}</div>
              <div><b>Date Posted:</b> {formatDate(viewJob.created_at)}</div>
              <div><b>Status:</b> {viewJob.status}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Job Modal */}
      <Dialog open={!!editJob} onOpenChange={() => setEditJob(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>
          {editJob && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Job Title</Label>
                <Input id="edit-title" name="edit-title" value={editJob.title} onChange={e => setEditJob({ ...editJob, title: e.target.value })} required disabled={adding} />
              </div>
              <div>
                <Label htmlFor="edit-client">Client Name</Label>
                <Input id="edit-client" name="edit-client" value={editJob.client} onChange={e => setEditJob({ ...editJob, client: e.target.value })} required disabled={adding} />
              </div>
              <div>
                <Label htmlFor="edit-budget">Budget</Label>
                <Input id="edit-budget" name="edit-budget" type="number" value={editJob.budget} onChange={e => setEditJob({ ...editJob, budget: e.target.value })} required disabled={adding} />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <select
                  id="edit-category"
                  name="edit-category"
                  value={editJob.category}
                  onChange={e => {
                    setEditJob({ ...editJob, category: e.target.value });
                    if (e.target.value === 'Other') setEditCustomCategory('');
                  }}
                  disabled={adding}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base"
                  required
                >
                  {categoryOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {editJob.category === 'Other' && (
                  <div className="mt-2">
                    <Label htmlFor="edit-custom-category">Describe Category</Label>
                    <Input
                      id="edit-custom-category"
                      name="edit-custom-category"
                      value={editCustomCategory}
                      onChange={e => setEditCustomCategory(e.target.value)}
                      required
                      disabled={adding}
                      placeholder="Enter custom category or description"
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  name="edit-status"
                  value={editJob.status}
                  onChange={e => setEditJob({ ...editJob, status: e.target.value })}
                  disabled={adding}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base"
                  required
                >
                  {statusOptions.filter(opt => opt !== 'all').map(opt => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                  ))}
                </select>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" disabled={adding}>
                  {adding && <Spinner />}Save Changes
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      {/* Remove Job Confirmation Dialog */}
      <Dialog open={!!removeJob} onOpenChange={() => setRemoveJob(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Job</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to remove <b>{removeJob?.job_title}</b>?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveJob(null)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-red-600 to-pink-600 text-white" onClick={handleRemove} disabled={adding}>
              {adding && <Spinner />}Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ManageJobs; 