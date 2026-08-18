'use client';

import React, { useState } from 'react';
import { useAhhCounter } from '../../_providers/AhhCounterProvider';

export function AhhCounterControls() {
  const { selectedSpeaker, words, logFillerWord, addCustomWord, undoLastLog } = useAhhCounter();
  const [customWord, setCustomWord] = useState('');

  const handleLog = (word: string) => {
    if (selectedSpeaker) {
      logFillerWord(selectedSpeaker, word);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customWord.trim();
    if (!trimmed) return;
    addCustomWord(trimmed);
    setCustomWord('');
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-lg">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
        Controls for {selectedSpeaker ? selectedSpeaker.name : '…'}
      </h2>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {words.map(word => (
          <button
            key={word}
            onClick={() => handleLog(word)}
            disabled={!selectedSpeaker}
            className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-purple-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100 text-sm font-medium"
          >
            {word}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={customWord}
          onChange={(e) => setCustomWord(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustom(); }}
          placeholder="Custom filler word…"
          className="flex-grow p-2 border rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 px-4 text-sm"
        />
        <button
          onClick={handleAddCustom}
          disabled={!customWord.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Count it
        </button>
      </div>

      <button
        onClick={undoLastLog}
        className="mt-4 p-2 bg-red-600 text-white rounded-full w-full hover:bg-red-700 transition-colors"
      >
        Undo Last
      </button>
    </div>
  );
}
