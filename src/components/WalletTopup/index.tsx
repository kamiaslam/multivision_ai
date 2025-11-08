import React, { useState, useMemo } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import Button from "@/components/Button";
import Field from "@/components/Field";
import { useFinance } from "@/context/financeContext";
import { useAuth } from "@/context/authContext";
import api from "@/services/api";

interface WalletTopupProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function WalletTopup({ onSuccess, onError }: WalletTopupProps) {
  const { theme } = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const { getWallet } = useFinance();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Only allow whole numbers (cents)
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError("Stripe not loaded");
      return;
    }

    const amountCents = parseInt(amount);
    
    if (amountCents < 100) {
      setError("Minimum amount is 100 cents ($1.00)");
      return;
    }

    if (amountCents > 100000) {
      setError("Maximum amount is 100,000 cents ($1000.00)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create payment intent
      const { data: response } = await api.post('/wallet/topup/create-intent', {
        amount_cents: amountCents
      });

      // Handle the nested response structure
      const intentData = response.data || response;
      const { client_secret, payment_intent_id } = intentData;

      // Step 2: Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.full_name || user?.username || "VoiceCake User",
            email: user?.email
          }
        }
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        // Step 3: Poll for wallet update (webhook processed)
        setPaymentIntentId(payment_intent_id);
        setPolling(true);
        await pollForWalletUpdate(payment_intent_id);
      } else {
        throw new Error(`Payment not succeeded: ${paymentIntent?.status}`);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Payment failed";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const pollForWalletUpdate = async (paymentIntentId: string) => {
    const maxAttempts = 30; // 30 seconds max
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const { data: response } = await api.get(`/wallet/topup/status/${paymentIntentId}`);
        
        // Handle the nested response structure
        const statusData = response.data || response;
        
        if (statusData.wallet_credited) {
          // Success! Refresh wallet and call success callback
          await getWallet();
          onSuccess();
          setPolling(false);
          return;
        }

        if (statusData.status === 'succeeded' && !statusData.wallet_credited) {
          // Payment succeeded but webhook not processed yet
          console.log(`Polling attempt ${attempts + 1}/${maxAttempts} - Payment succeeded but wallet not credited yet`);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
          attempts++;
        } else {
          throw new Error(`Payment failed or stuck: ${statusData.status}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to check payment status";
        setError(errorMessage);
        onError(errorMessage);
        setPolling(false);
        return;
      }
    }

    // Timeout - but don't show error, just show manual refresh option
    console.log("Polling timeout - webhook may not have processed yet");
    setError("Payment succeeded but wallet update is taking longer than expected. Please refresh your wallet manually.");
    setPolling(false);
  };

  return (
    <div className="mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Field
          label="Top-up Amount (in cents)"
          type="number"
          step="1"
          min="100"
          max="100000"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount in cents (e.g., 5000 for $50.00)"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Card Information
          </label>
          <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-md">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || polling || !stripe || !elements}
          className="w-full"
        >
          {loading ? "Processing..." : polling ? "Confirming..." : `Top up $${amount ? (parseInt(amount) / 100).toFixed(2) : "0.00"}`}
        </Button>
      </form>
    </div>
  );
}
