import { useState, useEffect } from "react";
import Loader from "@/components/Loader";

interface ClientOnlyProps {
  children: React.ReactNode;
}

export const ClientOnly = ({ children }: ClientOnlyProps) => {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader text="Loading Custom Tools..." />
      </div>
    );
  }
  
  return <>{children}</>;
};
