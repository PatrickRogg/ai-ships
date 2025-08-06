'use client';

import { useUser } from "@providers/user-provider";
import { useEffect, useState } from "react";
import { getTaskCompletionStats, getUserTaskCompletion } from "@lib/user-prefs";
import { Badge } from "@repo/ui/components/badge";

interface TaskStatsProps {
  taskId: string;
}

export function TaskStats({ taskId }: TaskStatsProps) {
  const { user } = useUser();
  const [totalCompletions, setTotalCompletions] = useState<number | null>(null);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        // Get total completions
        const stats = await getTaskCompletionStats(taskId);
        setTotalCompletions(stats.totalCompletions);

        // Get user completion if user exists
        if (user?.id) {
          const completion = await getUserTaskCompletion(user.id, taskId);
          setUserPoints(completion?.points || null);
        }
      } catch (error) {
        console.error('Error loading task stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [taskId, user?.id]);

  if (loading) {
    return <div className="text-md text-gray-400">Loading...</div>;
  }

  return (
    <div className="text-md text-gray-500 text-right">
      <div>{totalCompletions} submissions</div>
      {user && (
        <div>
          {userPoints !== null ? (
            <Badge className="text-green-600 bg-green-100 border-green-200">Completed: {userPoints} pts</Badge>
          ) : (
            <Badge className="text-gray-600 bg-gray-100 border-gray-200">Not completed</Badge>
          )}
        </div>
      )}
    </div>
  );
}