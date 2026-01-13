'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, taskAPI } from '../../services/api';
import TaskForm from '../../components/TaskForm';
import TaskList from '../../components/TaskList';

export default function TasksPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          router.push('/signin');
          return;
        }

        const response = await authAPI.getCurrentUser();
        setUserId(response.data.id);
      } catch (err) {
        // If not authenticated, redirect to sign in
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!userId) {
    return null; // Redirect is happening in useEffect
  }

  const handleTaskAdded = () => {
    // Task added, refresh or just continue
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
        <p className="text-gray-600">Manage your personal todo list</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <TaskForm userId={userId} onTaskAdded={handleTaskAdded} />

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks</h2>
          <TaskList userId={userId} />
        </div>
      </div>
    </div>
  );
}