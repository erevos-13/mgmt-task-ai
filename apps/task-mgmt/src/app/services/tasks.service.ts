import axios from '../lib/axios';
import { Task } from '../models/task';

export const tasksService = {
  async getTasks(): Promise<Task[]> {
    const { data } = await axios.get<Task[]>('/tasks');
    return data;
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    const { data } = await axios.post<Task>('/tasks', task);
    return data;
  },

  async updateTask(id: number, task: Partial<Task>): Promise<Task> {
    const { data } = await axios.patch<Task>(`/tasks/${id}`, task);
    return data;
  },

  async deleteTask(id: number): Promise<void> {
    await axios.delete(`/tasks/${id}`);
  },
};
