import { LeaderboardEntry } from '@type/leaderboard';

interface LeaderboardEntryProps {
  entry: LeaderboardEntry;
  currentUserId?: string;
  formatTimeAgo: (dateString: string) => string;
  getRankBadge: (rank: number) => string;
}

export function LeaderboardEntryComponent({
  entry,
  currentUserId,
  formatTimeAgo,
  getRankBadge
}: LeaderboardEntryProps) {
  const isCurrentUser = entry.userId === currentUserId;

  return (
    <div
      className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${isCurrentUser ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
        }`}
    >
      <div className="flex items-center space-x-4">
        <div className="text-2xl font-bold text-gray-400 w-8">
          {getRankBadge(entry.rank)}
        </div>
        <div>
          <div className="font-medium">
            User {entry.userId.slice(-8)}
            {isCurrentUser && (
              <span className="text-blue-600 text-sm ml-2">(You)</span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {entry.completedTasks} tasks completed • Last active {formatTimeAgo(entry.lastActive)}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-gray-900">
          {entry.totalPoints.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">points</div>
      </div>
    </div>
  );
}