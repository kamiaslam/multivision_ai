"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import ThemeButton from "@/components/ThemeButton";
import Link from "next/link";
import { useFinance, type SubscriptionPlan, type BotType } from "@/context/financeContext";
import Loader from "@/components/Loader";

const botTypes: BotType[] = ["conversa", "empath"];

function PlanSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    getSubscriptionPlans,
    activeSubscriptions, 
    subscriptionsLoaded, 
    refreshSubscriptions, 
    hasActiveSubscription,
    requiresPlan,
    hasValidPlan
  } = useFinance();
  
  const [plans, setPlans] = useState<Record<BotType, SubscriptionPlan[]>>({ 
    conversa: [], 
    empath: [] 
  });
  const [loading, setLoading] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const hasRefreshedRef = useRef(false);
  const selectedBotType = (searchParams.get("bot") as BotType) || "conversa";

  // Check if user needs to be redirected to plan selection
  useEffect(() => {
    if (subscriptionsLoaded && !hasActiveSubscription && !hasRedirected) {
      // User doesn't have a subscription, they should stay on this page
      setHasRedirected(true);
    }
  }, [subscriptionsLoaded, hasActiveSubscription, hasRedirected]);

  // Redirect to dashboard if user already has subscription
  useEffect(() => {
    if (hasActiveSubscription && !hasRedirected) {
      setHasRedirected(true);
      router.push("/dashboard");
    }
  }, [hasActiveSubscription, hasRedirected, router]);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const allPlans = await getSubscriptionPlans();
        
        // Filter plans by bot type
        const conversaPlans = allPlans.filter(plan => plan.bot_type === "conversa");
        const empathPlans = allPlans.filter(plan => plan.bot_type === "empath");
        
        setPlans({ conversa: conversaPlans, empath: empathPlans });
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        // Set empty arrays as fallback
        setPlans({ conversa: [], empath: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [getSubscriptionPlans]);

  // Refresh subscriptions when component mounts to ensure we have latest state
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Only refresh if subscriptions are loaded, not loading plans, and we haven't already refreshed
    if (subscriptionsLoaded && !loading && !hasRefreshedRef.current) {
      hasRefreshedRef.current = true;
      
      // Add a small delay to prevent rapid successive calls
      timeoutId = setTimeout(() => {
        refreshSubscriptions();
      }, 100);
    }
    
    // Cleanup function to clear timeout if component unmounts
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [subscriptionsLoaded, loading, refreshSubscriptions]);

  const currentPlans = useMemo(() => {
    const plansForBot = plans[selectedBotType];
    return Array.isArray(plansForBot) ? plansForBot : [];
  }, [plans, selectedBotType]);

  const handleSelect = (plan: SubscriptionPlan) => {
    router.push(`/purchase-plan?planId=${plan.id}&bot=${plan.bot_type}`);
  };

  const handleBotTypeChange = (botType: BotType) => {
    const params = new URLSearchParams(searchParams);
    params.set("bot", botType);
    router.push(`/plan-selection?${params.toString()}`);
  };

  // Find active subscription for selected bot type
  const activeSub = activeSubscriptions[selectedBotType];

  // Show loading state while refreshing subscriptions
  if (!subscriptionsLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader text="Loading plans..." />
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
        <div className="text-center space-y-4 mb-10">
          <Badge className="mx-auto">Choose Your Plan</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">Select a VoiceCake plan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Get started with VoiceCake Conversa or VoiceCake Empath.
          </p>
          <div className="flex justify-center gap-2">
            {botTypes.map((bt) => (
              <Button
                key={bt}
                isWhite={bt !== selectedBotType}
                isBlack={bt === selectedBotType}
                onClick={() => handleBotTypeChange(bt)}
                className="px-6"
              >
                {bt === "conversa" ? "VoiceCake Conversa" : "VoiceCake Empath"}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {loading && Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="h-56 animate-pulse">
              <div></div>
            </Card>
          ))}
          {!loading && currentPlans.map((plan) => {
            const isSubscribed = activeSub && activeSub.plan_id === plan.id && activeSub.is_active;
            return (
              <Card key={plan.id} className="hover:shadow-md transition-all flex flex-1 flex-col">
                <div className="p-6 flex flex-1 flex-col">
                  <div className="flex-grow min-h-40">
                    <div>
                      <h3 className="text-xl font-bold">{plan.name || 'Unnamed Plan'}</h3>
                      <p className="text-muted-foreground text-sm">
                        {(plan.tts_minutes_included || plan.minutes || 0).toLocaleString()} minutes • 30 days
                      </p>
                      {plan.automations_included && (
                        <p className="text-muted-foreground text-sm">
                          {plan.automations_included.toLocaleString()} automations included
                        </p>
                      )}
                    </div>
                    <div className="text-3xl font-bold mt-4">${plan.total_price || plan.price || 0}</div>
                  </div>
                  
                  <div className="mt-auto">
                    <Button
                      isBlack
                      className="w-full"
                      onClick={() => handleSelect(plan)}
                    >
                      Select {plan.name || 'Plan'}
                    </Button>
                    {isSubscribed && (
                      <div className="mt-4">
                        <Card className="border border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-500">
                          <div className="p-2 text-center">
                            <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                              You already have an active subscription for this plan.
                            </div>
                            <div className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                              Plan: <span className="font-bold">{activeSub.plan?.name}</span> • {(activeSub.tts_minutes_left || activeSub.minutes_left || 0).toLocaleString()} min left • Expires: {new Date(activeSub.expires_at).toLocaleDateString()}
                            </div>
                          </div>
                        </Card>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {!loading && currentPlans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No plans available for {selectedBotType === "conversa" ? "VoiceCake Conversa" : "VoiceCake Empath"} at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PlanSelection() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader text="Loading plans..." />
        </div>
      </div>
    }>
      <PlanSelectionContent />
    </Suspense>
  );
}
