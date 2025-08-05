import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, DollarSign, User, FileText, Check, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Nav2 from '@/components/Nav2';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

interface OrderDetails {
  bid: {
    id: string;
    amount: number;
    message: string;
    delivery_time: string;
    freelancer_id: string;
    job_id: string;
  };
  job: {
    title: string;
    description: string;
    budget: number;
  };
  freelancer: {
    first_name: string;
    last_name: string;
    email: string;
  };
  client: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const OrderForm: React.FC = () => {
  const { bidId } = useParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<'client' | 'freelancer' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (bidId && user && !authLoading) {
      fetchOrderDetails();
    }
  }, [bidId, user, authLoading]);

  const fetchOrderDetails = async () => {
    try {
      if (!user) {
        navigate('/signin');
        return;
      }

      // Determine user role
      setUserRole(user.role as 'client' | 'freelancer');

      // Fetch bid details
      const bidData = await api.bids.getById(bidId!);

      // Fetch job details
      const jobData = await api.jobs.getById(bidData.job_id);

      // Fetch user profiles
      const freelancerProfile = await api.users.getProfile();
      const clientProfile = await api.users.getProfile();

      setOrderDetails({
        bid: bidData,
        job: jobData,
        freelancer: {
          first_name: freelancerProfile.name?.split(' ')[0] || '',
          last_name: freelancerProfile.name?.split(' ').slice(1).join(' ') || '',
          email: freelancerProfile.email
        },
        client: {
          first_name: clientProfile.name?.split(' ')[0] || '',
          last_name: clientProfile.name?.split(' ').slice(1).join(' ') || '',
          email: clientProfile.email
        }
      });

    } catch (error) {
      console.error('Error fetching order details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load order details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderResponse = async (accept: boolean) => {
    if (!orderDetails) return;

    try {
      if (accept) {
        // Create order and redirect to checkout
        await api.orders.create({
          bid_id: orderDetails.bid.id,
          amount: orderDetails.bid.amount,
        });

        toast({
          title: 'Order Accepted',
          description: 'Redirecting to checkout...',
        });

        navigate(`/checkout/${orderDetails.bid.id}`);
      } else {
        // Update bid status to rejected
        await api.bids.update(orderDetails.bid.id, { status: 'rejected' });

        toast({
          title: 'Order Declined',
          description: 'The order has been declined.',
        });

        navigate('/client');
      }
    } catch (error) {
      console.error('Error handling order response:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your response. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Order not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { bid, job, freelancer, client } = orderDetails;
  const platformFee = bid.amount * 0.2; // 20% platform fee
  const freelancerAmount = bid.amount - platformFee;

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav2 />
      
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 p-6 text-white">
                <h1 className="text-2xl font-bold">Order Form</h1>
                <p className="opacity-90">Review and confirm the project details</p>
              </div>

              <div className="p-6">
                {/* Project Details */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Project Details
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                        <span className="font-medium">Budget: ${job.budget}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="font-medium">Bid Amount: ${bid.amount}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-orange-600" />
                        <span className="font-medium">Delivery: {bid.delivery_time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parties Involved */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Parties Involved
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Client</h3>
                      <p className="font-medium">{client.first_name} {client.last_name}</p>
                      <p className="text-sm text-gray-600">{client.email}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-green-900 mb-2">Freelancer</h3>
                      <p className="font-medium">{freelancer.first_name} {freelancer.last_name}</p>
                      <p className="text-sm text-gray-600">{freelancer.email}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Breakdown */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Payment Breakdown
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Project Amount:</span>
                        <span className="font-medium">${bid.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Platform Fee (20%):</span>
                        <span className="font-medium">-${platformFee.toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                        <span>Freelancer Receives:</span>
                        <span className="text-green-600">${freelancerAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proposal Message */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Freelancer's Proposal</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{bid.message}</p>
                  </div>
                </div>

                {/* Action Buttons - Only show for clients */}
                {userRole === 'client' && (
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleOrderResponse(false)}
                      className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <X className="h-5 w-5" />
                      Decline Order
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => handleOrderResponse(true)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-5 w-5" />
                      Accept & Proceed to Payment
                    </Button>
                  </div>
                )}

                {userRole === 'freelancer' && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Waiting for client's response...</p>
                    <Button variant="outline" onClick={() => navigate('/freelancer')}>
                      Back to Dashboard
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderForm;
