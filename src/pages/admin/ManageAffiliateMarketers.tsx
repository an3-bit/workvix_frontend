import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserCheck, Mail, Users, Eye, Ban, Trash, DollarSign } from 'lucide-react';

interface AffiliateMarketer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  status?: string; // active/disabled (mock)
  total_referrals?: number; // mock
  earnings?: number; // mock
}

const ManageAffiliateMarketers: React.FC = () => {
  const [affiliates, setAffiliates] = useState<AffiliateMarketer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, user_type')
        .eq('user_type', 'affiliate_marketer');
      if (error) throw error;
      // Add mock data for status, referrals, earnings
      const withMock = (data as AffiliateMarketer[]).map(a => ({
        ...a,
        status: 'active',
        total_referrals: Math.floor(Math.random() * 100),
        earnings: Math.floor(Math.random() * 10000) / 100,
      }));
      setAffiliates(withMock);
    } catch (err: any) {
      setError('Failed to fetch affiliate marketers: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-0 sm:p-6 min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-100">
      <Card className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-2 p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600 drop-shadow-lg" />
            <span className="text-2xl font-extrabold text-gray-900 tracking-tight">Affiliate Marketers</span>
          </div>
          <Button onClick={fetchAffiliates} variant="outline" className="flex items-center space-x-2 mt-2 sm:mt-0">
            <DollarSign className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">Loading affiliate marketers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : affiliates.length === 0 ? (
            <p className="text-center text-gray-500">No affiliate marketers found.</p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="overflow-x-auto rounded-lg hidden sm:block">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Referrals</TableHead>
                      <TableHead>Earnings</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliates.map((a, idx) => (
                      <TableRow key={a.id} className={`transition-all duration-300 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50/60 hover:shadow-md animate-fade-in-row`}>
                        <TableCell className="font-medium text-gray-900">{a.first_name} {a.last_name}</TableCell>
                        <TableCell className="flex items-center gap-2"><Mail className="h-4 w-4 text-blue-400" />{a.email}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${a.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{a.status}</span>
                        </TableCell>
                        <TableCell>{a.total_referrals}</TableCell>
                        <TableCell>${a.earnings?.toLocaleString()}</TableCell>
                        <TableCell className="text-right flex gap-2 justify-end">
                          <Button variant="outline" size="sm" className="transition-transform hover:scale-110 hover:bg-blue-50 hover:text-blue-700" title="View"><Eye className="h-4 w-4" /></Button>
                          <Button variant="destructive" size="sm" className="transition-transform hover:scale-110 hover:bg-yellow-100 hover:text-yellow-700" title="Deactivate"><Ban className="h-4 w-4" /></Button>
                          <Button variant="destructive" size="sm" className="transition-transform hover:scale-110 hover:bg-red-100 hover:text-red-700" title="Delete"><Trash className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Mobile Card View */}
              <div className="flex flex-col gap-4 sm:hidden">
                {affiliates.map((a) => (
                  <div key={a.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 animate-fade-in-row">
                    <div className="flex items-center gap-2 mb-1">
                      <UserCheck className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold text-base text-gray-900">{a.first_name} {a.last_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600"><Mail className="h-4 w-4" />{a.email}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${a.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{a.status}</span>
                      <span className="ml-2">Referrals: <b>{a.total_referrals}</b></span>
                      <span className="ml-2">Earnings: <b>${a.earnings?.toLocaleString()}</b></span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="flex-1 transition-transform hover:scale-105 hover:bg-blue-50 hover:text-blue-700" title="View"><Eye className="h-4 w-4 mr-1" />View</Button>
                      <Button variant="destructive" size="sm" className="flex-1 transition-transform hover:scale-105 hover:bg-yellow-100 hover:text-yellow-700" title="Deactivate"><Ban className="h-4 w-4 mr-1" />Deactivate</Button>
                      <Button variant="destructive" size="sm" className="flex-1 transition-transform hover:scale-105 hover:bg-red-100 hover:text-red-700" title="Delete"><Trash className="h-4 w-4 mr-1" />Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageAffiliateMarketers; 