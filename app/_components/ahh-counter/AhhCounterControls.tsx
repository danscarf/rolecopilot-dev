'use client';

import React, { useState } from 'react';
import { useAhhCounter, type MeetingSegment } from '../../_providers/AhhCounterProvider';
import { useMeeting } from '../../_providers/MeetingProvider';

const SEGMENTS: MeetingSegment[] = ['Speech', 'Table Topics', 'Evaluation'];

export function AhhCounterControls() {
  const { selectedSpeaker, selectedSegment, setSelectedSegment, words, logWord, addCustomWord, undoLastLog } = useAhhCounter();
  const { addPerson } = useMeeting();
  const [customWord, setCustomWord] = useState('');
  const [ttName, setTtName] = useState('');

  const handleAddCustom = () => {
    const trimmed = customWord.trim();
    if (!trimmed) return;
    addCustomWord(trimmed);
    setCustomWord('');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        Controls for {selectedSpeaker ? selectedSpeaker.name : '…'}
      </h2>

      {/* Segment tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-full w-fit">
        {SEGMENTS.map(seg => (
          <button
            key={seg}
            onClick={() => setSelectedSegment(seg)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedSegment === seg
                ? 'bg-purple-600 text-white shadow'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {seg}
          </button>
        ))}
      </div>

      {/* Filler word grid */}
      <div className="grid grid-cols-3 gap-2">
        {words.map(word => (
          <button
            key={word}
            onClick={() => logWord(word)}
            disabled={!selectedSpeaker}
            className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-purple-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100 text-sm font-medium"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Custom word */}
      <div className="flex gap-2">
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
        className="p-2 bg-red-600 text-white rounded-full w-full hover:bg-red-700 transition-colors"
      >
        Undo Last
      </button>
    </div>
  );
}
