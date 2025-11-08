"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import Loader from '@/components/Loader';

interface ProtectedRouteProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    fallback 
}) => {
    const { isAuthenticated, token, user } = useAuth();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Add a small delay to ensure auth state is properly loaded
        const timer = setTimeout(() => {
            setIsChecking(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Only redirect if we're not checking and definitely not authenticated
        if (!isChecking && !isAuthenticated && !token && !user) {
            router.push('/');
        }
    }, [isAuthenticated, token, user, router, isChecking]);

    // Show fallback or loading state while checking authentication
    if (isChecking || (!isAuthenticated && !token && !user)) {
        return fallback || (
            <div className="min-h-screen bg-b-surface1 flex items-center justify-center">
                <div className="text-center">
                    <Loader text="Checking authentication..." />
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
