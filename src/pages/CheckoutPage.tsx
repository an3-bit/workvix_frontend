
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Shield, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const CheckoutPage = () => {
  const { bidId } = useParams();
  const navigate = useNavigate();
  const [bid, setBid] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const { toast } = useToast();

  useEffect(() => {
    const fetchBidDetails = async () => {
      try {
        // Fetch bid details with related job and freelancer data
        const { data: bidData, error: bidError } = await supabase
          .from('bids')
          .select(`
            *,
            jobs (
              id,
              title,
              category
            ),
            freelancers (
              first_name,
              last_name,
              email
            )
          `)
          .eq('id', bidId)
          .single();

        if (bidError) throw bidError;
        
        setBid(bidData);
        setJob(bidData.jobs);
      } catch (error) {
        console.error('Error fetching bid details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load checkout details',
          variant: 'destructive',
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (bidId) {
      fetchBidDetails();
    }
  }, [bidId, navigate, toast]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Create order record
      const { error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            bid_id: bidId,
            amount: bid.amount * 1.05, // Including 5% service fee
            status: 'paid',
            payment_method: paymentMethod
          }
        ]);

      if (orderError) throw orderError;

      // Update bid status to paid
      const { error: bidError } = await supabase
        .from('bids')
        .update({ status: 'paid' })
        .eq('id', bidId);

      if (bidError) throw bidError;

      toast({
        title: 'Payment Successful',
        description: 'Your payment has been processed successfully!',
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Loading checkout details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!bid || !job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-xl font-bold mb-4 text-red-600">Checkout details not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <p className="text-gray-600">{job.category}</p>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Freelancer</h4>
                  <p>{bid.freelancers?.first_name} {bid.freelancers?.last_name}</p>
                  <p className="text-sm text-gray-600">{bid.freelancers?.email}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span>Project Amount</span>
                    <span className="font-semibold">${bid.amount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Service Fee (5%)</span>
                    <span className="font-semibold">${(bid.amount * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>${(bid.amount * 1.05).toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center text-green-700">
                    <Shield className="h-5 w-5 mr-2" />
                    <span className="text-sm">100% Money Back Guarantee</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        className="font-mono"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardholder">Cardholder Name</Label>
                      <Input id="cardholder" placeholder="John Doe" />
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your payment</p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-blue-700 font-semibold">PayPal Secure Payment</div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                >
                  {processing ? (
                    'Processing...'
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pay ${(bid.amount * 1.05).toFixed(2)}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By clicking "Pay", you agree to our Terms of Service and Privacy Policy.
                  Your payment information is secure and encrypted.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
