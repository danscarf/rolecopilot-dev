// app/_components/timer/PresetSelector.tsx
'use client';

import React from 'react';
import { useTimer } from '../../_providers/TimerProvider';
import { predefinedPresets } from '../../_lib/presets';

export function PresetSelector() {
  const { selectedPreset, selectPreset, isRunning } = useTimer();

  return (
    <div className="flex flex-wrap justify-center gap-2 p-4">
      {predefinedPresets.map((preset) => (
        <button
          key={preset.name}
          onClick={() => selectPreset(preset)}
          disabled={isRunning}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
            ${selectedPreset?.name === preset.name
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
            }
            ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
}
