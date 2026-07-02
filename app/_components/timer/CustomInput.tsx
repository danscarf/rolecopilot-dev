// app/_components/timer/CustomInput.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useTimer } from '../../_providers/TimerProvider';

const formatTimeInput = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Accepts "M:SS", "M:S", or a bare number of seconds. Returns 0 for unparseable input.
const parseTimeInput = (input: string): number => {
  const trimmed = input.trim();
  if (!trimmed) return 0;
  if (trimmed.includes(':')) {
    const [minPart, secPart = '0'] = trimmed.split(':');
    const m = parseInt(minPart, 10);
    const s = parseInt(secPart, 10);
    if (isNaN(m) || isNaN(s)) return 0;
    return m * 60 + s;
  }
  const n = parseInt(trimmed, 10);
  return isNaN(n) ? 0 : n;
};

export function CustomInput() {
  const { selectedPreset, selectPreset, isRunning } = useTimer();
  const [greenText, setGreenText] = useState('0:00');
  const [yellowText, setYellowText] = useState('0:00');
  const [redText, setRedText] = useState('0:00');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPreset?.type === 'Custom') {
      setGreenText(formatTimeInput(selectedPreset.greenTime));
      setYellowText(formatTimeInput(selectedPreset.yellowTime));
      setRedText(formatTimeInput(selectedPreset.redTime));
    }
  }, [selectedPreset]);

  const handleSaveCustom = () => {
    setError(null);
    const green = parseTimeInput(greenText);
    const yellow = parseTimeInput(yellowText);
    const red = parseTimeInput(redText);

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

    selectPreset({
      name: "Custom Timer",
      type: "Custom",
      greenTime: green,
      yellowTime: yellow,
      redTime: red,
      gracePeriod: { under: 30, over: 30 },
    });
  };

  // Reformat "5" → "0:05" or "5:3" → "5:03" when the user leaves the field.
  const handleBlur = (text: string, setText: (v: string) => void) => {
    setText(formatTimeInput(parseTimeInput(text)));
  };

  if (selectedPreset?.type !== 'Custom') {
    return null;
  }

  const inputClass = "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm sm:text-sm p-2 border";

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
            inputMode="numeric"
            className={inputClass}
            value={greenText}
            onChange={(e) => setGreenText(e.target.value)}
            onBlur={() => handleBlur(greenText, setGreenText)}
            disabled={isRunning}
          />
        </div>
        <div>
          <label htmlFor="yellow-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Yellow</label>
          <input
            type="text"
            id="yellow-time"
            inputMode="numeric"
            className={inputClass}
            value={yellowText}
            onChange={(e) => setYellowText(e.target.value)}
            onBlur={() => handleBlur(yellowText, setYellowText)}
            disabled={isRunning}
          />
        </div>
        <div>
          <label htmlFor="red-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Red</label>
          <input
            type="text"
            id="red-time"
            inputMode="numeric"
            className={inputClass}
            value={redText}
            onChange={(e) => setRedText(e.target.value)}
            onBlur={() => handleBlur(redText, setRedText)}
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
