import { Leaderboard } from "@components/leaderboard";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  // TODO: Get current user ID from session/auth
  const currentUserId = undefined; // Replace with actual user ID from auth

  return <Leaderboard currentUserId={currentUserId} />;
}