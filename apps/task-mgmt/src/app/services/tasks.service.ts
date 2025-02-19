import axios from '../lib/axios';
import { Task } from '../models/task';

export const tasksService = {
  async getTasks(): Promise<Task[]> {
    const { data } = await axios.get<{ tasks: Task[] }>('/api/v1/task');
    return data.tasks;
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const { data } = await axios.post<Task>('/api/v1/task', task);
    return data;
  },

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    const { data } = await axios.patch<Task>(`/api/v1/task/${id}`, task);
    return data;
  },

  async deleteTask(id: number): Promise<void> {
    await axios.delete(`/api/v1/task/${id}`);
  },
};
