import axios from 'axios';
import { User, Task, CreateTaskDTO, UpdateTaskDTO} from "../../types"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,  
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// ✅ AUTH APIs
export const authAPI = {
  signup: (data: { email: string; name?: string; password: string }) =>
    api.post<User>('/api/signup', data),

  signin: (data: { email: string; password: string }) =>
    api.post<{ access_token: string }>('/api/signin', data),

  getCurrentUser: () =>
    api.get<User>('/api/me'),
};

// ✅ TASK APIs
export const taskAPI = {
  createTask: (userId: string, data: CreateTaskDTO) =>
    api.post<Task>(`/api/${userId}/tasks/`, data),

  getTasks: (userId: string, params?: { completed?: boolean }) =>
  api.get<Task[]>(`/api/${userId}/tasks/`, { params }),

  getTask: (userId: string, taskId: string) =>
    api.get<Task>(`/api/${userId}/tasks/${taskId}`),

  updateTask: (userId: string, taskId: string, data: UpdateTaskDTO) =>
    api.put<Task>(`/api/${userId}/tasks/${taskId}`, data),

  deleteTask: (userId: string, taskId: string) =>
    api.delete<{ message: string }>(`/api/${userId}/tasks/${taskId}`),

  toggleTaskCompletion: (userId: string, taskId: string) =>
    api.patch<Task>(`/api/${userId}/tasks/${taskId}/complete`),
};

export default api;
