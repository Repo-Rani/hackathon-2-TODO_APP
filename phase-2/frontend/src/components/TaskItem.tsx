'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Edit,
  Trash2,
  Check,
  Save,
  X,
  Calendar,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { taskAPI } from '../services/api';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface TaskItemProps {
  task: Task;
  userId: string;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

const TaskItem = ({ task, userId, onTaskUpdated, onTaskDeleted }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleToggleComplete = async () => {
    try {
      setLoading(true);
      await taskAPI.toggleTaskCompletion(userId, task.id);

      // Show success notification
      toast.success(task.completed ? 'Task marked as active!' : 'Task completed!');

      onTaskUpdated(); // Refresh the task list
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const errorMessage = error.response?.data?.detail || 'Failed to update task';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setLoading(true);
      await taskAPI.deleteTask(userId, task.id);

      // Show success notification
      toast.success('Task deleted successfully!');

      onTaskDeleted(); // Remove from the list
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const errorMessage = error.response?.data?.detail || 'Failed to delete task';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      await taskAPI.updateTask(userId, task.id, {
        title: editTitle,
        description: editDescription || undefined,
      });
      setIsEditing(false);

      // Show success notification
      toast.success('Task updated successfully!');

      onTaskUpdated(); // Refresh the task list
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const errorMessage = error.response?.data?.detail || 'Failed to update task';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95, height: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <Card className={`transition-all duration-200 hover:shadow-md ${task.completed ? 'bg-green-50/50 dark:bg-green-950/20' : ''}`}>
        <CardContent className="p-4">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="text-lg font-medium"
                  placeholder="Task title..."
                  autoFocus
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Task description..."
                  rows={3}
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={loading || !editTitle.trim()}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setEditTitle(task.title);
                      setEditDescription(task.description || '');
                    }}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="flex items-start gap-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleToggleComplete}
                    disabled={loading}
                    className="mt-0.5"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={handleToggleComplete}
                      disabled={loading}
                    />
                  </motion.button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-base font-medium break-words ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </h3>
                      {task.completed && (
                        <Badge variant="secondary" className="text-xs">
                          Completed
                        </Badge>
                      )}
                    </div>

                    {task.description && (
                      <p className={`mt-1 text-sm break-words ${task.completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {task.description}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(task.created_at)} at {formatTime(task.created_at)}</span>
                      </div>
                      {task.updated_at !== task.created_at && (
                        <div className="flex items-center gap-1">
                          <span>•</span>
                          <span>Updated {formatDate(task.updated_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex items-center gap-2 text-destructive border-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm font-medium text-destructive"
            >
              {error}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskItem;