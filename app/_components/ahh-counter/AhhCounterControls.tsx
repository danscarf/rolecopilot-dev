// app/_components/ahh-counter/AhhCounterControls.tsx
'use client';

import React from 'react';

export function AhhCounterControls() {
  const fillerWords = ["Ah", "Um", "Er", "Well", "So", "Like", "But", "Repeats", "Other"];

  return (
    <div>
      <h2 className="text-xl font-bold">Controls</h2>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {fillerWords.map(word => (
          <button key={word} className="p-4 bg-gray-200 rounded">
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}
