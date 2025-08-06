import { NextResponse } from "next/server";
import { trackVisitor } from "@lib/user-prefs";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    await trackVisitor(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/visitor:", error);
    return NextResponse.json({ success: false, error: "Failed to track visitor" }, { status: 500 });
  }
}
