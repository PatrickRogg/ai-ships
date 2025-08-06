"use client";

import { useUser } from "@providers/user-provider";
import { UserEvent } from "@type/user";
import { useCallback, useEffect } from "react";

export function useUserAnalytics() {
  const { user } = useUser();

  // Track custom events
  const trackEvent = useCallback(
    (type: UserEvent["type"], data?: Record<string, any>) => {
      if (!user) return;

      const event: UserEvent = {
        type,
        timestamp: new Date(),
        data,
      };

      // Send to analytics endpoint
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          sessionId: user.sessionId,
          event,
        }),
      }).catch((error) => {
        console.error("Failed to track event:", error);
      });
    },
    [user]
  );

  // Track page views automatically
  const trackPageView = useCallback(
    (path?: string) => {
      trackEvent("page_view", {
        path: path || window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      });
    },
    [trackEvent]
  );

  // Track time spent on page
  const trackTimeSpent = useCallback(
    (timeInSeconds: number) => {
      trackEvent("time_spent", {
        duration: timeInSeconds,
        path: window.location.pathname,
      });
    },
    [trackEvent]
  );

  // Track user interactions
  const trackClick = useCallback(
    (element: string, data?: Record<string, any>) => {
      trackEvent("click", {
        element,
        path: window.location.pathname,
        ...data,
      });
    },
    [trackEvent]
  );

  // Track scroll depth
  const trackScroll = useCallback(
    (depth: number) => {
      trackEvent("scroll", {
        depth,
        path: window.location.pathname,
      });
    },
    [trackEvent]
  );

  return {
    user,
    trackEvent,
    trackPageView,
    trackTimeSpent,
    trackClick,
    trackScroll,
  };
}

// Hook for tracking page views automatically
export function usePageTracking() {
  const { trackPageView } = useUserAnalytics();

  useEffect(() => {
    // Track initial page view
    trackPageView();

    // Track page views on route changes (for Next.js App Router)
    const handleRouteChange = () => {
      setTimeout(() => trackPageView(), 100); // Small delay to ensure navigation completed
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [trackPageView]);
}

// Hook for tracking time spent on page
export function useTimeTracking() {
  const { trackTimeSpent } = useUserAnalytics();

  useEffect(() => {
    const startTime = Date.now();

    const trackTime = () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      trackTimeSpent(timeSpent);
    };

    // Track time when user leaves the page
    const handleBeforeUnload = () => {
      trackTime();
    };

    // Track time when page becomes hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackTime();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      trackTime(); // Track time when component unmounts
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [trackTimeSpent]);
}
