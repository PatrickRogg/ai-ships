import { UserCompletion } from '@type/leaderboard';

interface UserCompletionsCardProps {
  completions: UserCompletion[];
  formatCompletionTime: (completionTime: number) => string;
  formatTimeAgo: (dateString: string) => string;
}

export function UserCompletionsCard({ 
  completions, 
  formatCompletionTime, 
  formatTimeAgo 
}: UserCompletionsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Your Recent Completions</h3>
      <div className="space-y-3">
        {completions.slice(0, 5).map((completion) => (
          <div key={completion.id} className="border rounded-lg p-3">
            <div className="font-medium text-sm mb-1">Task {completion.taskId.slice(-8)}</div>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Completed in {formatCompletionTime(completion.completionTime)}</span>
              <span className="font-bold text-gray-900">{completion.points} pts</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {formatTimeAgo(completion.completedAt)}
            </div>
          </div>
        ))}
        
        {completions.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            <div className="text-sm">No completions yet</div>
            <div className="text-xs">Complete your first task to see it here!</div>
          </div>
        )}
      </div>
    </div>
  );
}