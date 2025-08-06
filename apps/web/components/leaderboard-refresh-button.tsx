'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/components/button';
import { useRouter } from 'next/navigation';

export function LeaderboardRefreshButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setLoading(true);
    try {
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleRefresh} 
      disabled={loading}
      variant="outline"
    >
      {loading ? 'Refreshing...' : 'Refresh'}
    </Button>
  );
}