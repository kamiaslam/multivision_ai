"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useFinance } from "@/context/financeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SubscriptionProtectedRoute from "@/components/SubscriptionProtectedRoute";
import Loader from "@/components/Loader";
import { useEffect } from "react";

interface AppProtectionProps {
  children: React.ReactNode;
}

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/auth/signin", "/auth/signup", "/terms-&-conditions", "/privacy-policy"];

// Routes that require authentication but not subscription
const AUTH_ONLY_ROUTES = ["/plan-selection", "/purchase-plan", "/agents", "/dashboard", "/workspace", "/admin-dashboard"];

// All known routes in the application
const KNOWN_ROUTES = [
  "/", "/landing", "/auth/signin", "/auth/signup",
  "/dashboard", "/agents", "/add-agent", "/voice-clone", "/custom-tools",
  "/billing", "/wallet", "/top-ups", "/phone-numbers", "/call-logs",
  "/messages", "/notifications", "/settings", "/security", "/edit-profile",
  "/team", "/users", "/customers", "/products", "/shop", "/promote",
  "/affiliate-center", "/explore-creators", "/insights", "/logs",
  "/workflows", "/sim-ai", "/inference", "/support", "/devnotes",
  "/privacy-policy", "/terms-&-conditions", "/upgrade-to-pro",
  "/create-assistant", "/plan-selection", "/purchase-plan", "/admin-dashboard"
];

export default function AppProtection({ children }: AppProtectionProps) {
  const pathname = usePathname();
   const router = useRouter();
  const { isAuthenticated, token, user, isInitialized } = useAuth();
  const { hasActiveSubscription, subscriptionsLoaded, requiresPlan } = useFinance();

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || pathname.startsWith('/share/');
  
  // Check if current route is a known protected route
  const isKnownProtectedRoute = KNOWN_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/')) && !isPublicRoute;
  
  // Check if current route only requires authentication (not subscription)
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.includes(pathname);

  // Redirect unauthenticated users from protected routes to login
  useEffect(() => {
    // Only redirect after auth state is initialized to prevent false redirects on refresh
    if (isInitialized && isKnownProtectedRoute && !isAuthenticated && !token && !user) {
      router.push('/auth/signin');
    }
  }, [isInitialized, isKnownProtectedRoute, isAuthenticated, token, user, router]);

  // Show loading while checking authentication and subscription status
  if (!isPublicRoute && (!isInitialized || !isAuthenticated || !subscriptionsLoaded)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader text="Loading..." />
        </div>
      </div>
    );
  }

  // Public routes - no protection needed
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Auth-only routes - only require authentication
  if (isAuthOnlyRoute) {
    return (
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    );
  }

  // All other routes - require both authentication and subscription
  return (
    <SubscriptionProtectedRoute requireSubscription={false}>
      {children}
    </SubscriptionProtectedRoute>
  );
}
