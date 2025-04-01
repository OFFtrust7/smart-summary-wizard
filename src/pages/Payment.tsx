
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { Loader2, Lock, CreditCard, CheckCircle } from 'lucide-react';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      // Simulate a payment process (in production, this would call your Stripe checkout endpoint)
      setTimeout(() => {
        toast({
          title: "Redirecting to Stripe",
          description: "You'll be redirected to complete your payment",
        });
        
        // Simulate successful payment after delay
        setTimeout(() => {
          setIsProcessing(false);
          toast({
            title: "Payment successful!",
            description: "Your subscription has been activated",
            variant: "default",
          });
          navigate('/dashboard');
        }, 2000);
      }, 1500);
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Payment failed",
        description: "There was a problem processing your payment",
        variant: "destructive",
      });
    }
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
                  <Lock className="mr-2 h-4 w-4" />
                  Proceed with Stripe Payment
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
            <p className="text-xs text-center text-muted-foreground mt-2 italic">
              Your subscription payment will be directly deposited to your connected bank account
            </p>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Payment;
