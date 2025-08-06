import { getTaskIdeas } from "@lib/task-prefs";
import { VotePageClient } from "@components/vote-page-client";

export const dynamic = "force-dynamic";

export default async function VotePage() {
  const taskIdeas = await getTaskIdeas();

  return <VotePageClient initialTaskIdeas={taskIdeas} />;
}