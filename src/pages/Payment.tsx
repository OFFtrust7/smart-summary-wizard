
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { Loader2, Lock, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  
  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      setPaymentError(null);
      
      // In a production environment, this should call a secure backend API
      // that creates the Stripe checkout session with your secret key
      
      toast({
        title: "Processing payment",
        description: "Please wait while we prepare your payment session...",
      });
      
      // Simulate API call and redirect
      setTimeout(() => {
        try {
          // For demo purposes only - this simulates a successful payment
          // In a real implementation, you would:
          // 1. Call your backend API to create a Stripe session
          // 2. Redirect to Stripe checkout URL from the response
          // 3. Let Stripe handle the payment processing
          // 4. Use webhooks to confirm successful payments
          
          // Simulate successful payment (in production this would be handled by Stripe)
          const paymentSuccess = Math.random() > 0.3; // 70% success rate for demo
          
          if (paymentSuccess) {
            // Mark user as premium in local storage for demo purposes
            localStorage.setItem('isPremium', 'true');
            
            toast({
              title: "Payment successful!",
              description: "Your premium access is now activated",
              variant: "default",
            });
            
            // Redirect to dashboard with premium features enabled
            navigate('/payment-success');
          } else {
            // Simulate payment failure
            throw new Error("Your payment could not be processed. Please try again or use a different payment method.");
          }
        } catch (error: any) {
          setPaymentError(error.message || "Payment failed. Please try again.");
          setShowErrorDialog(true);
          toast({
            title: "Payment failed",
            description: "There was a problem processing your payment",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      }, 2000);
      
    } catch (error: any) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      setPaymentError(error.message || "Payment failed. Please try again.");
      setShowErrorDialog(true);
      toast({
        title: "Payment failed",
        description: "There was a problem processing your payment",
        variant: "destructive",
      });
    }
  };

  const handleRetry = () => {
    setShowErrorDialog(false);
    setPaymentError(null);
    // Wait a moment before retrying to avoid rapid clicks
    setTimeout(() => {
      handlePayment();
    }, 500);
  };

  return (
    <Layout>
      <motion.div 
        className="w-full max-w-md mx-auto mt-16 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="rounded-2xl p-8 shadow-lg bg-card border">
          <div className="text-center mb-8">
            <motion.h1 
              className="text-2xl font-bold tracking-tight text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Complete Your Purchase
            </motion.h1>
            <motion.p 
              className="text-muted-foreground mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Premium Plan - $9.99/month
            </motion.p>
          </div>

          <motion.div 
            className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="flex items-center text-sm font-medium mb-2">
              <CheckCircle size={16} className="mr-2 text-green-500" />
              Premium Plan Benefits
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Unlimited text summarization</li>
              <li>• Unlimited URL/PDF summarization</li>
              <li>• Unlimited YouTube video summarization</li>
              <li>• Priority support</li>
            </ul>
          </motion.div>

          <div className="space-y-4">
            <Button 
              onClick={handlePayment} 
              className="w-full flex items-center justify-center" 
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Complete Payment with Stripe
                </>
              )}
            </Button>
            
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => navigate('/pricing')}
                className="text-sm"
              >
                Cancel and return to pricing
              </Button>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-center space-x-3">
              <img src="/images/stripe-logo.svg" alt="Stripe" className="h-6" />
              <img src="/images/secure-payment.svg" alt="Secure Payment" className="h-6" />
            </div>
            <p className="text-xs text-center text-muted-foreground mt-3">
              Payments processed securely through Stripe
            </p>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Questions? Contact us at <a href="mailto:sales@snapsummary.com" className="text-primary hover:underline">sales@snapsummary.com</a>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Payment Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-destructive" />
              Payment Failed
            </DialogTitle>
            <DialogDescription>
              {paymentError || "There was an issue processing your payment. Please try again."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={() => setShowErrorDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRetry}>
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Payment;
