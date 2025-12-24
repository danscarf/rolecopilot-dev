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
    // Need to get the type from the preset used for the session
    // For now, we'll assume the presetName directly corresponds to a type for grouping,
    // or we might need to enhance TimerSession to store type directly.
    // For simplicity, let's group by presetName and later refine if needed.
    const groupKey = session.presetName; // Using presetName as groupKey for now

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(session);
    return acc;
  }, {} as Record<string, typeof loggedTimes>);

  if (loggedTimes.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No timer sessions logged yet.
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg space-y-6">
      <h2 className="text-xl font-semibold text-black dark:text-white mb-4">Timer's Report</h2>

      {Object.entries(groupedTimes).map(([groupName, sessions]) => (
        <div key={groupName} className="space-y-2">
          <h3 className="text-lg font-medium text-black dark:text-white border-b border-gray-200 dark:border-gray-700 pb-1">
            {groupName}
          </h3>
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {sessions.map((session) => (
              <li key={session.id} className="py-2 flex justify-between items-center text-black dark:text-white">
                <div>
                  <p className="font-medium">{session.speakerName || 'Unnamed Speaker'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Required: {session.timeRequirement}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatTime(session.duration)}</p>
                  <p className={`text-sm ${session.isWithinTime ? 'text-green-600' : 'text-red-600'}`}>
                    {session.isWithinTime ? 'Within Time' : <>Over/Under</>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
