import { LeaderboardEntry } from '@type/leaderboard';

interface UserStatsCardProps {
  userEntry: LeaderboardEntry;
  getRankBadge: (rank: number) => string;
}

export function UserStatsCard({ userEntry, getRankBadge }: UserStatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Rank</span>
          <span className="font-bold">{getRankBadge(userEntry.rank)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Total Points</span>
          <span className="font-bold">{userEntry.totalPoints.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tasks Completed</span>
          <span className="font-bold">{userEntry.completedTasks}</span>
        </div>
      </div>
    </div>
  );
}