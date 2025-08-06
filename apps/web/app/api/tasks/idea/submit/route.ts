import {
  submitTaskIdea,
  canUserSubmitTask,
  getTimeUntilNextSubmission,
} from "@lib/task-prefs";
import { NextRequest, NextResponse } from "next/server";
import { verifyCronAuth } from "@lib/cron-auth";

export async function POST(request: NextRequest) {
  // Check if this is a cron job request
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const isCronRequest = cronSecret && authHeader && authHeader === `Bearer ${cronSecret}`;

  // If it's a cron request, verify authentication
  if (isCronRequest) {
    const authError = verifyCronAuth(request);
    if (authError) {
      return authError;
    }
    // TODO: Implement cron-specific logic for automated task submissions
    return NextResponse.json({ success: true, source: "cron" });
  }

  // Handle regular user submissions
  try {
    const { title, description, userId } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Check rate limit if userId is provided
    if (userId) {
      const canSubmit = await canUserSubmitTask(userId);
      if (!canSubmit) {
        const timeRemaining = await getTimeUntilNextSubmission(userId);
        const minutesRemaining = Math.ceil(timeRemaining / (1000 * 60));
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            message: `You can only submit one task per hour. Please wait ${minutesRemaining} minutes before submitting again.`,
            timeRemaining: timeRemaining,
          },
          { status: 429 }
        );
      }

      const id = await submitTaskIdea(
        { title, description, status: "pending" },
        userId
      );

      return NextResponse.json({ success: true, id });
    }

    return NextResponse.json({ success: false, error: "User ID is required" });
  } catch (error) {
    console.error("Error in POST /api/tasks/submit-idea:", error);
    return NextResponse.json(
      { error: "Failed to submit task idea" },
      { status: 500 }
    );
  }
}
