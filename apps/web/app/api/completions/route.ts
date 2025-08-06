import { NextRequest, NextResponse } from "next/server";
import { kv } from "@lib/kv";

export interface CompletionRequest {
  userId: string;
  taskId: string;
  timeSpent: number; // in seconds
  attempts: number;
  completedAt: string;
}

export interface StoredCompletion extends CompletionRequest {
  id: string;
  points: number;
}

// Calculate points based on time spent (reverse exponential scoring)
function calculatePoints(timeSpentSeconds: number, attempts: number = 1): number {
  // Base points start high and decrease exponentially with time
  const maxPoints = 1000;
  const timeFactorMinutes = timeSpentSeconds / 60;
  
  // Exponential decay: points = maxPoints * e^(-time/30)
  // This gives ~368 points at 30 min, ~135 points at 60 min, etc.
  const timeMultiplier = Math.exp(-timeFactorMinutes / 30);
  
  // Attempt penalty: reduce points by 10% for each additional attempt
  const attemptMultiplier = Math.pow(0.9, attempts - 1);
  
  const points = Math.round(maxPoints * timeMultiplier * attemptMultiplier);
  return Math.max(points, 10); // Minimum 10 points
}

export async function POST(request: NextRequest) {
  try {
    const { userId, taskId, timeSpent, attempts, completedAt }: CompletionRequest = await request.json();

    if (!userId || !taskId || timeSpent === undefined || !attempts || !completedAt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const completionId = `completion_${userId}_${taskId}_${Date.now()}`;
    const points = calculatePoints(timeSpent, attempts);

    const completion: StoredCompletion = {
      id: completionId,
      userId,
      taskId,
      timeSpent,
      attempts,
      completedAt,
      points
    };

    // Store the completion
    await kv.set(`completion:${completionId}`, completion);
    
    // Also store in user's completion list for faster queries
    const userCompletionsKey = `user:${userId}:completions`;
    const userCompletions = await kv.get<string[]>(userCompletionsKey) || [];
    
    // Remove any existing completion for this task
    const filteredCompletions = userCompletions.filter(id => {
      const [, , existingTaskId] = id.split('_');
      return existingTaskId !== taskId;
    });
    
    // Add the new completion
    filteredCompletions.push(completionId);
    await kv.set(userCompletionsKey, filteredCompletions);

    // Update user's total stats for leaderboard
    await updateUserLeaderboardStats(userId);

    return NextResponse.json({ 
      success: true, 
      completion: {
        id: completionId,
        points
      }
    });
  } catch (error) {
    console.error("Error in POST /api/completions:", error);
    return NextResponse.json({ error: "Failed to save completion" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const taskId = searchParams.get('taskId');

    if (userId && taskId) {
      // Get specific user's completion for a task
      const userCompletions = await kv.get<string[]>(`user:${userId}:completions`) || [];
      
      for (const completionId of userCompletions) {
        const completion = await kv.get<StoredCompletion>(`completion:${completionId}`);
        if (completion && completion.taskId === taskId) {
          return NextResponse.json({ completion });
        }
      }
      
      return NextResponse.json({ completion: null });
    } else if (userId) {
      // Get all user completions
      const userCompletions = await kv.get<string[]>(`user:${userId}:completions`) || [];
      const completions: StoredCompletion[] = [];
      
      for (const completionId of userCompletions) {
        const completion = await kv.get<StoredCompletion>(`completion:${completionId}`);
        if (completion) {
          completions.push(completion);
        }
      }
      
      // Sort by completion date (newest first)
      completions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
      
      return NextResponse.json({ completions });
    } else {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error in GET /api/completions:", error);
    return NextResponse.json({ error: "Failed to fetch completions" }, { status: 500 });
  }
}

async function updateUserLeaderboardStats(userId: string) {
  try {
    // Get all user completions
    const userCompletions = await kv.get<string[]>(`user:${userId}:completions`) || [];
    
    let totalPoints = 0;
    let lastActive = new Date(0).toISOString();
    
    for (const completionId of userCompletions) {
      const completion = await kv.get<StoredCompletion>(`completion:${completionId}`);
      if (completion) {
        totalPoints += completion.points;
        if (completion.completedAt > lastActive) {
          lastActive = completion.completedAt;
        }
      }
    }

    // Store leaderboard entry
    const leaderboardEntry = {
      userId,
      totalPoints,
      completedTasks: userCompletions.length,
      lastActive
    };

    await kv.set(`leaderboard:${userId}`, leaderboardEntry);
    
    // Also maintain a sorted list of user IDs for faster leaderboard queries
    const leaderboardUsers = await kv.get<string[]>('leaderboard:users') || [];
    if (!leaderboardUsers.includes(userId)) {
      leaderboardUsers.push(userId);
      await kv.set('leaderboard:users', leaderboardUsers);
    }
    
  } catch (error) {
    console.error("Error updating user leaderboard stats:", error);
  }
}
