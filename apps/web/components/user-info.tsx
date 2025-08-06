'use client';

import { useUser, useUserData } from '@providers/user-provider';
import { useUserAnalytics } from '@hooks/use-user-analytics';

export function UserInfo() {
  const { user } = useUserData();
  const { trackClick } = useUserAnalytics();

  // Note: user is now guaranteed to be non-null due to UserProvider implementation

  const handleUserInfoClick = () => {
    trackClick('user_info_toggle');
  };

  return (
    <div 
      className="text-sm text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
      onClick={handleUserInfoClick}
      title={`User ID: ${user.id}\nVisit #${user.visitCount}\nLast active: ${user.lastActiveAt.toLocaleString()}`}
    >
      Visit #{user.visitCount}
    </div>
  );
}

export function UserDebugPanel() {
  const { user, updatePreferences, refreshUser } = useUser();
  const { trackEvent } = useUserAnalytics();

  // Note: user is now guaranteed to be non-null due to UserProvider implementation

  const handleTestEvent = () => {
    trackEvent('custom', { test: 'debug_panel_test', timestamp: new Date().toISOString() });
  };

  const handleUpdatePreference = () => {
    updatePreferences({ 
      debugMode: !user.preferences?.debugMode,
      lastDebugToggle: new Date().toISOString()
    });
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
      <h3 className="font-semibold text-gray-800">User Debug Panel</h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <strong>User ID:</strong>
          <div className="font-mono text-xs break-all">{user.id}</div>
        </div>
        
        <div>
          <strong>Session ID:</strong>
          <div className="font-mono text-xs break-all">{user.sessionId}</div>
        </div>
        
        <div>
          <strong>Visit Count:</strong>
          <div>{user.visitCount}</div>
        </div>
        
        <div>
          <strong>Created:</strong>
          <div>{user.createdAt.toLocaleDateString()}</div>
        </div>
        
        <div>
          <strong>Last Active:</strong>
          <div>{user.lastActiveAt.toLocaleTimeString()}</div>
        </div>
        
        <div>
          <strong>Debug Mode:</strong>
          <div>{user.preferences?.debugMode ? 'On' : 'Off'}</div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleTestEvent}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
        >
          Test Event
        </button>
        
        <button
          onClick={handleUpdatePreference}
          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
        >
          Toggle Debug
        </button>
        
        <button
          onClick={refreshUser}
          className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
        >
          Refresh User
        </button>
      </div>

      {user.preferences && Object.keys(user.preferences).length > 0 && (
        <div>
          <strong className="text-sm">Preferences:</strong>
          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
            {JSON.stringify(user.preferences, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}