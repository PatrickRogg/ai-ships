export interface LeaderboardEntry {
  userId: string;
  rank: number;
  totalPoints: number;
  completedTasks: number;
  lastActive: string;
}

export interface UserCompletion {
  id: string;
  taskId: string;
  completionTime: number; // in milliseconds
  points: number;
  completedAt: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  userCompletions: UserCompletion[];
  currentUser?: {
    id: string;
    [key: string]: any;
  };
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';