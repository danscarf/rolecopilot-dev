// app/_components/timer/TimerReport.tsx
'use client';

import React from 'react';
import { useTimer } from '../../_providers/TimerProvider';

export function TimerReport() {
  const { loggedTimes } = useTimer();

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Group logged times by type
  const groupedTimes = loggedTimes.reduce((acc, session) => {
    const groupKey = session.presetName;

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
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
                className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                    {session.speakerName || 'Unnamed'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Target: {session.timeRequirement}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-gray-100">{formatTime(session.duration)}</p>
                  <p className={`text-xs font-medium ${session.isWithinTime ? 'text-green-600' : 'text-red-600'}`}>
                    {session.isWithinTime ? '✓ OK' : '✗ Off'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
