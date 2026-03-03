'use client';

import React, { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If not loading and no user is found in context/localStorage, redirect
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Show nothing or a loading spinner while checking auth status
    if (loading || !user) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Render children only if authenticated
    return <>{children}</>;
}
