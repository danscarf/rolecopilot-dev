// app/_components/timer/TimerReport.tsx
'use client';

import React from 'react';
import { useTimer } from '../../_providers/TimerProvider';

export function TimerReport() {
  const { loggedTimes, removeLoggedTime, clearLoggedTimes } = useTimer();

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const groupedTimes = loggedTimes.reduce((acc, session) => {
    const groupKey = session.presetName;
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(session);
    return acc;
  }, {} as Record<string, typeof loggedTimes>);

  if (loggedTimes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">📭</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No sessions logged yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedTimes).map(([groupName, sessions]) => (
        <div key={groupName} className="space-y-2">
          <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
            {groupName}
          </h3>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex justify-between items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                    {session.speakerName || 'Unnamed'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Target: {session.timeRequirement}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900 dark:text-gray-100">{formatTime(session.duration)}</p>
                  <p className={`text-xs font-medium ${session.isWithinTime ? 'text-green-600' : 'text-red-600'}`}>
                    {session.isWithinTime ? '✓ OK' : '✗ Off'}
                  </p>
                </div>
                <button
                  onClick={() => removeLoggedTime(session.id)}
                  aria-label={`Delete entry for ${session.speakerName || 'Unnamed'}`}
                  className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={clearLoggedTimes}
        className="w-full mt-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
}
