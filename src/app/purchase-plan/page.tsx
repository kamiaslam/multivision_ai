"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import ThemeButton from "@/components/ThemeButton";
import Checkbox from "@/components/Checkbox";
import SubscriptionCheckoutForm from "@/components/SubscriptionCheckoutForm";
import { useFinance, type SubscriptionPlan, type BotType } from "@/context/financeContext";
import getStripe from "@/config/stripe";
import Loader from "@/components/Loader";
import Link from "next/link";

function PlanPurchaseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    getSubscriptionPlans,
    createSubscription,
    hasActiveSubscription,
    refreshSubscriptionsImmediate
  } = useFinance();
  
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRenew, setAutoRenew] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);

  const planId = searchParams.get("planId");
  const botType = searchParams.get("bot") as BotType;

  // Load the selected plan
  useEffect(() => {
    const loadPlan = async () => {
      if (!planId || !botType) {
        router.push("/plan-selection");
        return;
      }

      setLoading(true);
      try {
        const allPlans = await getSubscriptionPlans();
        const plan = allPlans.find(p => p.id === parseInt(planId) && p.bot_type === botType);
        
        if (!plan) {
          setError("Plan not found");
          router.push("/plan-selection");
          return;
        }
        
        setSelectedPlan(plan);
      } catch (err) {
        console.error("Failed to load plan:", err);
        setError("Failed to load plan details");
        router.push("/plan-selection");
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [planId, botType, getSubscriptionPlans, router]);

  // Redirect if user already has subscription (only once)
  useEffect(() => {
    if (hasActiveSubscription && !hasRedirected) {
      console.log("PlanPurchase: User already has active subscription, redirecting to dashboard");
      setHasRedirected(true);
      router.push("/dashboard");
    }
  }, [hasActiveSubscription, hasRedirected, router]);

  const handleSuccess = async () => {
    console.log("Purchase successful! Your subscription is now active.");
    
    // Refresh subscriptions in context to ensure latest state
    await refreshSubscriptionsImmediate();
    
    // Navigate to dashboard
    router.push("/dashboard");
  };

  const handleError = (error: string) => {
    console.error(`Payment failed: ${error}`);
    setError(error);
  };

  const handleBack = () => {
    router.push("/plan-selection");
  };

  // Show loading while checking subscription status
  if (hasActiveSubscription === undefined) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader text="Checking subscription status..." />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader text="Loading plan details..." />
        </div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Plan not found</p>
          <Button isWhite onClick={handleBack} className="mt-4">
            Back to Plan Selection
          </Button>
        </div>
      </div>
    );
  }

  // Show redirect message if user already has subscription
  if (hasActiveSubscription) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader text="Redirecting to dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with theme toggle */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button isWhite onClick={handleBack} className="px-4">
              ← Back
            </Button>
            {/* <h1 className="text-2xl font-bold">VoiceCake</h1> */}
            <Link className={`flex relative h-12 w-auto min-w-[120px] justify-center items-center`} href="/">
                <span className="text-xl sm:text-2xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    Multivision
                  </span>
                  <span className="text-foreground dark:text-foreground ml-1">AI</span>
                </span>
              </Link>
          </div>
          <ThemeButton className="flex-row w-22"/>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <Badge className="mx-auto">Complete Your Purchase</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold">Purchase {selectedPlan.name || 'Plan'}</h2>
            <p className="text-muted-foreground">
              Review your plan details and complete your purchase to get started with VoiceCake.
            </p>
          </div>

          <Card className="mb-6">
            <div className="p-6 space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Complete Your Purchase</h1>
                <p className="text-muted-foreground text-sm">Secure payment powered by Stripe</p>
              </div>

              {selectedPlan ? (
                <div className="rounded-lg border p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">{selectedPlan.name || 'Unnamed Plan'}</div>
                      <div className="text-muted-foreground text-sm">
                        VoiceCake {selectedPlan.bot_type === "conversa" ? "Conversa" : "Empath"} Bot
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        {(selectedPlan.tts_minutes_included || selectedPlan.minutes || 0).toLocaleString()} minutes included
                      </div>
                      {selectedPlan.automations_included && (
                        <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          {selectedPlan.automations_included.toLocaleString()} automations included
                        </div>
                      )}
                    </div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">${selectedPlan.total_price || selectedPlan.price || 0}</div>
                  </div>
                </div>
              ) : (
                <div className="h-24 rounded-md bg-muted animate-pulse" />
              )}

              <div className="space-y-2">
                <Checkbox 
                  checked={autoRenew} 
                  onChange={setAutoRenew}
                  label="Enable auto-renewal for seamless service"
                />
              </div>

              {selectedPlan && (
                <Elements stripe={getStripe()}>
                  <SubscriptionCheckoutForm
                    plan={selectedPlan}
                    autoRenew={autoRenew}
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </Elements>
              )}

              <div className="flex justify-center">
                <Button 
                  isWhite 
                  onClick={handleBack}
                  className="px-8"
                >
                  Back to Plans
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function PlanPurchase() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader text="Loading purchase page..." />
        </div>
      </div>
    }>
      <PlanPurchaseContent />
    </Suspense>
  );
}