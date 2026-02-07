'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { authAPI } from '../../services/api';
import TaskForm from '../../components/TaskForm';
import TaskList from '../../components/TaskList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTaskContext } from '../../contexts/TaskContext';
import { CheckCircle2, Plus, Calendar, User } from 'lucide-react';

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);

  const {
    userId,
    setUserId,
    tasks,
    fetchTasks,
    loading: tasksLoading,
    error: tasksError
  } = useTaskContext();

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        // Use the correct Better Auth token name
        const token = localStorage.getItem('better-auth.session_token') ||
                     localStorage.getItem('access_token') ||
                     localStorage.getItem('token');

        if (!token) {
          console.log('No token found, redirecting to signin');
          router.push('/signin');
          return;
        }

        const response = await authAPI.getCurrentUser();
        console.log('User authenticated:', response.data);
        setUserId(response.data.id);
        setUserProfile(response.data);
      } catch (err) {
        console.error('Authentication error:', err);
        // If not authenticated, redirect to sign in
        router.push('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, setUserId]);

  // Calculate task stats from context tasks
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((task: any) => task.completed).length,
    dueToday: tasks.filter((task: any) => {
      const today = new Date().toISOString().split('T')[0];
      return task.created_at.split('T')[0] === today;
    }).length
  };

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
    // The context will handle refreshing automatically
    // No need for manual refresh here since context listens to global events
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <div className="mb-8">
        {/* ✅ Centered Heading */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage your personal todo list</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-xl font-bold">{taskStats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-xl font-bold">{taskStats.completed}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Today</p>
                <p className="text-xl font-bold">{taskStats.dueToday}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        <TaskForm onTaskAdded={handleTaskAdded} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Your Tasks
          </h2>
          <TaskList />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}