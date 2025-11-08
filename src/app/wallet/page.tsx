"use client";

import React, { useState, useEffect } from "react";
import { useFinance } from "@/context/financeContext";
import { useAuth } from "@/context/authContext";
import Card from "@/components/Card";
import Button from "@/components/Button";
import WalletTopup from "@/components/WalletTopup";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

export default function WalletPage() {
  const { user } = useAuth();
  const { wallet, freeAllowance, getWallet, walletLoading } = useFinance();
  const [showTopup, setShowTopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      getWallet();
    }
  }, [user, getWallet]);


  const handleTopupSuccess = () => {
    setSuccessMessage("Wallet topped up successfully!");
    setShowTopup(false);
    // Refresh wallet data
    getWallet();
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleRefreshWallet = async () => {
    try {
      await getWallet();
      setSuccessMessage("Wallet refreshed successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error refreshing wallet:", error);
    }
  };

  const handleTopupError = (error: string) => {
    console.error("Top-up error:", error);
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (walletLoading) {
    return (
      <Layout>
        <div className="mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div className="mx-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wallet</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your wallet balance and top up funds for pay-as-you-go usage.
              </p>
            </div>
            <div className="action-buttons flex flex-row gap-2">
              <Button
                isBlack
                onClick={() => router.push('/top-ups')}
                className="px-4 py-2"
              >
                Back
              </Button>
              <Button
                onClick={handleRefreshWallet}
                disabled={walletLoading}
                className="px-4 py-2"
              >
                {walletLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-green-800 dark:text-green-200">{successMessage}</p>
          </div>
        )}


        <div className="space-y-6">
          {/* Top Row - Wallet and Free Allowances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wallet Balance Card */}
            <Card title="Current Balance">
            <div className="p-6">
              {wallet ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(wallet.balance_cents)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Available Balance
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Currency:</span>
                      <span className="font-medium">{wallet.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Premium Voice Surcharge:</span>
                      <span className="font-medium">{formatCurrency(wallet.premium_voice_surcharge_cents)}/min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                      <span className="font-medium">
                        {new Date(wallet.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  No wallet information available
                </div>
              )}
            </div>
          </Card>

            {/* Free Allowances Card */}
            <Card title="Free Allowances">
            <div className="p-6">
              {freeAllowance ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {freeAllowance.free_minutes_remaining}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Minutes Remaining
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Free Minutes Used:</span>
                      <span className="font-medium">
                        {freeAllowance.free_minutes_used} / {freeAllowance.free_minutes_limit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Free Automations Used:</span>
                      <span className="font-medium">
                        {freeAllowance.free_automations_used} / {freeAllowance.free_automations_limit}
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (freeAllowance.free_minutes_used / freeAllowance.free_minutes_limit) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  No free allowance information available
                </div>
              )}
            </div>
          </Card>
          </div>

          {/* Top-up Card */}
          <Card title="Top Up Wallet">
            <div className="p-6">
              {!showTopup ? (
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">
                    Add funds to your wallet for pay-as-you-go usage. Minimum $1.00, maximum $1000.00.
                  </p>
                  <Button
                    onClick={() => setShowTopup(true)}
                    className="w-full"
                  >
                    Top Up Wallet
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Add Funds</h3>
                    <Button
                      onClick={() => setShowTopup(false)}
                      className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </Button>
                  </div>
                  
                  <Elements stripe={stripePromise}>
                    <WalletTopup
                      onSuccess={handleTopupSuccess}
                      onError={handleTopupError}
                    />
                  </Elements>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Usage Information */}
        <Card title="How It Works" className="mt-6">
          <div className="p-6">
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Pay-as-You-Go Usage</h4>
                <p>Your wallet balance is automatically deducted when you use voice services. No subscription required!</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Pricing</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Text-to-Speech: $0.02 per minute</li>
                  <li>Speech-to-Text: $0.01 per minute</li>
                  <li>Premium Voice: +$0.01 per minute surcharge</li>
                  <li>Automations: $0.10 per automation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Free Allowances</h4>
                <p>New users get free minutes to try our services. Check your free allowance status in the dashboard.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      </Layout>
    </>
  );
}
