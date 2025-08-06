import { verifyCronAuth } from "@lib/cron-auth";
import { deleteOldTaskIdeas, submitTaskIdea } from "@lib/task-prefs";
import { getFormattedTaskIdeas } from "@lib/ai-task-generator";
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
    // Generate and submit AI-powered task ideas based on current trends
    await findAndSubmitTaskIdeas();
  } catch (error) {
    console.error("Error generating and submitting task ideas:", error);
  }

  return NextResponse.json({
    success: true,
    message: `Successfully run daily cron job`,
    source: "cron",
  });
}

const findAndSubmitTaskIdeas = async () => {
  try {
    console.log("Generating AI-powered task ideas based on HackerNews trends...");
    
    // Get AI-generated task ideas based on current trends
    const taskIdeas = await getFormattedTaskIdeas();
    
    console.log(`Generated ${taskIdeas.length} task ideas`);
    
    // Submit each task idea
    const submissions = taskIdeas.map(idea => 
      submitTaskIdea({
        title: idea.title,
        description: idea.description,
        status: idea.status,
      })
    );
    
    const results = await Promise.all(submissions);
    
    console.log(`Successfully submitted ${results.length} task ideas:`, 
      taskIdeas.map(idea => idea.title)
    );
    
    return results;
  } catch (error) {
    console.error("Error in findAndSubmitTaskIdeas:", error);
    throw error;
  }
};