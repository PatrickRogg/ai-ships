// Task list management - AI-managed global tasks
// Tasks are stored in this file to avoid database complexity and ensure uniqueness

import { Task } from '../type/task';
import Task0000001 from './task-0000001';

// Static task list maintained by AI
export const TASK_LIST: Task[] = [
  {
    id: "task-0000001",
    name: "Interactive Color Palette Generator",
    description: "A beautiful tool to generate and explore color palettes with live preview and export functionality",
    createdAt: "2024-01-15T10:00:00Z",
    component: Task0000001
  }
];

/**
 * Get the latest task (last in the list)
 */
export function getLatestTask(): Task | null {
  if (TASK_LIST.length === 0) return null;
  const latest = TASK_LIST[TASK_LIST.length - 1];
  return latest || null;
}

/**
 * Get all tasks in reverse chronological order (newest first)
 */
export function getAllTasks(): Task[] {
  return [...TASK_LIST].reverse();
}

/**
 * Get a specific task by ID
 */
export function getTaskById(id: string): Task | null {
  return TASK_LIST.find(task => task.id === id) || null;
}

/**
 * Add a new task to the list (AI only)
 * Returns the task ID
 */
export function addTask(task: Omit<Task, 'id' | 'createdAt'>): string {
  // Generate unique ID
  const id = `task-${String(TASK_LIST.length + 1).padStart(3, '0')}`;

  const newTask: Task = {
    ...task,
    id,
    createdAt: new Date().toISOString()
  };

  // Check for duplicate IDs (safety check)
  if (TASK_LIST.find(t => t.id === id)) {
    throw new Error(`Task ID ${id} already exists`);
  }

  TASK_LIST.push(newTask);
  return id;
}

/**
 * Check if a task ID already exists
 */
export function taskExists(id: string): boolean {
  return TASK_LIST.some(task => task.id === id);
}

/**
 * Get task count
 */
export function getTaskCount(): number {
  return TASK_LIST.length;
}