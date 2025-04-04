
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Loader2, Lock, CreditCard, CheckCircle, AlertTriangle, CreditCard as CardIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'card'>('stripe');
  
  // Form state for direct card payment
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardFormErrors, setCardFormErrors] = useState<Record<string, string>>({});
  
  const validateCardForm = () => {
    const errors: Record<string, string> = {};
    
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length !== 16) {
      errors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      errors.cardExpiry = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!cardCvc.trim() || cardCvc.length < 3) {
      errors.cardCvc = 'Please enter a valid CVC';
    }
    
    if (!cardName.trim()) {
      errors.cardName = 'Please enter the cardholder name';
    }
    
    setCardFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Add a space after every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 16 digits plus spaces
    return formatted.substring(0, 19);
  };
  
  const formatExpiry = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(formatExpiry(e.target.value));
  };
  
  const handleProcessPayment = async () => {
    try {
      setIsProcessing(true);
      setPaymentError(null);
      
      if (paymentMethod === 'card') {
        // Validate card form
        if (!validateCardForm()) {
          setIsProcessing(false);
          return;
        }
        
        // In a real implementation, this would securely tokenize the card details
        // and send them to your backend API, which would then use Stripe's API
        // to process the payment. NEVER process card details directly in the frontend.
        
        toast({
          title: "Processing your card",
          description: "Please wait while we securely process your payment...",
        });
      } else {
        // Stripe Checkout flow
        toast({
          title: "Processing payment",
          description: "Please wait while we prepare your payment session...",
        });
      }
      
      // Simulate API call and redirect
      setTimeout(() => {
        try {
          // For demo purposes only
          // In a real implementation, you would integrate with a backend API
          const paymentSuccess = Math.random() > 0.2; // 80% success rate for demo
          
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
      handleProcessPayment();
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

          <div className="space-y-6">
            <Tabs defaultValue="stripe" className="w-full" onValueChange={(value) => setPaymentMethod(value as 'stripe' | 'card')}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="stripe" className="flex items-center justify-center">
                  <img src="/images/stripe-logo.svg" alt="Stripe" className="h-5 mr-2" />
                  Stripe Checkout
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center justify-center">
                  <CardIcon className="h-4 w-4 mr-2" />
                  Credit Card
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stripe" className="mt-0">
                <Button 
                  onClick={handleProcessPayment} 
                  className="w-full flex items-center justify-center" 
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing && paymentMethod === 'stripe' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceed with Stripe Payment
                    </>
                  )}
                </Button>
                <div className="flex items-center justify-center mt-4">
                  <img src="/images/secure-payment.svg" alt="Secure Payment" className="h-6" />
                  <span className="text-xs text-muted-foreground ml-2">Secure payments via Stripe</span>
                </div>
              </TabsContent>
              
              <TabsContent value="card" className="mt-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="card-name" className="text-sm font-medium">Cardholder Name</label>
                    <input
                      id="card-name"
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="John Doe"
                    />
                    {cardFormErrors.cardName && (
                      <p className="text-xs text-destructive mt-1">{cardFormErrors.cardName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="card-number" className="text-sm font-medium">Card Number</label>
                    <input
                      id="card-number"
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                    {cardFormErrors.cardNumber && (
                      <p className="text-xs text-destructive mt-1">{cardFormErrors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="card-expiry" className="text-sm font-medium">Expiry Date</label>
                      <input
                        id="card-expiry"
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full p-2 border rounded-md"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {cardFormErrors.cardExpiry && (
                        <p className="text-xs text-destructive mt-1">{cardFormErrors.cardExpiry}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="card-cvc" className="text-sm font-medium">CVC</label>
                      <input
                        id="card-cvc"
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
                        className="w-full p-2 border rounded-md"
                        placeholder="123"
                        maxLength={4}
                      />
                      {cardFormErrors.cardCvc && (
                        <p className="text-xs text-destructive mt-1">{cardFormErrors.cardCvc}</p>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleProcessPayment} 
                    className="w-full flex items-center justify-center mt-2" 
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing && paymentMethod === 'card' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Card...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Pay Securely
                      </>
                    )}
                  </Button>
                  
                  <div className="flex items-center justify-center mt-1">
                    <Lock className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">Your card details are securely encrypted</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
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
          <Alert variant="destructive" className="mt-2">
            <AlertTitle className="text-sm">Payment could not be completed</AlertTitle>
            <AlertDescription className="text-xs">
              Please check your payment details and try again, or use a different payment method.
            </AlertDescription>
          </Alert>
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
