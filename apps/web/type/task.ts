// New Task architecture - AI-managed global tasks

import React from "react";

export interface Task {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  component: React.ComponentType<any>;
}

export interface TaskCompletion {
  taskId: string;
  completedAt: string;
  timeSpent: number; // in seconds
  attempts: number;
  score?: number;
}

export interface TaskState {
  currentTaskId: string | null;
  startTime: number | null;
  attempts: number;
  isCompleted: boolean;
}

export interface TaskIdea {
  id: string;
  title: string;
  description: string;
  votes: number;
  voters: string[];
  status: "pending" | "in_progress" | "completed" | "rejected";
  createdAt: string;
  submittedBy?: string; // user ID who submitted the idea
}

export interface TaskStats {
  id: string;
  name: string;
  visits: number;
  timeSpent: number; // in seconds
  rating: number;
  createdAt: string;
}

// Task list management - maintained in code, not database
export interface TaskListEntry {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}