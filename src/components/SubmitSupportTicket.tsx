import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const SubmitSupportTicket: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to submit a support ticket.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      // Insert ticket
      const { error } = await supabase.from('support_tickets').insert({
        user_id: user.id,
        subject,
        description,
        status: 'open',
        priority,
        assigned_to_admin_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      toast({
        title: 'Support Ticket Submitted',
        description: 'Your support ticket has been submitted. Our team will get back to you soon.',
      });
      setSubject('');
      setDescription('');
      setPriority('medium');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to submit support ticket.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-card p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-2 text-foreground">Submit a Support Ticket</h2>
      <div>
        <label className="block font-medium mb-1 text-foreground">Subject</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
=======
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-2">Submit a Support Ticket</h2>
      <div>
        <label className="block font-medium mb-1">Subject</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
>>>>>>> a02f476 (admin dashboard)
          value={subject}
          onChange={e => setSubject(e.target.value)}
          required
        />
      </div>
      <div>
<<<<<<< HEAD
        <label className="block font-medium mb-1 text-foreground">Description</label>
        <textarea
          className="w-full border rounded px-3 py-2 min-h-[100px] bg-background text-foreground"
=======
        <label className="block font-medium mb-1">Description</label>
        <textarea
          className="w-full border rounded px-3 py-2 min-h-[100px]"
>>>>>>> a02f476 (admin dashboard)
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
<<<<<<< HEAD
        <label className="block font-medium mb-1 text-foreground">Priority</label>
        <select
          className="w-full border rounded px-3 py-2 bg-background text-foreground"
=======
        <label className="block font-medium mb-1">Priority</label>
        <select
          className="w-full border rounded px-3 py-2"
>>>>>>> a02f476 (admin dashboard)
          value={priority}
          onChange={e => setPriority(e.target.value)}
        >
          {priorities.map(p => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
<<<<<<< HEAD
        className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
=======
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
>>>>>>> a02f476 (admin dashboard)
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Ticket'}
      </button>
    </form>
  );
};

export default SubmitSupportTicket; 