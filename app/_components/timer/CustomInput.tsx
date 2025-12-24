// app/_components/timer/CustomInput.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTimer } from '../../_providers/TimerProvider';

export function CustomInput() {
  const { selectedPreset, selectPreset, isRunning } = useTimer();
  const [green, setGreen] = useState(0);
  const [yellow, setYellow] = useState(0);
  const [red, setRed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPreset?.type === 'Custom') {
      setGreen(selectedPreset.greenTime);
      setYellow(selectedPreset.yellowTime);
      setRed(selectedPreset.redTime);
    }
  }, [selectedPreset]);

  const handleSaveCustom = () => {
    setError(null);
    if (green <= 0 || yellow <= 0 || red <= 0) {
      setError("All times must be greater than 0.");
      return;
    }
    if (green >= yellow) {
      setError("Green time must be less than yellow time.");
      return;
    }
    if (yellow >= red) {
      setError("Yellow time must be less than red time.");
      return;
    }

    const customPreset = {
      name: "Custom Timer",
      type: "Custom" as const,
      greenTime: green,
      yellowTime: yellow,
      redTime: red,
      gracePeriod: { under: 30, over: 30 }, // Default grace period for custom
    };
    selectPreset(customPreset);
  };

  const formatTimeInput = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  const parseTimeInput = (input: string): number => {
    const parts = input.split(':').map(Number);
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return parts[0] * 60 + parts[1];
    }
    // Simple parsing, could be improved
    const num = parseInt(input, 10);
    return isNaN(num) ? 0 : num;
  };

  if (selectedPreset?.type !== 'Custom') {
    return null; // Only render if custom preset is selected
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg space-y-4">
      <h3 className="text-lg font-semibold text-black dark:text-white">Set Custom Times (MM:SS)</h3>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="green-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Green</label>
          <input
            type="text"
            id="green-time"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm sm:text-sm p-2 border"
            value={formatTimeInput(green)}
            onChange={(e) => setGreen(parseTimeInput(e.target.value))}
            disabled={isRunning}
          />
        </div>
        <div>
          <label htmlFor="yellow-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Yellow</label>
          <input
            type="text"
            id="yellow-time"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm sm:text-sm p-2 border"
            value={formatTimeInput(yellow)}
            onChange={(e) => setYellow(parseTimeInput(e.target.value))}
            disabled={isRunning}
          />
        </div>
        <div>
          <label htmlFor="red-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Red</label>
          <input
            type="text"
            id="red-time"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm sm:text-sm p-2 border"
            value={formatTimeInput(red)}
            onChange={(e) => setRed(parseTimeInput(e.target.value))}
            disabled={isRunning}
          />
        </div>
      </div>
      <button
        onClick={handleSaveCustom}
        disabled={isRunning}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Custom Preset
      </button>
    </div>
  );
}
