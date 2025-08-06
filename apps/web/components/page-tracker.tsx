'use client';

import { usePageTracking, useTimeTracking } from '@hooks/use-user-analytics';
import { useEffect } from 'react';

/**
 * Component that automatically tracks page views and time spent.
 * Should be included in layouts or pages where you want automatic tracking.
 */
export function PageTracker() {

  useEffect(() => {
    usePageTracking();
    useTimeTracking();
  }, []);


  return null;
}