import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreatePaymentIntentMutation, useConfirmPaymentMutation } from '@/redux/features/payment/paymentApi';
import { toast } from 'react-hot-toast';
import { Loader2, ShieldCheck, CreditCard } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm: React.FC<{ parcelId: string, amount: number, onComplete: () => void }> = ({ parcelId, amount, onComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [createIntent] = useCreatePaymentIntentMutation();
  const [confirm] = useConfirmPaymentMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // 1. Create Payment Intent
      const intentRes = await createIntent({ parcelId }).unwrap();
      const clientSecret = intentRes.data.clientSecret;

      // 2. Confirm Payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // 3. Confirm with Backend
        await confirm({ parcelId, transactionId: paymentIntent.id }).unwrap();
        toast.success('Payment successful!');
        onComplete();
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Payment confirmation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#ffffff',
                '::placeholder': {
                  color: '#71717a',
                },
              },
              invalid: {
                color: '#ef4444',
              },
            },
          }}
        />
      </div>
      
      <div className="flex items-center justify-between text-sm text-zinc-500 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
        <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Secure SSL Encrypted
        </span>
        <span className="font-bold text-white">Total: ${amount.toFixed(2)}</span>
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold"
      >
        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay Now with Card`}
      </Button>
    </form>
  );
};

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcelId: string;
  amount: number;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, parcelId, amount }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <CreditCard className="text-primary" /> Complete Payment
          </DialogTitle>
          <DialogDescription className="text-zinc-500">
            Securely pay for your parcel booking via Stripe.
          </DialogDescription>
        </DialogHeader>
        <Elements stripe={stripePromise}>
          <CheckoutForm parcelId={parcelId} amount={amount} onComplete={onClose} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};
