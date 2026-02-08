'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/signin'
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      const isValid = !!token;
      setIsAuthenticated(isValid);

      // If not authenticated and trying to access protected route, redirect
      if (!isValid && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== '/signin' && currentPath !== '/signup' && !currentPath.startsWith('/api/')) {
          router.push(redirectTo);
        }
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout in other tabs)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router, redirectTo]);

  // Show nothing while checking auth status
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Checking authentication...</div>
      </div>
    );
  }

  // If authenticated, render children; otherwise, redirect will happen via useEffect
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;