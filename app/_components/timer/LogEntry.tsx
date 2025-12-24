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
    <div className="mt-4 space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Speaker Name (optional)"
          value={speakerName}
          onChange={(e) => setSpeakerName(e.target.value)}
          disabled={isRunning || !selectedPreset}
          className="flex-grow rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 disabled:opacity-50"
        />
        <button
          onClick={handleLog}
          disabled={isRunning || !selectedPreset}
          className="px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 gradient-success focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          Log
        </button>
      </div>

      {loggedTimes.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            Recent Sessions
          </h4>
          <div className="space-y-2">
            {loggedTimes.slice(-5).reverse().map((session) => (
              <div 
                key={session.id} 
                className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 border border-blue-100 dark:border-gray-600"
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {session.speakerName || 'Unnamed'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {session.presetName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-gray-100">{formatTime(session.duration)}</p>
                  <p className={`text-xs font-medium ${session.isWithinTime ? 'text-green-600' : 'text-red-600'}`}>
                    {session.isWithinTime ? '✓ On Time' : '✗ Off Time'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
