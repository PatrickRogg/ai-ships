'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@providers/user-provider';

export interface TaskCompletion {
  taskId: string;
  completedAt: string;
  timeSpent: number; // in seconds
  attempts: number;
}

export interface TaskState {
  currentTaskId: string | null;
  startTime: number | null;
  attempts: number;
  isCompleted: boolean;
}

interface TaskContextType {
  // Task completion tracking
  completedTasks: TaskCompletion[];
  currentTask: TaskState;
  
  // Task control methods
  startTask: (taskId: string) => void;
  markTaskComplete: (taskId: string) => Promise<void>;
  resetTask: (taskId: string) => void;
  incrementAttempt: () => void;
  
  // Task state queries
  isTaskCompleted: (taskId: string) => boolean;
  getTaskCompletion: (taskId: string) => TaskCompletion | null;
  getCurrentTimeSpent: () => number;
  getTotalCompletedTasks: () => number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const { user } = useUser();
  const [completedTasks, setCompletedTasks] = useState<TaskCompletion[]>([]);
  const [currentTask, setCurrentTask] = useState<TaskState>({
    currentTaskId: null,
    startTime: null,
    attempts: 0,
    isCompleted: false
  });

  // Load completed tasks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ai-ships-completed-tasks');
    if (saved) {
      try {
        setCompletedTasks(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load completed tasks:', error);
      }
    }
  }, []);

  // Save completed tasks to localStorage whenever they change
  useEffect(() => {
    if (completedTasks.length > 0) {
      localStorage.setItem('ai-ships-completed-tasks', JSON.stringify(completedTasks));
    }
  }, [completedTasks]);

  const startTask = (taskId: string) => {
    setCurrentTask({
      currentTaskId: taskId,
      startTime: Date.now(),
      attempts: 1,
      isCompleted: false
    });
  };

  const markTaskComplete = async (taskId: string) => {
    if (!currentTask.startTime || !user) return;

    const timeSpent = Math.floor((Date.now() - currentTask.startTime) / 1000);
    const completedAt = new Date().toISOString();
    
    const completion: TaskCompletion = {
      taskId,
      completedAt,
      timeSpent,
      attempts: currentTask.attempts
    };

    // Update local state first
    setCompletedTasks(prev => {
      // Remove any existing completion for this task
      const filtered = prev.filter(task => task.taskId !== taskId);
      return [...filtered, completion];
    });

    setCurrentTask(prev => ({
      ...prev,
      isCompleted: true
    }));

    // Send to backend for persistence and leaderboard tracking
    try {
      await fetch('/api/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          taskId,
          timeSpent,
          attempts: currentTask.attempts,
          completedAt
        }),
      });
    } catch (error) {
      console.error('Failed to save completion to backend:', error);
      // Continue with local storage as fallback
    }
  };

  const resetTask = (taskId: string) => {
    setCurrentTask({
      currentTaskId: taskId,
      startTime: Date.now(),
      attempts: 1,
      isCompleted: false
    });
  };

  const incrementAttempt = () => {
    setCurrentTask(prev => ({
      ...prev,
      attempts: prev.attempts + 1
    }));
  };

  const isTaskCompleted = (taskId: string): boolean => {
    return completedTasks.some(task => task.taskId === taskId);
  };

  const getTaskCompletion = (taskId: string): TaskCompletion | null => {
    return completedTasks.find(task => task.taskId === taskId) || null;
  };

  const getCurrentTimeSpent = (): number => {
    if (!currentTask.startTime) return 0;
    return Math.floor((Date.now() - currentTask.startTime) / 1000);
  };

  const getTotalCompletedTasks = (): number => {
    return completedTasks.length;
  };

  const value: TaskContextType = {
    completedTasks,
    currentTask,
    startTask,
    markTaskComplete,
    resetTask,
    incrementAttempt,
    isTaskCompleted,
    getTaskCompletion,
    getCurrentTimeSpent,
    getTotalCompletedTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}

// Hook for individual task components
export function useTaskInstance(taskId: string) {
  const context = useTask();
  
  useEffect(() => {
    // Auto-start task when component mounts
    if (!context.currentTask.currentTaskId || context.currentTask.currentTaskId !== taskId) {
      context.startTask(taskId);
    }
  }, [taskId, context]);

  return {
    ...context,
    isCompleted: context.currentTask.isCompleted && context.currentTask.currentTaskId === taskId,
    timeSpent: context.getCurrentTimeSpent(),
    attempts: context.currentTask.attempts,
    markComplete: () => context.markTaskComplete(taskId),
    reset: () => context.resetTask(taskId),
    wasEverCompleted: context.isTaskCompleted(taskId),
    completionData: context.getTaskCompletion(taskId)
  };
}