import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

// Higher-order component to protect routes
export function withProtection<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Function to wrap a component with protection
export function protectRoute<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
): React.ComponentType<P> {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute fallback={fallback}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
