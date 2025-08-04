import React, { useState, useEffect } from 'react';
import { ClipboardList, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 mr-2 inline-block" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const ManageFreelancers: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', skills: '', location: '' });
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
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

  // Fetch referred freelancers
  useEffect(() => {
    if (!affiliateId) return;
    setLoading(true);
    supabase
      .from('referred_freelancers')
      .select('*')
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
        setFreelancers(data || []);
        setLoading(false);
      });
  }, [affiliateId]);

  // Add freelancer
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateId) return;
    setAdding(true);
    const { error } = await supabase
      .from('referred_freelancers')
      .insert({
        affiliate_id: affiliateId,
        freelancer_name: form.name,
        freelancer_email: form.email,
        phone: form.phone,
        skills: form.skills,
        location: form.location,
        status: 'pending'
      });
    setAdding(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Freelancer added successfully!' });
      setOpen(false);
      setForm({ name: '', email: '', phone: '', skills: '', location: '' });
      setLoading(true);
      supabase
        .from('referred_freelancers')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setFreelancers(data || []);
          setLoading(false);
        });
    }
  };

  // Search filter
  const filteredFreelancers = freelancers.filter(
    f =>
      f.freelancer_name?.toLowerCase().includes(search.toLowerCase()) ||
      f.freelancer_email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      {/* Topbar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Referred Freelancers</h1>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <Input
            placeholder="Search freelancers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Add Freelancer</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Freelancer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required disabled={adding} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required disabled={adding} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} disabled={adding} />
                </div>
                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Input id="skills" name="skills" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="e.g. Web Development, Design" disabled={adding} />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} disabled={adding} />
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" disabled={adding}>
                    {adding && <Spinner />}Add Freelancer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {/* Main Content */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <ClipboardList className="h-6 w-6 text-purple-600" />
          <span className="text-lg font-semibold text-gray-900">Freelancers you have referred will appear here.</span>
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
        ) : filteredFreelancers.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No freelancers found yet. Start referring to see your freelancers here!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Skills</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Date Referred</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFreelancers.map(freelancer => (
                  <tr key={freelancer.id} className="border-b">
                    <td className="px-4 py-2 font-medium">{freelancer.freelancer_name}</td>
                    <td className="px-4 py-2">{freelancer.freelancer_email}</td>
                    <td className="px-4 py-2">{freelancer.phone}</td>
                    <td className="px-4 py-2">{freelancer.skills}</td>
                    <td className="px-4 py-2">{freelancer.location}</td>
                    <td className="px-4 py-2">{freelancer.created_at ? new Date(freelancer.created_at).toLocaleDateString() : ''}</td>
                    <td className="px-4 py-2 capitalize">{freelancer.status}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button size="icon" variant="ghost" title="View"><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" title="Edit"><Edit className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" title="Remove"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default ManageFreelancers; 