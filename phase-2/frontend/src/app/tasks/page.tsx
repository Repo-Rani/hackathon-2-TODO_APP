'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { authAPI, taskAPI } from '../../services/api';
import TaskForm from '../../components/TaskForm';
import TaskList from '../../components/TaskList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Plus, Calendar, User } from 'lucide-react';

export default function TasksPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    dueToday: 0
  });

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
        setUserProfile(response.data);

        // Load task statistics
        const allTasks = await taskAPI.getTasks(response.data.id);
        const completedTasks = allTasks.data.filter((task: any) => task.completed);
        const today = new Date().toISOString().split('T')[0];
        const dueToday = allTasks.data.filter((task: any) => {
          // Assuming there's a due_date field - if not, just count all tasks as potential today tasks
          return task.created_at.split('T')[0] === today;
        });

        setTaskStats({
          total: allTasks.data.length,
          completed: completedTasks.length,
          dueToday: dueToday.length
        });
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
    // Reload task stats
    if (userProfile) {
      setTimeout(async () => {
        try {
          const allTasks = await taskAPI.getTasks(userProfile.id);
          const completedTasks = allTasks.data.filter((task: any) => task.completed);
          const today = new Date().toISOString().split('T')[0];
          const dueToday = allTasks.data.filter((task: any) => {
            return task.created_at.split('T')[0] === today;
          });

          setTaskStats({
            total: allTasks.data.length,
            completed: completedTasks.length,
            dueToday: dueToday.length
          });
        } catch (err) {
          console.error('Failed to update task stats:', err);
        }
      }, 500); // Small delay to let the UI update
    }
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
        <TaskForm userId={userId} onTaskAdded={handleTaskAdded} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Your Tasks
          </h2>
          <TaskList userId={userId} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}