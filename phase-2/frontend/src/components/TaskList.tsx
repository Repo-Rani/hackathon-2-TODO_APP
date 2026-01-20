'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import TaskItem from './TaskItem';
import { taskAPI } from '../services/api';
import { CheckCircle2, Circle, Plus, Filter, List, CheckSquare, Square, RotateCcw } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface TaskListProps {
  userId: string;
}

const TaskList = ({ userId }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadTasks();
  }, [userId, filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');

      const params: { completed?: boolean } = {};
      if (filter === 'active') {
        params.completed = false;
      } else if (filter === 'completed') {
        params.completed = true;
      }

      const response = await taskAPI.getTasks(userId, params);
      setTasks(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const errorMessage = error.response?.data?.detail || 'Failed to load tasks';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdated = () => {
    // Reload tasks after update
    loadTasks();
  };

  const handleTaskDeleted = () => {
    // Reload tasks after deletion
    loadTasks();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  const activeCount = tasks.filter(task => !task.completed).length;
  const completedCount = tasks.filter(task => task.completed).length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive font-medium">{error}</p>
          <Button
            variant="outline"
            className="mt-4 flex items-center gap-2"
            onClick={loadTasks}
          >
            <RotateCcw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tasks</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <List className="h-3 w-3" />
            {tasks.length}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckSquare className="h-3 w-3" />
            {completedCount}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Square className="h-3 w-3" />
            {activeCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(value: any) => setFilter(value)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              All
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Circle className="h-4 w-4" />
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-4 space-y-3">
          <AnimatePresence>
            <LayoutGroup>
              {filteredTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-8"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    {filter === 'all' ? (
                      <>
                        <div className="p-3 bg-muted rounded-full">
                          <Plus className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium text-lg">No tasks yet</h3>
                        <p className="text-muted-foreground">Add your first task to get started!</p>
                      </>
                    ) : filter === 'active' ? (
                      <>
                        <div className="p-3 bg-muted rounded-full">
                          <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium text-lg">No active tasks</h3>
                        <p className="text-muted-foreground">Great job! All tasks are completed.</p>
                      </>
                    ) : (
                      <>
                        <div className="p-3 bg-muted rounded-full">
                          <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="font-medium text-lg">No completed tasks</h3>
                        <p className="text-muted-foreground">Start completing tasks to see them here.</p>
                      </>
                    )}
                  </div>
                </motion.div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    userId={userId}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                  />
                ))
              )}
            </LayoutGroup>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskList;