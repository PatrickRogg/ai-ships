import {
  canUserSubmitTask,
  getTimeUntilNextSubmission,
  submitTaskIdea,
} from "@lib/task-prefs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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
