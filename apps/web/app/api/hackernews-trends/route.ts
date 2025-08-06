import { 
  getProjectInspiration, 
  getTrendingTechnologies,
  getTopStories,
  generateProjectIdeas 
} from "@lib/hackernews";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "inspiration";
    const limit = parseInt(url.searchParams.get("limit") || "10");
    
    switch (type) {
      case "inspiration": {
        const inspiration = await getProjectInspiration(limit);
        return NextResponse.json({
          success: true,
          data: inspiration,
          count: inspiration.length,
          type: "inspiration",
        });
      }
      
      case "trending": {
        const trending = await getTrendingTechnologies();
        return NextResponse.json({
          success: true,
          data: trending.slice(0, limit),
          count: trending.length,
          type: "trending",
        });
      }
      
      case "stories": {
        const stories = await getTopStories(limit);
        return NextResponse.json({
          success: true,
          data: stories,
          count: stories.length,
          type: "stories",
        });
      }
      
      case "project-ideas": {
        const ideas = await generateProjectIdeas();
        return NextResponse.json({
          success: true,
          data: ideas.slice(0, limit),
          count: ideas.length,
          type: "project-ideas",
        });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: "Invalid type parameter. Use: inspiration, trending, stories, or project-ideas" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error fetching HackerNews data:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}