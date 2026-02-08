import axios from 'axios';
import { User, Task, CreateTaskDTO, UpdateTaskDTO} from "../../types"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,  
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Try multiple token sources to support Better Auth
  const token = localStorage.getItem('better-auth.session_token') ||
                localStorage.getItem('access_token') ||
                localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
console.log(
  'API Request:',
  config.method?.toUpperCase(),
  `${config.baseURL ?? ''}${config.url ?? ''}`
);  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.url, error.response?.status, error.message);
    if (error.response?.status === 401) {
      // Remove all possible token names for Better Auth compatibility
      localStorage.removeItem('better-auth.session_token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
      window.location.href = '/signin';
    } else if (error.response?.status === 404) {
      // For 404 errors, don't redirect, just log and let the calling code handle it
      console.log('Resource not found:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

// ✅ AUTH APIs
export const authAPI = {
  signup: (data: { email: string; name?: string; password: string }) =>
    api.post<User>('/api/signup', data),

  signin: (data: { email: string; password: string }) =>
    api.post<{ access_token: string }>('/api/signin', data).then(response => {
      // Store the token in the format expected by Better Auth
      if (response.data.access_token) {
        localStorage.setItem('better-auth.session_token', response.data.access_token);
      }
      return response;
    }),

  getCurrentUser: () =>
    api.get<User>('/api/me'),
};

// ✅ TASK APIs
export const taskAPI = {
  createTask: (userId: string, data: CreateTaskDTO) =>
    api.post<Task>(`/api/${userId}/tasks/`, data).then(response => {
      console.log('Task created successfully:', response.data);
      // Trigger task update event after successful API call
      window.dispatchEvent(new CustomEvent('taskUpdated', { detail: { action: 'create', data: response.data } }));
      return response;
    }).catch(error => {
      console.error('Error creating task:', error);
      throw error;
    }),

  getTasks: (userId: string, params?: { completed?: boolean }) =>
    api.get<Task[]>(`/api/${userId}/tasks/`, { params }).then(response => {
      console.log('Tasks fetched successfully:', response.data);
      return response;
    }).catch(error => {
      console.error('Error fetching tasks:', error);
      throw error;
    }),

  getTask: (userId: string, taskId: string) =>
    api.get<Task>(`/api/${userId}/tasks/${taskId}`).then(response => {
      console.log('Task fetched successfully:', response.data);
      return response;
    }).catch(error => {
      console.error('Error fetching task:', error);
      throw error;
    }),

  updateTask: (userId: string, taskId: string, data: UpdateTaskDTO) =>
    api.put<Task>(`/api/${userId}/tasks/${taskId}`, data).then(response => {
      console.log('Task updated successfully:', response.data);
      // Trigger task update event after successful API call
      window.dispatchEvent(new CustomEvent('taskUpdated', { detail: { action: 'update', data: response.data } }));
      return response;
    }).catch(error => {
      console.error('Error updating task:', error);
      throw error;
    }),

  deleteTask: (userId: string, taskId: string) =>
    api.delete<{ message: string }>(`/api/${userId}/tasks/${taskId}`).then(response => {
      console.log('Task deleted successfully:', taskId);
      // Trigger task update event after successful API call
      window.dispatchEvent(new CustomEvent('taskUpdated', { detail: { action: 'delete', taskId } }));
      return response;
    }).catch(error => {
      console.error('Error deleting task:', error);
      // Check if it's a 404 error (task already deleted)
      if (error.response?.status === 404) {
        console.log('Task already deleted or not found:', taskId);
        // Still trigger the update event since the task is effectively gone
        window.dispatchEvent(new CustomEvent('taskUpdated', { detail: { action: 'delete', taskId } }));
        // Return a success-like response to prevent error propagation
        return { data: { message: 'Task not found, assumed deleted' }, status: 200 };
      }
      throw error;
    }),

  toggleTaskCompletion: (userId: string, taskId: string) =>
    api.patch<Task>(`/api/${userId}/tasks/${taskId}/complete`).then(response => {
      console.log('Task completion toggled successfully:', response.data);
      // Trigger task update event after successful API call
      window.dispatchEvent(new CustomEvent('taskUpdated', { detail: { action: 'toggle', data: response.data } }));
      return response;
    }).catch(error => {
      console.error('Error toggling task completion:', error);
      throw error;
    }),
};

export default api;
