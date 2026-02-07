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
import { useTaskContext } from '../contexts/TaskContext';
import { CheckCircle2, Circle, Plus, Filter, List, CheckSquare, Square, RotateCcw } from 'lucide-react';

interface TaskListProps {}

const TaskList = ({}: TaskListProps) => {
  const {
    tasks: allTasks = [],
    loading,
    error: contextError,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  } = useTaskContext();

  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Filter tasks based on the selected filter
  const filteredTasks = allTasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
  });

  const handleTaskUpdated = async (taskId: string, updates: any) => {
    const success = await updateTask(taskId, updates);
    if (success) {
      toast.success('Task updated successfully');
    } else {
      toast.error('Failed to update task');
    }
  };

  const handleTaskDeleted = async (taskId: string) => {
    const success = await deleteTask(taskId);
    if (success) {
      toast.success('Task deleted successfully');
    } else {
      toast.error('Failed to delete task');
    }
  };

  const handleToggleCompletion = async (taskId: string) => {
    const success = await toggleTaskCompletion(taskId);
    if (success) {
      toast.success('Task updated successfully');
    } else {
      toast.error('Failed to update task');
    }
  };

  const activeCount = allTasks.filter(task => !task.completed).length;
  const completedCount = allTasks.filter(task => task.completed).length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (contextError) {
    // Check if it's a 404 error related to missing tasks
    if (contextError.includes('404')) {
      return (
        <div className="text-center py-8">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-muted rounded-full">
              <List className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-lg">No tasks yet</h3>
            <p className="text-muted-foreground">Add your first task to get started!</p>
          </div>
        </div>
      );
    }

    return (
      <Card className="border-destructive">
        <CardContent className="pt-6 text-center">
          <p className="text-destructive font-medium">{contextError}</p>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => window.location.reload()} // Simple retry mechanism
            >
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                // Try to refresh tasks manually
                const event = new Event('refreshTasks');
                window.dispatchEvent(event);
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
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
            {allTasks.length}
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
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                    onToggleCompletion={handleToggleCompletion}
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