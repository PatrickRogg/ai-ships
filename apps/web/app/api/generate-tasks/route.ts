import { generateTaskIdeas, getFormattedTaskIdeas } from "@lib/ai-task-generator";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get("format") || "raw";
    
    if (format === "formatted") {
      // Get formatted task ideas ready for submission
      const formattedIdeas = await getFormattedTaskIdeas();
      
      return NextResponse.json({
        success: true,
        data: formattedIdeas,
        count: formattedIdeas.length,
        format: "formatted",
      });
    } else {
      // Get raw AI task generation output
      const rawIdeas = await generateTaskIdeas();
      
      return NextResponse.json({
        success: true,
        data: rawIdeas,
        count: rawIdeas.tasks.length,
        format: "raw",
      });
    }
  } catch (error) {
    console.error("Error generating tasks:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trend, inspiration } = body;
    
    if (!trend) {
      return NextResponse.json(
        { success: false, error: "Trend parameter is required" },
        { status: 400 }
      );
    }
    
    // Generate a focused task idea for a specific trend
    const { generateFocusedTaskIdea } = await import("@lib/ai-task-generator");
    const taskIdea = await generateFocusedTaskIdea(trend, inspiration);
    
    return NextResponse.json({
      success: true,
      data: taskIdea,
      trend,
      inspiration,
    });
  } catch (error) {
    console.error("Error generating focused task:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}