import { NextResponse } from "next/server";
import {
  getTaskById,
  getAllTasks,
  getLatestTask
} from "@tasks/task-list";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    
    if (taskId) {
      const task = getTaskById(taskId);
      return NextResponse.json({ task });
    }
    
    // Return all tasks if no specific taskId
    const tasks = getAllTasks();
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Error in GET /api/tasks:", error);
    return NextResponse.json({ error: "Failed to load tasks" }, { status: 500 });
  }
}

export const runtime = "edge";