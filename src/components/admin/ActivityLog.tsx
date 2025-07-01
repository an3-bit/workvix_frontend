import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface ActivityLogEntry {
  id: string;
  type: string;
  description: string;
  user_email: string;
  created_at: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    // Realtime subscription
    const channel = supabase
      .channel('activity_log_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, (payload) => {
        setActivities(prev => [payload.new as ActivityLogEntry, ...prev].slice(0, 50));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error && data) {
      setActivities(data as ActivityLogEntry[]);
    }
    setLoading(false);
  };

  // Prepare data for charts
  const activityByDay = Object.values(
    activities.reduce((acc, entry) => {
      const day = new Date(entry.created_at).toLocaleDateString();
      acc[day] = acc[day] || { day, count: 0 };
      acc[day].count++;
      return acc;
    }, {} as Record<string, { day: string; count: number }>)
  );

  const activityByType = Object.values(
    activities.reduce((acc, entry) => {
      acc[entry.type] = acc[entry.type] || { type: entry.type, count: 0 };
      acc[entry.type].count++;
      return acc;
    }, {} as Record<string, { type: string; count: number }>)
  );

  return (
    <Card className="max-w-5xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading activity log...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No activity found.</div>
        ) : (
          <>
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Activity by Day</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={activityByDay} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <XAxis dataKey="day" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Activity by Type</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={activityByType}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {activityByType.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.type}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{entry.user_email}</TableCell>
                      <TableCell>{new Date(entry.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityLog; 