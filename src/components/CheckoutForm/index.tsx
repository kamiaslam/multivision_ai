import React, { useState, useMemo } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import Button from "@/components/Button";
import { useFinance, type SubscriptionPlan } from "@/context/financeContext";

interface CheckoutFormProps {
  plan: SubscriptionPlan;
  autoRenew: boolean;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function CheckoutForm({ plan, autoRenew, onSuccess, onError }: CheckoutFormProps) {
  const { theme } = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const { purchasePlan, confirmStripePayment } = useFinance();
  const [loading, setLoading] = useState(false);
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
      // Step 1: Create payment intent with our backend
      console.log("Creating payment intent for plan:", plan.id);
      const paymentResult = await purchasePlan(plan.id, { autoRenew });
      
      if (!paymentResult.client_secret) {
        throw new Error("Failed to create payment intent");
      }

      console.log("Payment intent created, confirming with Stripe...");

      // Step 2: Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentResult.client_secret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              // You can add billing details here if needed
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message || "Payment failed");
      }

      if (paymentIntent.status === "succeeded") {
        console.log("Stripe payment succeeded, confirming with backend...");
        
        // Step 3: Confirm payment with our backend to create subscription
        const result = await confirmStripePayment(plan.id, paymentIntent.id);
        
        if (result.subscription) {
          console.log("Subscription created successfully");
          onSuccess();
        } else {
          throw new Error("Failed to create subscription");
        }
      } else {
        throw new Error(`Payment status: ${paymentIntent.status}`);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Payment failed";
      console.error("Payment error:", err);
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-t-primary mb-2">
            Card Information
          </label>
          <div className="border border-s-stroke2 rounded-2xl p-4 bg-b-surface1 dark:bg-shade-04">
            <CardElement options={cardElementOptions} />
          </div>
          <p className="text-xs text-t-secondary mt-2">
            Use test card: 4242 4242 4242 4242, any future expiry, any CVC
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="bg-b-surface1 dark:bg-shade-04 rounded-2xl p-4 border border-s-stroke2">
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
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Processing...</span>
          </div>
        ) : (
          `Pay $${plan.total_price || plan.price || 0}`
        )}
      </Button>

      <div className="text-xs text-t-secondary text-center">
        Your payment is secured by Stripe. We never store your card details.
      </div>
    </form>
  );
}
