import { verifyCronAuth } from "@lib/cron-auth";
import { deleteOldTaskIdeas, submitTaskIdea } from "@lib/task-prefs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Verify cron authentication
  const authError = verifyCronAuth(request);
  if (authError) {
    return authError;
  }

  try {
    await deleteOldTaskIdeas(2);
  } catch (error) {
    console.error("Error deleting old task ideas:", error);
  }

  try {
    await Promise.all([
      submitTaskIdea({
        title: "Test Task",
        description: "This is a test task",
        status: "pending",
      }),
      submitTaskIdea({
        title: "Test Task 2",
        description: "This is a test task 2",
        status: "pending",
      }),
      submitTaskIdea({
        title: "Test Task 3",
        description: "This is a test task 3",
        status: "pending",
      }),
    ]);
  } catch (error) {}

  try {
    await releaseTask();
  } catch (error) {
    console.error("Error releasing task:", error);
  }

  return NextResponse.json({
    success: true,
    message: `Successfully run daily cron job`,
    source: "cron",
  });
}

const releaseTask = async () => {
  // TODO: Implement task release logic
};
