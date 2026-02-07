/**
 * Authentication utilities for the frontend
 * Dynamic user management without hardcoded IDs
 */

import { useState, useEffect } from 'react';

/**
 * Get the authentication token
 */
export async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // Use the correct Better Auth token name (matching API service)
    const tokenSources = [
      localStorage.getItem('better-auth.session_token'),
      localStorage.getItem('access_token'),
      localStorage.getItem('token'),
      // Cookie fallback
      document.cookie.replace(/(?:(?:^|.*;\s*)better-auth\.session_token\s*=\s*([^;]+).*$)|^.*$/, "$1")
    ];

    return tokenSources.find(token => token && token.length > 0) || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Get the current user ID dynamically from the API
 */
export async function getCurrentUserId(): Promise<string | null > {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const token = await getAuthToken();
    if (!token) {
      return null;
    }

    // Fetch user info from the backend API with proper headers
    const response = await fetch('http://localhost:8000/api/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const userData = await response.json();
      return userData.id || null ;
    } else {
      console.error('Failed to fetch user data:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const userId = await getCurrentUserId();
    return !!userId;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

/**
 * Session hook that fetches user data dynamically
 */
export function useSession() {
  const [userData, setUserData] = useState<{
  user: {
    id: string | null;
    name: string | null;
    email: string | null;
  };
}>({
  user: {
    id: null,
    name: null,
    email: null
  }
});

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = await getCurrentUserId();
      if (userId) {
        setUserData({
          user: {
            id: userId,
            name: 'User', // You can fetch the actual name if needed
            email: 'user@example.com' // You can fetch the actual email if needed
          }
        });
      }
    };

    if (typeof window !== 'undefined') {
      fetchUserData();
    }
  }, []);

  return {
    data: userData,
    isPending: false
  };
}