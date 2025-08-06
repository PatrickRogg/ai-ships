import { TaskStats } from "@components/task-stats";
import { trackTaskVisit } from "@lib/task-prefs";
import { getTaskById } from "@tasks/task-list";
import { notFound } from "next/navigation";

export default async function TaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = getTaskById(taskId);

  if (!task) {
    notFound();
  }

  // Track visit
  await trackTaskVisit(task.id);

  return (
    <>
      <div className="w-full mx-auto p-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{task.name}</h1>
              <p className="text-xl text-gray-600 mb-4">{task.description}</p>
              <div className="text text-gray-500">
                Created: {new Date(task.createdAt).toISOString().slice(0, 19).replace('T', ' ')}
              </div>
            </div>
            <div>
              <TaskStats taskId={task.id} />
            </div>
          </div>
        </header>

        <main className="max-w-none">
          <task.component />
        </main>
      </div>
    </>
  );
}