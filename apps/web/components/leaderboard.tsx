import { getLeaderboard, getUserCompletions } from '@lib/user-prefs';
import { LeaderboardEntryComponent } from './leaderboard-entry';
import { LeaderboardRefreshButton } from './leaderboard-refresh-button';
import { formatCompletionTime, formatTimeAgo, getRankBadge } from './leaderboard-utils';
import { ScoringExplanation } from './scoring-explanation';
import { TopPerformersCard } from './top-performers-card';
import { UserCompletionsCard } from './user-completions-card';
import { UserStatsCard } from './user-stats-card';

interface LeaderboardProps {
  currentUserId?: string;
}

export async function Leaderboard({ currentUserId }: LeaderboardProps) {
  const leaderboard = await getLeaderboard(1_000);
  const userCompletions = currentUserId ? await getUserCompletions(currentUserId) : [];

  const currentUserEntry = currentUserId
    ? leaderboard.find(entry => entry.userId === currentUserId)
    : null;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-gray-600 mt-2">
            Complete tasks quickly to earn more points with our reverse exponential scoring system
          </p>
        </div>
        <LeaderboardRefreshButton />
      </div>

      <ScoringExplanation />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">Global Rankings</h2>
            </div>
            <div className="divide-y">
              {leaderboard.map((entry) => (
                <LeaderboardEntryComponent
                  key={entry.userId}
                  entry={entry}
                  currentUserId={currentUserId}
                  formatTimeAgo={formatTimeAgo}
                  getRankBadge={getRankBadge}
                />
              ))}

              {leaderboard.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <div className="text-lg font-medium mb-2">No one on the leaderboard yet!</div>
                  <div>Be the first to complete a task and claim the top spot.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Stats & Recent Completions */}
        <div className="space-y-6">
          {/* Current User Stats */}
          {currentUserEntry && (
            <UserStatsCard
              userEntry={currentUserEntry}
              getRankBadge={getRankBadge}
            />
          )}

          {/* Recent Completions */}
          <UserCompletionsCard
            completions={userCompletions}
            formatCompletionTime={formatCompletionTime}
            formatTimeAgo={formatTimeAgo}
          />

          {/* Top Performers Preview */}
          <TopPerformersCard
            leaderboard={leaderboard}
            getRankBadge={getRankBadge}
          />
        </div>
      </div>
    </div>
  );
}