'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { useUserData } from '@providers/user-provider';

interface TaskIdeaItem {
  id: string;
  title: string;
  description?: string;
  votes: number;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  submittedBy?: string;
}

interface VotePageClientProps {
  initialTaskIdeas: TaskIdeaItem[];
}

export function VotePageClient({ initialTaskIdeas }: VotePageClientProps) {
  const { user } = useUserData();
  const [taskIdeas, setTaskIdeas] = useState<TaskIdeaItem[]>(initialTaskIdeas);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const loadTaskIdeas = async () => {
    try {
      const res = await fetch('/api/votes');
      if (!res.ok) throw new Error('Failed to load task ideas');
      const { taskIdeas } = await res.json();
      setTaskIdeas(taskIdeas);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVote = async (id: string) => {
    try {
      await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'vote', ideaId: id, userId: user.id }),
      });
      await loadTaskIdeas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddIdea = async () => {
    if (!newTitle.trim()) return;

    try {
      await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', title: newTitle, description: newDescription }),
      });
      setNewTitle('');
      setNewDescription('');
      await loadTaskIdeas();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Vote on Next Task Ideas</h1>
      <p className="text-gray-600">
        Suggest and vote on ideas for new interactive tasks. The AI will consider these when building new content.
      </p>

      {/* Add New Idea */}
      <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold">Suggest a New Task Idea</h2>
        <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Task idea title" />
        <Input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Short description (optional)"
        />
        <Button onClick={handleAddIdea} disabled={!newTitle.trim()}>
          Submit Idea
        </Button>
      </div>

      {/* Task Ideas List */}
      <div className="space-y-4">
        {taskIdeas.map((idea) => (
          <div
            key={idea.id}
            className="flex items-start justify-between p-4 border rounded-lg bg-white shadow-sm"
          >
            <div>
              <div className="text-lg font-medium">{idea.title}</div>
              {idea.description && <div className="text-sm text-gray-600 mt-1">{idea.description}</div>}
              <div className="text-xs text-gray-400 mt-2">
                Status: <span className="font-medium">{idea.status}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-gray-800 font-semibold">{idea.votes}</div>
                <div className="text-xs text-gray-500">votes</div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleVote(idea.id)}>
                Vote
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}