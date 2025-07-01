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
<<<<<<< HEAD
<<<<<<< HEAD
    <>
      <div className="p-6 bg-background pb-16">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-foreground">Activity Log</CardTitle>
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
        <footer className="fixed bottom-0 left-0 w-full z-50 border-t border-border bg-card py-2 px-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>Admin Dashboard © {new Date().getFullYear()} WorkVix</span>
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-600 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-black transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.53 2H21l-7.19 8.24L22 22h-6.47l-5.1-6.2L4 22H1l7.64-8.74L2 2h6.47l4.73 5.75L17.53 2zm-2.13 16.98h1.77l-5.13-6.24-1.77 2.13 5.13 6.24z"/></svg></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-700 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/></svg></a>
          </div>
        </footer>
      </div>
    </>
=======
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
=======
    <div className="p-6 bg-background">
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-foreground">Activity Log</CardTitle>
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
>>>>>>> 7438431 (admin dashboard)
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
<<<<<<< HEAD
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
>>>>>>> a02f476 (admin dashboard)
=======
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
    </div>
>>>>>>> 7438431 (admin dashboard)
  );
};

export default ActivityLog; 