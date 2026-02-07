'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';
import { getCurrentUserId } from '../lib/auth';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refreshTrigger: number;
  userId: string | null;
  triggerRefresh: () => void;
  setUserId: (id: string | null) => void;
  fetchTasks: () => Promise<void>;
  addTask: (taskData: { title: string; description?: string }) => Promise<boolean>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<boolean>;
  deleteTask: (taskId: string) => Promise<boolean>;
  toggleTaskCompletion: (taskId: string) => Promise<boolean>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  // Effect to set user ID when session is available
  useEffect(() => {
    const setUserIdFromSession = async () => {
      try {
        const user_id = await getCurrentUserId();
        if (user_id) {
          setUserId(user_id);
        }
      } catch (error) {
        console.error('Error getting user ID from session:', error);
      }
    };
    setUserIdFromSession();

    // Poll for user ID if not set immediately
    const pollUserId = setInterval(async () => {
      if (!userId) {
        const user_id = await getCurrentUserId();
        if (user_id) {
          setUserId(user_id);
          clearInterval(pollUserId);
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(pollUserId);
  }, []);

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      // Try to get user ID dynamically if not set
      effectiveUserId = await getCurrentUserId();
      if (effectiveUserId) {
        setUserId(effectiveUserId);
      } else {
        setError('No user ID provided');
        console.warn('Cannot fetch tasks: No userId available');
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching tasks for user:', effectiveUserId);

      const response = await taskAPI.getTasks(effectiveUserId);
      console.log('✅ Got response, tasks count:', response.data.length);
      console.log('✅ Tasks:', response.data);
      setTasks(response.data);
    } catch (err) {
      console.error('❌ Error fetching tasks:', err);
      // More detailed error logging
      if (err instanceof Error) {
        console.error('Error details:', err.message);
        if ('response' in err) {
          const responseErr = err as any;
          console.error('Response status:', responseErr.response?.status);
          console.error('Response data:', responseErr.response?.data);
          console.error('Response headers:', responseErr.response?.headers);

          // Set more descriptive error message
          if (responseErr.response?.status === 401) {
            setError('Authentication failed. Please log in again.');
          } else if (responseErr.response?.status === 403) {
            setError('Access forbidden. You do not have permission to view these tasks.');
          } else if (responseErr.response?.status === 404) {
            console.log('No tasks found for user (this is normal for new users)');
            setTasks([]); // Set empty array instead of error for 404
          } else {
            setError(`Failed to fetch tasks: ${responseErr.response?.data?.detail || err.message}`);
          }
        } else {
          setError(`Network error: ${err.message}`);
        }
      } else {
        setError('An unknown error occurred while fetching tasks');
      }
      // Don't redirect on error - just set error state
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Add a new task
  const addTask = useCallback(async (taskData: { title: string; description?: string }) => {
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      effectiveUserId = await getCurrentUserId();
      if (!effectiveUserId) {
        setError('No user ID provided');
        console.warn('Cannot add task: No user ID available');
        return false;
      }
    }

    try {
      setLoading(true);
      const response = await taskAPI.createTask(effectiveUserId, taskData);
      console.log('✅ Task added:', response.data);

      // Update local state
      setTasks(prev => [response.data, ...prev]);
      return true;
    } catch (err) {
      console.error('❌ Error adding task:', err);
      // Log more details about the error
      if (err instanceof Error) {
        console.error('Error details:', err.message);
        if ('response' in err) {
          console.error('Response status:', (err as any).response?.status);
          console.error('Response data:', (err as any).response?.data);
        }
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to add task';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update a task
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      effectiveUserId = await getCurrentUserId();
      if (!effectiveUserId) {
        setError('No user ID provided');
        return false;
      }
    }

    try {
      setLoading(true);
      const response = await taskAPI.updateTask(effectiveUserId, taskId, updates);
      console.log('✅ Task updated:', response.data);

      // Update local state
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, ...response.data } : task
      ));
      return true;
    } catch (err) {
      console.error('❌ Error updating task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update task';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Delete a task
  const deleteTask = useCallback(async (taskId: string) => {
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      effectiveUserId = await getCurrentUserId();
      if (!effectiveUserId) {
        setError('No user ID provided');
        return false;
      }
    }

    try {
      setLoading(true);
      await taskAPI.deleteTask(effectiveUserId, taskId);
      console.log('✅ Task deleted:', taskId);

      // Update local state
      setTasks(prev => prev.filter(task => task.id !== taskId));
      return true;
    } catch (err) {
      console.error('❌ Error deleting task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete task';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Toggle task completion
  const toggleTaskCompletion = useCallback(async (taskId: string) => {
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      effectiveUserId = await getCurrentUserId();
      if (!effectiveUserId) {
        setError('No user ID provided');
        return false;
      }
    }

    try {
      setLoading(true);
      const response = await taskAPI.toggleTaskCompletion(effectiveUserId, taskId);
      console.log('✅ Task toggled:', response.data);

      // Update local state
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, ...response.data } : task
      ));
      return true;
    } catch (err) {
      console.error('❌ Error toggling task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle task';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Function to trigger refresh
  const triggerRefresh = useCallback(() => {
    console.log('TaskContext: Manual refresh triggered');
    // Update the trigger to cause re-render
    setRefreshTrigger(prev => prev + 1);
    // And immediately fetch tasks if userId is available
    if (userId) {
      fetchTasks();
    }
  }, [userId, fetchTasks]);

  // Fetch tasks when userId changes or refresh trigger changes
  useEffect(() => {
    console.log('TaskContext: userId or refreshTrigger changed, fetching tasks...', { userId, refreshTrigger });
    if (userId) {
      fetchTasks();
    } else {
      // If no userId, try to get it dynamically
      const getAndSetUserId = async () => {
        const dynamicUserId = await getCurrentUserId();
        if (dynamicUserId) {
          setUserId(dynamicUserId);
          fetchTasks();
        } else {
          // If we still can't get a user ID, wait a bit and try again
          setTimeout(async () => {
            const retryUserId = await getCurrentUserId();
            if (retryUserId) {
              setUserId(retryUserId);
              fetchTasks();
            }
          }, 1000);
        }
      };
      getAndSetUserId();
    }
  }, [userId, refreshTrigger, fetchTasks]);

  // Listen for task update events globally
  useEffect(() => {
    // ✅ Enhanced event listener with proper typing
    const enhancedHandleTaskUpdate = async (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('TaskContext: Enhanced task update event received...', customEvent?.detail);

      // Small delay to ensure all operations are complete before refreshing
      setTimeout(() => {
        if (userId) {
          fetchTasks();
        } else {
          // Retry getting userId if not set
          getCurrentUserId().then(dynamicUserId => {
            if (dynamicUserId) {
              setUserId(dynamicUserId);
              fetchTasks();
            }
          }).catch(err => {
            console.warn('Could not get userId for refresh:', err);
          });
        }
      }, 200); // Small delay to ensure operations are complete
    };

    // ✅ Listen to ALL task-related events with proper type
    window.addEventListener('taskUpdated', enhancedHandleTaskUpdate as EventListener);
    window.addEventListener('refreshTasks', enhancedHandleTaskUpdate as EventListener);
    window.addEventListener('tasksChanged', enhancedHandleTaskUpdate as EventListener);

    return () => {
      window.removeEventListener('taskUpdated', enhancedHandleTaskUpdate as EventListener);
      window.removeEventListener('refreshTasks', enhancedHandleTaskUpdate as EventListener);
      window.removeEventListener('tasksChanged', enhancedHandleTaskUpdate as EventListener);
    };
  }, [userId, fetchTasks]); // Include fetchTasks in dependency

  const value = {
    tasks,
    loading,
    error,
    refreshTrigger,
    userId,
    setUserId,
    triggerRefresh,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}