import Link from "next/link";
import { getAllTasks } from "@tasks/task-list";

export const dynamic = "force-static";

export default async function TasksPage() {
  const tasks = getAllTasks();

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">No Tasks Yet</h1>
        <p className="text-gray-600">Our AI is preparing the first task. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">All Tasks</h1>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="p-4 border rounded-lg bg-white shadow-sm">
            <Link href={`/tasks/${task.id}`}>
              <div className="text-lg font-medium text-blue-700 hover:underline">
                {task.name}
              </div>
            </Link>
            {task.description && (
              <div className="text-sm text-gray-600 mt-1">{task.description}</div>
            )}
            <div className="text-xs text-gray-400 mt-1">Created: {new Date(task.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}