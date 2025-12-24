// app/_components/timer/TimerControls.tsx
'use client';

import React from 'react';
import { useTimer } from '../../_providers/TimerProvider';

export function TimerControls() {
  const { isRunning, startTimer, stopTimer, resetTimer, selectedPreset } = useTimer();

  return (
    <div className="flex justify-center space-x-4 p-4">
      <button
        onClick={startTimer}
        disabled={isRunning || !selectedPreset}
        className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Start
      </button>
      <button
        onClick={stopTimer}
        disabled={!isRunning}
        className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white text-xl font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Stop
      </button>
      <button
        onClick={resetTimer}
        disabled={isRunning}
        className="px-6 py-4 bg-gray-500 hover:bg-gray-600 text-white text-xl font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Reset
      </button>
    </div>
  );
}
