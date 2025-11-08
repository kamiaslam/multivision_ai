import { useState, useEffect } from 'react';

interface HydrationSafeProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const HydrationSafe = ({ children, fallback, className = '' }: HydrationSafeProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Always render the same structure on server and client
  return (
    <div className={className}>
      {isHydrated ? children : fallback || <div className="animate-pulse bg-gray-200 rounded h-4 w-full" />}
    </div>
  );
};
