
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    description: "Basic features for occasional use",
    features: [
      { text: "10 summaries per month", included: true },
      { text: "Basic summary quality", included: true },
      { text: "Text summarization only", included: true },
      { text: "URL/PDF summarization", included: false },
      { text: "YouTube video summarization", included: false },
      { text: "Priority support", included: false },
    ],
    buttonText: "Get Started",
  },
  {
    name: "Premium",
    price: "$9.99",
    description: "Advanced features for power users",
    features: [
      { text: "Unlimited summaries", included: true },
      { text: "Improved summary quality", included: true },
      { text: "Text summarization", included: true },
      { text: "URL/PDF summarization", included: true },
      { text: "YouTube video summarization", included: true }, 
      { text: "Priority support", included: true },
    ],
    buttonText: "Subscribe",
    popular: true,
  },
  {
    name: "Team",
    price: "$29.99",
    description: "Enterprise features for teams",
    features: [
      { text: "Unlimited summaries", included: true },
      { text: "Highest summary quality", included: true },
      { text: "All content types supported", included: true },
      { text: "Team sharing & collaboration", included: true },
      { text: "API access", included: true },
      { text: "Dedicated support", included: true },
    ],
    buttonText: "Contact Sales",
  }
];

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const handlePlanSelect = (plan: string) => {
    if (plan === "Free") {
      navigate('/dashboard');
    } else {
      // Both Premium and Team plans go to payment page
      navigate('/payment');
    }
  };

  return (
    <Layout>
      <motion.div 
        className="w-full max-w-6xl mx-auto mt-8 px-4 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that works best for your summarization needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.name}
              className={`rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col ${
                plan.popular ? 'ring-2 ring-primary' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className="p-6 flex-1">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <p className="mt-4 text-muted-foreground">{plan.description}</p>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className={`mr-3 h-5 w-5 ${feature.included ? 'text-primary' : 'text-muted-foreground/40'}`} />
                      <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 bg-muted/50">
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                  onClick={() => handlePlanSelect(plan.name)}
                >
                  {plan.buttonText}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-muted rounded-lg">
            <img src="/images/stripe-logo.svg" alt="Stripe" className="h-6 mx-2" />
            <span className="mx-2 text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground">Secure payments provided by Stripe</span>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default Pricing;
