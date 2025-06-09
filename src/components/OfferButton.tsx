import { useState } from 'react';
import { DollarSign, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface OfferButtonProps {
  chatId: string;
  jobId: string;
  freelancerId: string;
  clientId: string;
  jobTitle: string;
  jobBudget: number;
  onOfferCreated: (offer: any) => void;
  existingOffer?: any;
  onAcceptOffer?: (offerId: string) => void;
  onDeclineOffer?: (offerId: string) => void;
  isClient: boolean;
  isFreelancer: boolean;
}

export const OfferButton = ({
  chatId,
  jobId,
  freelancerId,
  clientId,
  jobTitle,
  jobBudget,
  onOfferCreated,
  existingOffer,
  onAcceptOffer,
  onDeclineOffer,
  isClient,
  isFreelancer
}: OfferButtonProps) => {
  const { toast } = useToast();
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [offerData, setOfferData] = useState({
    amount: jobBudget.toString(),
    days: '',
    description: ''
  });

  const handleSubmitOffer = async () => {
    try {
      const { data: offer, error } = await supabase
        .from('offers')
        .insert([{
          chat_id: chatId,
          job_id: jobId,
          freelancer_id: freelancerId,
          client_id: clientId,
          amount: parseFloat(offerData.amount),
          days_to_complete: parseInt(offerData.days),
          description: offerData.description,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      onOfferCreated(offer);
      setShowOfferDialog(false);

      toast({
        title: 'Success',
        description: 'Offer submitted successfully!',
      });
    } catch (error) {
      console.error('Error submitting offer:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit offer.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      {isFreelancer && !existingOffer && (
        <div className="mb-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowOfferDialog(true)}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Create Offer
          </Button>
        </div>
      )}

      {existingOffer && (
        <div className={`mb-4 p-4 rounded-lg ${
          existingOffer.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
          existingOffer.status === 'accepted' ? 'bg-green-50 border border-green-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium flex items-center">
                {existingOffer.status === 'pending' 
                  ? 'Pending Offer' 
                  : existingOffer.status === 'accepted' 
                    ? 'Accepted Offer' 
                    : 'Declined Offer'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Amount: ${existingOffer.amount} • {existingOffer.days_to_complete} days
              </p>
              {existingOffer.description && (
                <p className="text-sm text-gray-600 mt-1">{existingOffer.description}</p>
              )}
            </div>
            {isClient && existingOffer.status === 'pending' && (
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => onAcceptOffer?.(existingOffer.id)}
                >
                  <Check className="h-4 w-4 mr-1" /> Accept
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onDeclineOffer?.(existingOffer.id)}
                >
                  <X className="h-4 w-4 mr-1" /> Decline
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Offer</DialogTitle>
            <DialogDescription>
              Fill in the details of your offer for {jobTitle}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Amount ($)</Label>
              <Input
                type="number"
                value={offerData.amount}
                onChange={(e) => setOfferData({...offerData, amount: e.target.value})}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label>Days to Complete</Label>
              <Input
                type="number"
                value={offerData.days}
                onChange={(e) => setOfferData({...offerData, days: e.target.value})}
                placeholder="Enter number of days"
              />
            </div>
            <div>
              <Label>Description (Optional)</Label>
              <Textarea
                value={offerData.description}
                onChange={(e) => setOfferData({...offerData, description: e.target.value})}
                placeholder="Any additional details about your offer"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowOfferDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitOffer}
                disabled={!offerData.amount || !offerData.days}
              >
                Submit Offer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};