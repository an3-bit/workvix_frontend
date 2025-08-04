import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCcw, Eye, Trash, Plus } from 'lucide-react';

interface TalentPoolEntry {
  id: string;
  freelancer_id: string;
  achievements: string;
  selected_by: string | null;
  selected_at: string;
  notes: string | null;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const ManageTalentPool: React.FC = () => {
  const [talentPool, setTalentPool] = useState<TalentPoolEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [allFreelancers, setAllFreelancers] = useState<any[]>([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState<string>('');
  const [achievements, setAchievements] = useState('');
  const [notes, setNotes] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [viewEntry, setViewEntry] = useState<TalentPoolEntry | null>(null);

  useEffect(() => {
    fetchTalentPool();
  }, []);

  const fetchTalentPool = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('talent_pool')
        .select('*, profile:freelancer_id(first_name, last_name, email)')
        .order('selected_at', { ascending: false });
      if (error) throw error;
      setTalentPool(data as TalentPoolEntry[]);
    } catch (err: any) {
      setError('Failed to fetch talent pool: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFreelancers = async () => {
    // Only fetch freelancers not already in the pool
    const poolIds = talentPool.map(e => e.freelancer_id);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email')
      .eq('user_type', 'freelancer')
      .not('id', 'in', '(' + poolIds.join(',') + ')');
    if (!error) setAllFreelancers(data || []);
  };

  const handleAddToPool = async () => {
    if (!selectedFreelancer || !achievements) return;
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const adminId = userData.user?.id;
      const { error } = await supabase.from('talent_pool').insert({
        freelancer_id: selectedFreelancer,
        achievements,
        notes,
        selected_by: adminId,
      });
      if (error) throw error;
      setShowAddDialog(false);
      setSelectedFreelancer('');
      setAchievements('');
      setNotes('');
      fetchTalentPool();
    } catch (err: any) {
      setError('Failed to add to talent pool: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      const { error } = await supabase.from('talent_pool').delete().eq('id', id);
      if (error) throw error;
      fetchTalentPool();
    } catch (err: any) {
      setError('Failed to remove from talent pool: ' + err.message);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Talent Pool</CardTitle>
          <div className="flex gap-2">
            <Button onClick={fetchTalentPool} variant="outline"><RefreshCcw className="h-4 w-4" /></Button>
            <Button onClick={() => { setShowAddDialog(true); fetchFreelancers(); }} variant="default" className="flex items-center gap-2"><Plus className="h-4 w-4" />Add to Pool</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : talentPool.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No freelancers in the talent pool yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Achievements</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {talentPool.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.profile?.first_name} {entry.profile?.last_name}</TableCell>
                      <TableCell>{entry.profile?.email}</TableCell>
                      <TableCell className="max-w-[250px] truncate">{entry.achievements}</TableCell>
                      <TableCell>{new Date(entry.selected_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => setViewEntry(entry)} title="View Details"><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleRemove(entry.id)} disabled={removingId === entry.id}><Trash className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add to Pool Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Freelancer to Talent Pool</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Freelancer</Label>
              <select className="w-full border rounded px-3 py-2" value={selectedFreelancer} onChange={e => setSelectedFreelancer(e.target.value)}>
                <option value="">Select...</option>
                {allFreelancers.map(f => (
                  <option key={f.id} value={f.id}>{f.first_name} {f.last_name} ({f.email})</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Achievements / Reason for Selection</Label>
              <Input value={achievements} onChange={e => setAchievements(e.target.value)} placeholder="e.g. Top-rated, 50+ jobs, etc." />
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Admin notes..." />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddToPool} disabled={!selectedFreelancer || !achievements}>
              Add to Pool
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!viewEntry} onOpenChange={() => setViewEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Talent Pool Member Details</DialogTitle>
          </DialogHeader>
          {viewEntry && (
            <div className="space-y-2">
              <div><b>Name:</b> {viewEntry.profile?.first_name} {viewEntry.profile?.last_name}</div>
              <div><b>Email:</b> {viewEntry.profile?.email}</div>
              <div><b>Achievements:</b> {viewEntry.achievements}</div>
              <div><b>Date Added:</b> {new Date(viewEntry.selected_at).toLocaleString()}</div>
              {viewEntry.notes && <div><b>Notes:</b> {viewEntry.notes}</div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageTalentPool; 