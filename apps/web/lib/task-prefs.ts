// Task-specific functionality (task ideas, task stats)
import { TaskIdea, TaskStats } from "../type/task";
import { kv } from "./kv";
import { getLatestTask } from "../tasks/task-list";

// Rate limiting functionality
export async function canUserSubmitTask(userId: string): Promise<boolean> {
  if (!userId) return true; // Allow anonymous submissions for now
  
  const rateLimitKey = `rate_limit:task_submit:${userId}`;
  const lastSubmission = await kv.get<number>(rateLimitKey);
  
  if (!lastSubmission) return true;
  
  const hourInMs = 60 * 60 * 1000; // 1 hour in milliseconds
  const timeSinceLastSubmission = Date.now() - lastSubmission;
  
  return timeSinceLastSubmission >= hourInMs;
}

export async function recordTaskSubmission(userId: string): Promise<void> {
  if (!userId) return; // Skip rate limiting for anonymous users
  
  const rateLimitKey = `rate_limit:task_submit:${userId}`;
  const currentTime = Date.now();
  
  // Store the timestamp with 1 hour expiration (3600 seconds)
  await kv.setex(rateLimitKey, 3600, currentTime);
}

export async function getTimeUntilNextSubmission(userId: string): Promise<number> {
  if (!userId) return 0;
  
  const rateLimitKey = `rate_limit:task_submit:${userId}`;
  const lastSubmission = await kv.get<number>(rateLimitKey);
  
  if (!lastSubmission) return 0;
  
  const hourInMs = 60 * 60 * 1000;
  const timeSinceLastSubmission = Date.now() - lastSubmission;
  const timeRemaining = hourInMs - timeSinceLastSubmission;
  
  return Math.max(0, timeRemaining);
}

// Task idea submission and voting
export async function getTaskIdeas(): Promise<TaskIdea[]> {
  const ideaIds = (await kv.get<string[]>("global:taskideas")) || [];
  const ideas: TaskIdea[] = [];

  for (const ideaId of ideaIds) {
    const idea = await kv.get<TaskIdea>(`taskidea:${ideaId}`);
    if (idea) {
      ideas.push(idea);
    }
  }

  return ideas.sort((a, b) => b.votes - a.votes);
}

export async function submitTaskIdea(
  idea: Omit<TaskIdea, "id" | "votes" | "voters" | "createdAt">,
  userId?: string
): Promise<string> {
  // Record the submission for rate limiting
  if (userId) {
    await recordTaskSubmission(userId);
  }

  const ideaId = `idea_${Date.now()}_${Math.random().toString(36).substring(2)}`;

  const newIdea: TaskIdea = {
    ...idea,
    id: ideaId,
    votes: 0,
    voters: [],
    createdAt: new Date().toISOString(),
    submittedBy: userId,
  };

  await kv.set(`taskidea:${ideaId}`, newIdea);

  // Add to global task ideas list
  const globalIdeas = (await kv.get<string[]>("global:taskideas")) || [];
  globalIdeas.unshift(ideaId);
  await kv.set("global:taskideas", globalIdeas);

  // Update user preferences if user ID provided
  if (userId) {
    const { getPrefs, updatePrefs } = await import("./user-prefs");
    const userPrefs = await getPrefs(userId);
    const votedTaskIdeas = userPrefs.votedTaskIdeas || [];
    if (!votedTaskIdeas.includes(ideaId)) {
      votedTaskIdeas.push(ideaId);
      await updatePrefs({ ...userPrefs, votedTaskIdeas }, userId);
    }
  }

  return ideaId;
}

export type VoteResult =
  | { success: true }
  | { success: false; reason: "idea_not_found" | "already_voted" };

export async function voteForTaskIdea(
  ideaId: string,
  userId?: string
): Promise<VoteResult> {
  const idea = await kv.get<TaskIdea>(`taskidea:${ideaId}`);
  if (!idea) {
    return { success: false, reason: "idea_not_found" };
  }

  const voterId = userId || `guest:${Date.now()}`;

  // Check if already voted
  if (idea.voters.includes(voterId)) {
    return { success: false, reason: "already_voted" };
  }

  // Add vote
  idea.votes += 1;
  idea.voters.push(voterId);

  await kv.set(`taskidea:${ideaId}`, idea);

  // Update user preferences if user ID provided
  if (userId) {
    const { getPrefs, updatePrefs } = await import("./user-prefs");
    const userPrefs = await getPrefs(userId);
    const votedTaskIdeas = userPrefs.votedTaskIdeas || [];
    if (!votedTaskIdeas.includes(ideaId)) {
      votedTaskIdeas.push(ideaId);
      await updatePrefs({ ...userPrefs, votedTaskIdeas }, userId);
    }
  }

  return { success: true };
}

export async function hasUserVotedForIdea(
  ideaId: string,
  userId?: string
): Promise<boolean> {
  if (!userId) return false;

  const idea = await kv.get<TaskIdea>(`taskidea:${ideaId}`);
  if (!idea) return false;

  return idea.voters.includes(userId);
}

export async function updateTaskIdeaStatus(
  ideaId: string,
  status: TaskIdea["status"]
): Promise<boolean> {
  const idea = await kv.get<TaskIdea>(`taskidea:${ideaId}`);
  if (!idea) return false;

  idea.status = status;
  await kv.set(`taskidea:${ideaId}`, idea);
  return true;
}

export async function deleteOldTaskIdeas(olderThanDays: number = 1): Promise<{ deletedCount: number; deletedIds: string[] }> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
  const cutoffTime = cutoffDate.getTime();
  
  const globalIdeas = (await kv.get<string[]>("global:taskideas")) || [];
  const idsToDelete: string[] = [];
  const idsToKeep: string[] = [];
  
  for (const ideaId of globalIdeas) {
    const idea = await kv.get<TaskIdea>(`taskidea:${ideaId}`);
    if (idea && idea.createdAt) {
      const ideaCreatedTime = new Date(idea.createdAt).getTime();
      if (ideaCreatedTime < cutoffTime) {
        idsToDelete.push(ideaId);
        // Delete the individual idea record
        await kv.del(`taskidea:${ideaId}`);
      } else {
        idsToKeep.push(ideaId);
      }
    } else {
      // If idea doesn't exist or has no createdAt, consider it for deletion
      idsToDelete.push(ideaId);
      await kv.del(`taskidea:${ideaId}`);
    }
  }
  
  // Update the global ideas list to only include kept ideas
  await kv.set("global:taskideas", idsToKeep);
  
  return {
    deletedCount: idsToDelete.length,
    deletedIds: idsToDelete
  };
}

// Task statistics
export async function trackTaskVisit(
  taskId: string,
  timeSpent?: number
): Promise<void> {
  const stats = await kv.get<TaskStats>(`task:stats:${taskId}`);

  const updatedStats: TaskStats = {
    id: taskId,
    name: stats?.name || taskId,
    visits: (stats?.visits || 0) + 1,
    timeSpent: (stats?.timeSpent || 0) + (timeSpent || 0),
    rating: stats?.rating || 0,
    createdAt: stats?.createdAt || new Date().toISOString(),
  };

  await kv.set(`task:stats:${taskId}`, updatedStats);
}

export async function getTaskStats(taskId: string): Promise<TaskStats | null> {
  return await kv.get<TaskStats>(`task:stats:${taskId}`);
}

export async function getAllTaskStats(): Promise<TaskStats[]> {
  const keys = await kv.keys("task:stats:*");
  const stats: TaskStats[] = [];

  for (const key of keys) {
    const stat = await kv.get<TaskStats>(key);
    if (stat) stats.push(stat);
  }

  return stats.sort((a, b) => b.visits - a.visits);
}

// Latest task management
export async function getLatestTaskId(): Promise<string | null> {
  const latestTask = getLatestTask();
  return latestTask?.id || null;
}
