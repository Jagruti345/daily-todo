// Simplified types - only essential fields

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Todo {
  id: string;
  title: string;
  date: string;
  time: string; // HH:mm format (single time, not duration)
  priority: Priority;
  category: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoInput {
  title: string;
  date: string;
  time: string;
  priority: Priority;
  category: string;
}

export interface UpdateTodoInput {
  title?: string;
  date?: string;
  time?: string;
  priority?: Priority;
  category?: string;
  completed?: boolean;
}
