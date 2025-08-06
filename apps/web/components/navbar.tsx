'use client';

import { ReleaseTimer } from '@components/release-timer';
import { UserInfo } from '@components/user-info';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [stats, setStats] = useState({ currentlyOnline: 0, totalVisitors: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Load visitor stats and task history
    const loadData = async () => {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) throw new Error('Failed to fetch');
        const { visitorStats, taskHistory, latestTask } = await res.json();
        setStats({
          currentlyOnline: visitorStats.currentlyOnline,
          totalVisitors: visitorStats.totalVisitors,
        });
      } catch (error) {
        console.error('Error loading navbar data:', error);
      }
    };

    loadData();

    // Update stats every 10 seconds
    const interval = setInterval(loadData, 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🚀</span>
              </div>
              <span className="font-bold text-xl text-gray-900">AI Ships</span>
            </Link>
          </div>

          {/* Right side - Stats and Menu */}
          <div className="flex items-center space-x-4">
            {/* Visitor Stats, Release Timer and User Info */}
            <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>{stats.currentlyOnline} online</span>
              </div>
              <div className="text-gray-400">|</div>
              <div>{stats.totalVisitors.toLocaleString()} visitors</div>
              <div className="text-gray-400">|</div>
              <ReleaseTimer compact={true} />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/tasks">
                <Button variant="outline" size="sm">
                  📋 All Tasks
                </Button>
              </Link>
              <Link href="/leaderboard">
                <Button variant="outline" size="sm">
                  🏆 Leaderboard
                </Button>
              </Link>
              <Link href="/vote">
                <Button variant="outline" size="sm">
                  🗳️ Vote on Ideas
                </Button>
              </Link>
              <Link href="/user">
                <Button variant="outline" size="sm">
                  👤 User
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="sm">
                  ℹ️ About
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              {/* Mobile stats */}
              <div className="space-y-2 text-sm text-gray-600 px-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>{stats.currentlyOnline} online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>{stats.totalVisitors.toLocaleString()} visitors</span>
                    <span>•</span>
                    <UserInfo />
                  </div>
                </div>
                <div className="flex justify-center">
                  <ReleaseTimer compact={true} />
                </div>
              </div>

              {/* Navigation links */}
              <div className="border-t pt-3 space-y-2">
                <Link href="/leaderboard" className="block px-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    🏆 Leaderboard
                  </Button>
                </Link>
                <Link href="/vote" className="block px-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    🗳️ Vote on Ideas
                  </Button>
                </Link>
                <Link href="/tasks" className="block px-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    📋 All Tasks
                  </Button>
                </Link>
                <Link href="/user" className="block px-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    👤 User
                  </Button>
                </Link>
                <Link href="/about" className="block px-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    ℹ️ About
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}