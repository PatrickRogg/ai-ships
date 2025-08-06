import { NextResponse } from "next/server";
import { getLeaderboard } from "@lib/user-prefs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const leaderboard = await getLeaderboard(limit);
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Error in GET /api/leaderboard:", error);
    return NextResponse.json({ error: "Failed to load leaderboard" }, { status: 500 });
  }
}

export const runtime = "edge";