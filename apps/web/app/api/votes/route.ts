import { NextResponse } from "next/server";
import { getTaskIdeas, voteForTaskIdea, submitTaskIdea } from "@lib/task-prefs";

export async function GET() {
  try {
    const taskIdeas = await getTaskIdeas();
    return NextResponse.json({ taskIdeas });
  } catch (error) {
    console.error("Error in GET /api/votes:", error);
    return NextResponse.json(
      { error: "Failed to load task ideas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { ideaId, userId } = await request.json();
  if (!ideaId) {
    return NextResponse.json({ error: "ideaId is required" }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json(
      { error: "userId is required for voting" },
      { status: 400 }
    );
  }

  const result = await voteForTaskIdea(ideaId, userId);

  if (!result.success) {
    if (result.reason === "already_voted") {
      return NextResponse.json(
        {
          error: "You have already voted for this task idea",
        },
        { status: 409 }
      );
    }
    if (result.reason === "idea_not_found") {
      return NextResponse.json(
        {
          error: "Task idea not found",
        },
        { status: 404 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
