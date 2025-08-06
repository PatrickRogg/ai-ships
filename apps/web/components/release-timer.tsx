'use client';

import { useState, useEffect } from 'react';

interface ReleaseTimerProps {
  className?: string;
  compact?: boolean;
}

export function ReleaseTimer({ className = '', compact = false }: ReleaseTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      
      // Calculate time until next hour (releases every hour)
      const minutesLeft = 59 - now.getMinutes();
      const secondsLeft = 59 - now.getSeconds();

      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: minutesLeft,
        seconds: secondsLeft,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }

  if (compact) {
    return (
      <div className={`flex items-center space-x-1 text-sm ${className}`}>
        <span className="text-gray-500">Next release:</span>
        <span className="text-blue-600 font-mono">
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="text-sm text-gray-500 mb-1">Next Release</div>
      <div className="flex items-center justify-center space-x-2 text-sm font-mono">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-blue-600">{timeLeft.days}</span>
          <span className="text-xs text-gray-500">days</span>
        </div>
        <span className="text-gray-400">:</span>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-blue-600">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-xs text-gray-500">hrs</span>
        </div>
        <span className="text-gray-400">:</span>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-blue-600">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-xs text-gray-500">min</span>
        </div>
        <span className="text-gray-400">:</span>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-blue-600">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-xs text-gray-500">sec</span>
        </div>
      </div>
    </div>
  );
}