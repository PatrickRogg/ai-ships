'use client';

import { useUserData } from '@providers/user-provider';

export function UserPageClient() {
  const { user } = useUserData();

  // Note: user is now guaranteed to be non-null due to UserProvider implementation
  // The provider shows an empty page during loading

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getVisitFrequency = () => {
    const daysSinceCreated = Math.floor(
      (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceCreated === 0) return 'First visit today';
    if (daysSinceCreated === 1) return 'Visiting since yesterday';

    const visitsPerDay = user.visitCount / Math.max(daysSinceCreated, 1);
    if (visitsPerDay >= 1) {
      return `${visitsPerDay.toFixed(1)} visits per day`;
    } else {
      const daysPerVisit = Math.ceil(daysSinceCreated / user.visitCount);
      return `About 1 visit every ${daysPerVisit} days`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Profile</h1>
        <p className="text-gray-600">
          Track your activity and engagement with AI Ships
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visit Statistics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
            Visit Statistics
          </h2>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">Total Visits</div>
              <div className="text-2xl font-bold text-gray-900">{user.visitCount}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Visit Frequency</div>
              <div className="text-lg text-gray-700">{getVisitFrequency()}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">First Visit</div>
              <div className="text-lg text-gray-700">{formatDate(user.createdAt)}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Last Active</div>
              <div className="text-lg text-gray-700">{formatDate(user.lastActiveAt)}</div>
            </div>
          </div>
        </div>

        {/* Session Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
            Current Session
          </h2>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">User ID</div>
              <div className="text-sm font-mono bg-gray-50 p-2 rounded border break-all">
                {user.id}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Session ID</div>
              <div className="text-sm font-mono bg-gray-50 p-2 rounded border break-all">
                {user.sessionId}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        {user.preferences && Object.keys(user.preferences).length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
              Your Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(user.preferences).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-gray-700 font-medium">
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                      typeof value === 'object' ? JSON.stringify(value) :
                        String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Information */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 md:col-span-2">
          <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
            Privacy & Data
          </h2>

          <div className="text-blue-700 space-y-2">
            <p>
              Your user ID is generated locally in your browser and is not tied to any personal information.
            </p>
            <p>
              We track your visits and interactions to improve your experience with AI Ships.
            </p>
            <p>
              All data is stored locally in your browser and can be cleared by clearing your browser data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}