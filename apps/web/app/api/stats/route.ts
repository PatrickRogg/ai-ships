import { NextResponse } from "next/server";
import { getAllTasks, getLatestTask } from "@tasks/task-list";
import { getVisitorStats } from "@lib/user-prefs";

export async function GET() {
  try {
    const [visitorStats, allTasks, latestTask] = await Promise.all([
      getVisitorStats(),
      Promise.resolve(getAllTasks()),
      Promise.resolve(getLatestTask()),
    ]);

    // Convert tasks to the format expected by components
    const taskHistory = allTasks.slice(0, 5).map(task => ({
      id: task.id,
      name: task.name,
      createdAt: task.createdAt
    }));

    return NextResponse.json({
      visitorStats,
      taskHistory,
      latestTask: latestTask?.id || null,
    });
  } catch (error) {
    console.error("Error in /api/stats:", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}