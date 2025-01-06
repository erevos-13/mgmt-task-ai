import { create } from 'zustand';
import { Task } from '../models/task';
import { tasksService } from '../services/tasks.service';

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: number, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  moveTask: (taskId: number, newStatus: Task['status']) => Promise<void>;
}

export const useTasksStore = create<TasksState>()((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  setTasks: (tasks) => set({ tasks }),

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const tasks = await tasksService.getTasks();
      set({ tasks, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch tasks', isLoading: false });
    }
  },

  addTask: async (task) => {
    try {
      set({ isLoading: true, error: null });
      const newTask = await tasksService.createTask(task);
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to create task', isLoading: false });
    }
  },

  updateTask: async (id, taskUpdate) => {
    try {
      set({ isLoading: true, error: null });
      const updatedTask = await tasksService.updateTask(id, taskUpdate);
      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to update task', isLoading: false });
    }
  },

  deleteTask: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await tasksService.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to delete task', isLoading: false });
    }
  },

  moveTask: async (taskId, newStatus) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      set({ isLoading: true, error: null });
      const updatedTask = await tasksService.updateTask(taskId, {
        ...task,
        status: newStatus,
      });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Failed to move task', isLoading: false });
    }
  },
}));
