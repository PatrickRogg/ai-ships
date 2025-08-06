import { getLatestTaskId } from "@lib/task-prefs";
import { redirect } from "next/navigation";

export default async function Home() {
  const latestTaskId = await getLatestTaskId();

  if (latestTaskId) {
    redirect(`/tasks/${latestTaskId}`);
  }

  // If no task yet, show welcome page
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <h1 className="text-5xl font-bold text-gray-800">Welcome to AI Ships 🚀</h1>
      <p className="text-gray-600 max-w-xl text-center">
        AI will build a new interactive web task every hour.
        Once the first task is ready, you'll be redirected here automatically.
      </p>
    </div>

  );
}