// app/_components/timer/LogEntry.tsx
'use client';

import React, { useState } from 'react';
import { useTimer } from '../../_providers/TimerProvider';

export function LogEntry() {
  const { loggedTimes, logTime, isRunning, selectedPreset } = useTimer();
  const [speakerName, setSpeakerName] = useState<string>('');

  const handleLog = () => {
    logTime(speakerName || null);
    setSpeakerName(''); // Clear input after logging
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Log Timer Session</h3>

      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Speaker Name (optional)"
          value={speakerName}
          onChange={(e) => setSpeakerName(e.target.value)}
          disabled={isRunning || !selectedPreset}
          className="flex-grow rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm sm:text-sm p-2 border"
        />
        <button
          onClick={handleLog}
          disabled={isRunning || !selectedPreset}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Log Time
        </button>
      </div>

      {loggedTimes.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-medium text-black dark:text-white mb-2">Logged Sessions:</h4>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {loggedTimes.map((session) => (
              <li key={session.id} className="py-2 flex justify-between items-center text-black dark:text-white">
                <div>
                  <p className="font-semibold">{session.speakerName || 'Unnamed Speaker'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{session.presetName} ({session.timeRequirement})</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatTime(session.duration)}</p>
                  <p className={`text-sm ${session.isWithinTime ? 'text-green-600' : 'text-red-600'}`}>
                    {session.isWithinTime ? 'Within Time' : 'Over/Under Time'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
