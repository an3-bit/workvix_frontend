import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const availableCommission = 500.0;

const CommissionSummary: React.FC = () => {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [account, setAccount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!amount || !method || !account) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    if (parseFloat(amount) > availableCommission) {
      setMessage({ type: 'error', text: 'Amount exceeds available commission.' });
      return;
    }
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setMessage({ type: 'success', text: 'Withdrawal request submitted successfully!' });
      setAmount('');
      setMethod('');
      setAccount('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      {/* Topbar */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Commission Summary</h1>
        <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">Withdraw</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Withdraw Commission</DialogTitle>
            </DialogHeader>
            <div className="mb-4 text-blue-700 font-semibold">Available: ${availableCommission.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  max={availableCommission}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                  disabled={submitting}
                  placeholder="Enter amount to withdraw"
                />
              </div>
              <div>
                <Label htmlFor="method">Withdrawal Method</Label>
                <select
                  id="method"
                  name="method"
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base"
                >
                  <option value="">Select method</option>
                  <option value="M-Pesa">M-Pesa</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>
              <div>
                <Label htmlFor="account">Account Details</Label>
                <Input
                  id="account"
                  name="account"
                  value={account}
                  onChange={e => setAccount(e.target.value)}
                  required
                  disabled={submitting}
                  placeholder="Enter account/number/email"
                />
              </div>
              {message && (
                <div className={`text-sm ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.text}</div>
              )}
              <DialogFooter>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" disabled={submitting}>
                  {submitting && (
                    <svg className="animate-spin h-4 w-4 mr-2 inline-block" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  )}
                  Withdraw
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* Main Content */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="h-6 w-6 text-green-600" />
          <span className="text-lg font-semibold text-gray-900">Your commission history will appear here.</span>
        </div>
        <div className="text-gray-500">No commissions found yet. Start referring to earn commissions!</div>
      </div>
    </div>
  );
};
export default CommissionSummary; 