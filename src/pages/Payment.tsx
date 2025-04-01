
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Form } from '@/components/ui/form';
import Layout from '@/components/Layout';
import { Loader2 } from 'lucide-react';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      
      // In a real app, this would be a call to your Stripe Checkout endpoint
      // For example: const { data } = await supabase.functions.invoke('create-checkout-session')
      
      // Temporary placeholder for demo purposes
      setTimeout(() => {
        toast({
          title: "Redirecting to payment provider",
          description: "You'll be redirected to complete your payment",
        });
        
        // This would normally redirect to Stripe: window.location.href = data.url
        // For now, simulate success after delay
        setTimeout(() => {
          setIsProcessing(false);
          toast({
            title: "Payment successful!",
            description: "Your subscription has been activated",
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

          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              You'll be redirected to our secure payment provider to complete your purchase
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handlePayment} 
              className="w-full" 
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Proceed to Payment"
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
            <div className="flex items-center justify-center space-x-2">
              <img src="/images/stripe-logo.svg" alt="Stripe" className="h-6" />
              <img src="/images/secure-payment.svg" alt="Secure Payment" className="h-6" />
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Payments processed securely through Stripe
            </p>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Payment;
