import { NextRequest, NextResponse } from "next/server";
import { verifyCronAuth } from "@lib/cron-auth";
import { deleteOldTaskIdeas } from "@lib/task-prefs";

export async function POST(request: NextRequest) {
  // Verify cron authentication
  const authError = verifyCronAuth(request);
  if (authError) {
    return authError;
  }

  try {
    console.log("Starting cleanup of old task ideas...");
    
    // Delete ideas older than 1 day
    const result = await deleteOldTaskIdeas(1);
    
    console.log(`Deleted ${result.deletedCount} old task ideas:`, result.deletedIds);
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} old task ideas`,
      deletedCount: result.deletedCount,
      deletedIds: result.deletedIds,
      source: "cron"
    });
  } catch (error) {
    console.error("Error deleting old task ideas:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete old task ideas",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

export const runtime = "edge";