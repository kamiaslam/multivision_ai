import React, { useState, useMemo } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import Button from "@/components/Button";
import { useFinance, type SubscriptionPlan } from "@/context/financeContext";
import { useAuth } from "@/context/authContext";
import api from "@/services/api";

interface SubscriptionCheckoutFormProps {
  plan: SubscriptionPlan;
  autoRenew: boolean;
  onSuccess: () => void;
  onError: (error: string) => void;
}

// Helper function to wait for subscription activation
const waitForSubscriptionActivation = async (subscriptionId: number, maxAttempts: number = 30): Promise<void> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { data } = await api.get(`/subscriptions/status/${subscriptionId}`);
      
      if (data.success && data.data) {
        const subscription = data.data;
        if (subscription.is_active && subscription.stripe_status === 'active') {
          console.log(`Subscription ${subscriptionId} is now active!`);
          return;
        }
      }
      
      console.log(`Waiting for subscription activation... (attempt ${attempt}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    } catch (error) {
      console.warn(`Error checking subscription status (attempt ${attempt}):`, error);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    }
  }
  
  throw new Error('Subscription activation timeout - please check your subscription status');
};

export default function SubscriptionCheckoutForm({ plan, autoRenew, onSuccess, onError }: SubscriptionCheckoutFormProps) {
  const { theme } = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const { createSubscription } = useFinance();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic card element options based on theme
  const cardElementOptions = useMemo(() => {
    const isDark = theme === 'dark';
    
    // Get computed styles from the document to use actual CSS custom properties
    const getCSSVariable = (variable: string) => {
      if (typeof window !== 'undefined') {
        return getComputedStyle(document.documentElement)
          .getPropertyValue(variable)
          .trim() || undefined;
      }
      return undefined;
    };
    
    return {
      style: {
        base: {
          fontSize: "16px",
          color: getCSSVariable('--color-text-primary') || (isDark ? "#F8F8F8" : "#1A1A1A"),
          fontFamily: "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          "::placeholder": {
            color: getCSSVariable('--color-text-secondary') || (isDark ? "#A0A0A0" : "#666666"),
          },
        },
        invalid: {
          color: "#ef4444", // red-500
        },
      },
    };
  }, [theme]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe is not loaded. Please refresh the page.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create subscription with our backend
      console.log("Creating subscription for plan:", plan.id);
      const subscriptionResult = await createSubscription(plan.id);
      
      if (!subscriptionResult.client_secret) {
        throw new Error("Failed to create subscription");
      }

      console.log("Subscription created, confirming payment with Stripe...");

      // Step 2: Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        subscriptionResult.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: user?.full_name || user?.username || "VoiceCake User",
              email: user?.email
            },
          },
        }
      );

      if (stripeError) {
        console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        throw new Error(stripeError.message || "Payment failed");
      }

      if (paymentIntent.status === "succeeded") {
        console.log("Stripe payment succeeded, waiting for subscription activation...");
        
        setActivating(true);
        
        // Wait for webhook to process and activate subscription
        await waitForSubscriptionActivation(subscriptionResult.subscription_id);
        
        console.log("Subscription activated!");
        onSuccess();
      } else {
        throw new Error("Payment was not successful");
      }
    } catch (err) {
      console.error("Subscription creation failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
      setActivating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-t-primary mb-2">
            Card Information
          </label>
          <div className="bg-b-surface1 dark:bg-b-surface2 rounded-lg p-4 border border-s-stroke2 dark:border-s-stroke1">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="bg-b-surface1 dark:bg-b-surface2 rounded-2xl p-4 border border-s-stroke2">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-t-secondary">Plan:</span>
            <span className="font-semibold text-t-primary">{plan.name || 'Unnamed Plan'}</span>
          </div>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-t-secondary">Minutes:</span>
            <span className="font-semibold text-t-primary">{(plan.tts_minutes_included || plan.minutes || 0).toLocaleString()}</span>
          </div>
          {plan.automations_included && (
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-t-secondary">Automations:</span>
              <span className="font-semibold text-t-primary">{plan.automations_included.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className="text-t-secondary">Total:</span>
            <span className="font-bold text-lg text-green-600 dark:text-green-400">${plan.total_price || plan.price || 0}</span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        isBlack
        disabled={!stripe || loading || activating}
        className="w-full"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Processing...</span>
          </div>
        ) : activating ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Activating subscription...</span>
          </div>
        ) : (
          `Subscribe for $${plan.total_price || plan.price || 0}/month`
        )}
      </Button>

      <div className="text-xs text-t-secondary text-center">
        Your payment is secured by Stripe. We never store your card details.
      </div>
    </form>
  );
}
