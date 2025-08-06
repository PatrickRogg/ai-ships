import { generateObject } from "./ai";
import { getModel } from "./ai";
import { getProjectInspiration, getTrendingTechnologies } from "./hackernews";
import { z } from "zod";

// Schema for AI-generated task ideas
const taskIdeaSchema = z.object({
  title: z.string().min(10).max(100).describe("Catchy, fun title for the task"),
  description: z.string().min(50).max(300).describe("Clear description of what the user will do and achieve"),
  category: z.enum(["game", "puzzle", "tool"]).describe("Type of interactive task"),
  difficulty: z.enum(["easy", "medium", "hard"]).describe("How challenging the task is to complete"),
  estimatedTime: z.number().min(30).max(90).describe("Estimated completion time in seconds"),
  keywords: z.array(z.string()).min(2).max(5).describe("Relevant technology or topic keywords"),
  inspiration: z.string().describe("What HackerNews trend or story inspired this task"),
  interactionType: z.enum([
    "click", "drag", "type", "select", "draw", "swipe", "scroll"
  ]).describe("Primary interaction method"),
  goalType: z.enum([
    "score", "completion", "accuracy", "speed", "creativity"
  ]).describe("How success is measured"),
});

const batchTaskIdeasSchema = z.object({
  tasks: z.array(taskIdeaSchema).min(3).max(6).describe("Generated task ideas based on current trends"),
  trendSummary: z.string().describe("Summary of the current tech trends that inspired these tasks"),
  reasoning: z.string().describe("Why these particular tasks would be engaging right now"),
});

export type AITaskIdea = z.infer<typeof taskIdeaSchema>;
export type AITaskBatch = z.infer<typeof batchTaskIdeasSchema>;

/**
 * Generate task ideas using AI based on current HackerNews trends
 */
export async function generateTaskIdeas(): Promise<AITaskBatch> {
  // Get current trending data from HackerNews
  const [inspirations, trending] = await Promise.all([
    getProjectInspiration(20),
    getTrendingTechnologies(),
  ]);

  // Prepare context for AI
  const trendContext = trending.slice(0, 10).join(", ");
  const inspirationContext = inspirations
    .slice(0, 10)
    .map(i => `${i.title} (${i.inspirationType}) - ${i.summary}`)
    .join("\n");

  const prompt = `You are a creative AI task designer for AI Ships, a platform where users complete fun interactive tasks in under 1 minute.

CURRENT TECH TRENDS: ${trendContext}

RECENT HACKERNEWS INSPIRATION:
${inspirationContext}

Create engaging, interactive task ideas that:
1. Can be completed in 30-90 seconds
2. Are inspired by current tech trends
3. Have clear, achievable goals
4. Are fun and shareable
5. Work well on mobile devices

TASK CATEGORIES:
- GAMES: Quick reflex, memory, pattern matching, simple arcade-style
- PUZZLES: Logic, math, coding challenges, brain teasers  
- TOOLS: Interactive utilities, generators, converters, mini-apps

Focus on creating tasks that feel modern and relevant to current tech discussions. Make them immediately engaging and satisfying to complete.

Examples of good tasks:
- "Trending Color Palette Generator" (inspired by design discussions)
- "Code Golf Challenge" (inspired by programming posts)
- "AI Prompt Battle" (inspired by AI/ML trends)
- "Crypto Price Predictor Game" (inspired by crypto discussions)
- "Tech Stack Builder" (inspired by framework discussions)`;

  const result = await generateObject({
    model: getModel("gemini-2.5-flash"),
    schema: batchTaskIdeasSchema,
    prompt,
  });

  return result.object;
}

/**
 * Generate a single focused task idea for a specific trend
 */
export async function generateFocusedTaskIdea(
  trend: string,
  inspirationTitle?: string
): Promise<AITaskIdea> {
  const prompt = `Create a single engaging interactive task inspired by the tech trend: "${trend}"${
    inspirationTitle ? ` and the HackerNews story: "${inspirationTitle}"` : ""
  }.

The task should:
- Be completable in 30-90 seconds
- Have immediate visual feedback
- Be fun and addictive
- Work perfectly on mobile
- Feel modern and relevant

Focus on creating something that showcases the trend in an interactive, playable way.`;

  const result = await generateObject({
    model: getModel("gemini-2.5-flash"),
    schema: taskIdeaSchema,
    prompt,
  });

  return result.object;
}

/**
 * Validate and enhance a task idea for implementation
 */
export async function enhanceTaskIdea(
  taskIdea: AITaskIdea
): Promise<{
  enhanced: AITaskIdea;
  implementationNotes: string;
  technicalRequirements: string[];
}> {
  const enhancementSchema = z.object({
    enhanced: taskIdeaSchema,
    implementationNotes: z.string().describe("Specific notes for the AI agent implementing this task"),
    technicalRequirements: z.array(z.string()).describe("Technical components needed (UI elements, libraries, etc.)"),
  });

  const prompt = `Review and enhance this task idea for implementation:

TASK: ${JSON.stringify(taskIdea, null, 2)}

Enhance it by:
1. Refining the title and description for maximum engagement
2. Ensuring it's achievable in the time limit
3. Adding specific implementation guidance
4. Identifying required UI components and interactions

The enhanced task should be ready for an AI coding agent to implement using React, TypeScript, and Tailwind CSS.`;

  const result = await generateObject({
    model: getModel("gemini-2.5-flash"),
    schema: enhancementSchema,
    prompt,
  });

  return result.object;
}

/**
 * Get task ideas formatted for the existing task submission system
 */
export async function getFormattedTaskIdeas(): Promise<Array<{
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
}>> {
  const batch = await generateTaskIdeas();
  
  return batch.tasks.map(task => ({
    title: task.title,
    description: `${task.description}\n\nCategory: ${task.category} | Difficulty: ${task.difficulty} | Est. time: ${task.estimatedTime}s\n\nInspired by: ${task.inspiration}`,
    status: "pending" as const,
  }));
}