// app/_components/ahh-counter/AhhCounterControls.tsx
'use client';

import React from 'react';
import { useAhhCounter } from '../../_providers/AhhCounterProvider';

export function AhhCounterControls() {
  const { selectedSpeaker, logFillerWord, undoLastLog } = useAhhCounter();
  const fillerWords = ["Ah", "Um", "Er", "Well", "So", "Like", "But", "Repeats", "Other"];

  const handleLog = (word: string) => {
    if (selectedSpeaker) {
      logFillerWord(selectedSpeaker, word);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Controls for {selectedSpeaker ? selectedSpeaker.name : '...'}</h2>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {fillerWords.map(word => (
          <button
            key={word}
            onClick={() => handleLog(word)}
            disabled={!selectedSpeaker}
            className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-purple-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100"
          >
            {word}
          </button>
        ))}
      </div>
      <button
        onClick={undoLastLog}
        disabled={!selectedSpeaker}
        className="mt-4 p-2 bg-red-600 text-white rounded-lg w-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Undo Last
      </button>
    </div>
  );
}
