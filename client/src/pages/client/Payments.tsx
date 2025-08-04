import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DollarSign } from 'lucide-react';

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setLoading(false);
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) setPayments(data);
      setLoading(false);
    };
    fetchPayments();
  }, []);

  const formatCurrency = (num: number) => num?.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }) || '$0';

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <DollarSign className="h-7 w-7 text-blue-600" /> Payment History
      </h1>
      {loading ? (
        <div className="text-center py-12 text-lg">Loading payments...</div>
      ) : payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <DollarSign className="h-12 w-12 text-gray-300 mb-4" />
          <div className="text-gray-400 text-center text-lg font-medium">No payments found.<br/>Your payments will appear here.</div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-700">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{payment.status || 'Completed'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{payment.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payments; 