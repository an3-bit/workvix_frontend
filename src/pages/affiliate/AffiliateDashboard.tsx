import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const referralLink = `${window.location.origin}/?ref=${localStorage.getItem('affiliate_id') || 'YOUR_ID'}`;

const AffiliateDashboard: React.FC = () => {
  const navigate = useNavigate();

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Affiliate Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="font-semibold">Your Referral Link:</div>
            <div className="flex items-center space-x-2">
              <span className="bg-gray-100 px-2 py-1 rounded text-sm">{referralLink}</span>
              <Button size="sm" onClick={copyReferralLink}>Copy</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={() => navigate('/affiliate/clients')}>Manage Clients</Button>
            <Button onClick={() => navigate('/affiliate/freelancers')}>Manage Freelancers</Button>
            <Button onClick={() => navigate('/affiliate/jobs')}>Manage Jobs</Button>
            <Button onClick={() => navigate('/affiliate/commissions')}>Commission Summary</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateDashboard; 