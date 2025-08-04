import React, { useState, useEffect } from 'react';
import { Users, Eye, Edit, Trash2, PieChart as PieIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 mr-2 inline-block" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

// Kenyan counties and a few other countries
const locationOptions = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Kiambu', 'Machakos', 'Kakamega', 'Meru', 'Uasin Gishu',
  'Kisii', 'Kericho', 'Nyeri', 'Embu', 'Kitui', 'Kilifi', 'Bungoma', 'Busia', 'Siaya', 'Homa Bay', 'Migori',
  "Murang'a", 'Laikipia', 'Bomet', 'Vihiga', 'Turkana', 'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo',
  'Samburu', 'Trans Nzoia', 'West Pokot', 'Taita Taveta', 'Kwale', 'Tana River', 'Lamu', 'Narok', 'Kajiado',
  'Baringo', 'Samburu', 'Nandi', 'Other (Kenya)',
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'India', 'Nigeria', 'South Africa', 'Other'
];
const statusOptions = ['all', 'pending', 'active', 'inactive'];
const pieColors = ['#6366f1', '#10b981', '#f59e42', '#f43f5e', '#3b82f6', '#a21caf', '#eab308', '#14b8a6', '#ef4444', '#64748b'];

const ManageClients: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', customLocation: '' });
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [viewClient, setViewClient] = useState<any | null>(null);
  const [editClient, setEditClient] = useState<any | null>(null);
  const [removeClient, setRemoveClient] = useState<any | null>(null);
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

  // Fetch referred clients
  useEffect(() => {
    if (!affiliateId) return;
    setLoading(true);
    supabase
      .from('referrals')
      .select('*')
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
        setClients(data || []);
        setLoading(false);
      });
  }, [affiliateId]);

  // Add client
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateId) return;
    setAdding(true);
    const locationToSave = (form.location === 'Other' || form.location === 'Other (Kenya)') && form.customLocation
      ? form.customLocation
      : form.location;
    const { error } = await supabase
      .from('referrals')
      .insert({
        affiliate_id: affiliateId,
        client_name: form.name,
        client_email: form.email,
        phone: form.phone,
        location: locationToSave,
        status: 'pending'
      });
    setAdding(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Client added successfully!' });
      setOpen(false);
      setForm({ name: '', email: '', phone: '', location: '', customLocation: '' });
      setLoading(true);
      supabase
        .from('referrals')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setClients(data || []);
          setLoading(false);
        });
    }
  };

  // Edit client
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClient) return;
    setAdding(true);
    const locationToSave = (editClient.location === 'Other' || editClient.location === 'Other (Kenya)') && editClient.customLocation
      ? editClient.customLocation
      : editClient.location;
    const { error } = await supabase
      .from('referrals')
      .update({
        client_name: editClient.name,
        client_email: editClient.email,
        phone: editClient.phone,
        location: locationToSave
      })
      .eq('id', editClient.id);
    setAdding(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Client updated successfully!' });
      setEditClient(null);
      setLoading(true);
      supabase
        .from('referrals')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setClients(data || []);
          setLoading(false);
        });
    }
  };

  // Remove client
  const handleRemove = async () => {
    if (!removeClient) return;
    setAdding(true);
    const { error } = await supabase
      .from('referrals')
      .delete()
      .eq('id', removeClient.id);
    setAdding(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Client removed successfully!' });
      setRemoveClient(null);
      setLoading(true);
      supabase
        .from('referrals')
        .select('*')
        .eq('affiliate_id', affiliateId)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          setClients(data || []);
          setLoading(false);
        });
    }
  };

  // Search and filter
  const filteredClients = clients.filter(
    c =>
      (status === 'all' || c.status === status) &&
      (c.client_name?.toLowerCase().includes(search.toLowerCase()) ||
        c.client_email?.toLowerCase().includes(search.toLowerCase()) ||
        c.location?.toLowerCase().includes(search.toLowerCase()))
  );

  // Stats
  const totalClients = clients.length;
  const newThisMonth = clients.filter(c => {
    const d = new Date(c.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Pie chart data (by location)
  const pieData = Object.entries(
    clients.reduce((acc: Record<string, number>, c) => {
      const loc = c.location || 'Unknown';
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Referred Clients</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Add Client</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
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
                <Label htmlFor="location">Location</Label>
                <select
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value, customLocation: '' })}
                  disabled={adding}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base"
                  required
                >
                  <option value="">Select location...</option>
                  {locationOptions.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                {(form.location === 'Other' || form.location === 'Other (Kenya)') && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom location"
                    value={form.customLocation}
                    onChange={e => setForm({ ...form, customLocation: e.target.value })}
                    disabled={adding}
                    required
                  />
                )}
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" disabled={adding}>
                  {adding && <Spinner />}Add Client
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Stats and Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-blue-600">{totalClients}</div>
          <div className="text-gray-500">Total Clients</div>
          <div className="mt-2 text-green-600 font-semibold">+{newThisMonth} this month</div>
        </div>
        <div className="col-span-2 bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-2"><PieIcon className="h-5 w-5 text-purple-600" /><span className="font-semibold">Clients by Location</span></div>
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
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="w-full md:w-48 h-10 rounded-md border border-input bg-background px-3 py-2 text-base"
        >
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt === 'all' ? 'All Statuses' : opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
          ))}
        </select>
      </div>
      {/* Main Content */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">Clients you have referred will appear here.</span>
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
        ) : filteredClients.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No clients found yet. Start referring to see your clients here!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Date Referred</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(client => (
                  <tr key={client.id} className="border-b">
                    <td className="px-4 py-2 font-medium">{client.client_name}</td>
                    <td className="px-4 py-2">{client.client_email}</td>
                    <td className="px-4 py-2">{client.phone}</td>
                    <td className="px-4 py-2">{client.location}</td>
                    <td className="px-4 py-2">{client.created_at ? new Date(client.created_at).toLocaleDateString() : ''}</td>
                    <td className="px-4 py-2 capitalize">{client.status}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Button size="icon" variant="ghost" title="View" onClick={() => setViewClient(client)}><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" title="Edit" onClick={() => setEditClient({ ...client, name: client.client_name, customLocation: '' })}><Edit className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" title="Remove" onClick={() => setRemoveClient(client)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* View Client Modal */}
      <Dialog open={!!viewClient} onOpenChange={() => setViewClient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          {viewClient && (
            <div className="space-y-2">
              <div><b>Name:</b> {viewClient.client_name}</div>
              <div><b>Email:</b> {viewClient.client_email}</div>
              <div><b>Phone:</b> {viewClient.phone}</div>
              <div><b>Location:</b> {viewClient.location}</div>
              <div><b>Date Referred:</b> {viewClient.created_at ? new Date(viewClient.created_at).toLocaleDateString() : ''}</div>
              <div><b>Status:</b> {viewClient.status}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Edit Client Modal */}
      <Dialog open={!!editClient} onOpenChange={() => setEditClient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          {editClient && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" name="edit-name" value={editClient.name} onChange={e => setEditClient({ ...editClient, name: e.target.value })} required disabled={adding} />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="edit-email" type="email" value={editClient.email} onChange={e => setEditClient({ ...editClient, email: e.target.value })} required disabled={adding} />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" name="edit-phone" value={editClient.phone} onChange={e => setEditClient({ ...editClient, phone: e.target.value })} disabled={adding} />
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <select
                  id="edit-location"
                  name="edit-location"
                  value={editClient.location}
                  onChange={e => setEditClient({ ...editClient, location: e.target.value, customLocation: '' })}
                  disabled={adding}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base"
                  required
                >
                  <option value="">Select location...</option>
                  {locationOptions.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                {(editClient.location === 'Other' || editClient.location === 'Other (Kenya)') && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom location"
                    value={editClient.customLocation}
                    onChange={e => setEditClient({ ...editClient, customLocation: e.target.value })}
                    disabled={adding}
                    required
                  />
                )}
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
      {/* Remove Client Confirmation Dialog */}
      <Dialog open={!!removeClient} onOpenChange={() => setRemoveClient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Client</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to remove <b>{removeClient?.client_name}</b>?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveClient(null)}>Cancel</Button>
            <Button className="bg-gradient-to-r from-red-600 to-pink-600 text-white" onClick={handleRemove} disabled={adding}>
              {adding && <Spinner />}Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ManageClients; 