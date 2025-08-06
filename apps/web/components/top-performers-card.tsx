import { LeaderboardEntry } from '@type/leaderboard';

interface TopPerformersCardProps {
  leaderboard: LeaderboardEntry[];
  getRankBadge: (rank: number) => string;
}

export function TopPerformersCard({ leaderboard, getRankBadge }: TopPerformersCardProps) {
  if (leaderboard.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
      <div className="space-y-3">
        {leaderboard.slice(0, 3).map((entry) => (
          <div key={entry.userId} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getRankBadge(entry.rank)}</span>
              <span className="font-medium text-sm">
                User {entry.userId.slice(-8)}
              </span>
            </div>
            <span className="font-bold text-sm">
              {entry.totalPoints.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}