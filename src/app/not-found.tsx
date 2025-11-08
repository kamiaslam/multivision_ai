"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Icon from "@/components/Icon";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-b-surface1">
      <div className="text-center max-w-md mx-auto px-4">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-b-surface2 rounded-full flex items-center justify-center">
            <Icon name="warning" className="w-16 h-16 text-t-secondary" />
          </div>
          <h1 className="text-6xl font-bold text-t-primary mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-t-primary mb-4">Page Not Found</h2>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <p className="text-t-secondary text-lg mb-4">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-t-tertiary text-sm">
            The URL might be incorrect, or the page may have been removed.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center gap-2"
          >
            Go to Homepage
          </Button>
          
          <Button
            isStroke
            onClick={() => router.back()}
            className="w-full flex items-center justify-center gap-2"
          >
            <Icon name="arrow-left" className="w-4 h-4" />
            Go Back
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-s-stroke2">
          <p className="text-xs text-t-tertiary">
            Need help? Contact our support team or check our documentation.
          </p>
        </div>
      </div>
    </div>
  );
}
