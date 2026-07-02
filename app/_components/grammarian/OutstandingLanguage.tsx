// app/_components/grammarian/OutstandingLanguage.tsx
'use client';

import React, { useState } from 'react';
import { useGrammarian } from '../../_providers/GrammarianProvider';

export function OutstandingLanguage() {
  const { session, selectedSpeaker, logOutstandingLanguage, removeOutstandingLanguage } = useGrammarian();
  const [phrase, setPhrase] = useState('');

  const canSubmit = !!selectedSpeaker && phrase.trim().length > 0;

  const handleSubmit = () => {
    if (!selectedSpeaker) return;
    const p = phrase.trim();
    if (!p) return;
    logOutstandingLanguage(selectedSpeaker, p);
    setPhrase('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">⭐</span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Outstanding Language</h3>
      </div>

      {!selectedSpeaker && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Select a speaker to log an observation.
        </p>
      )}

      <textarea
        value={phrase}
        onChange={(e) => setPhrase(e.target.value)}
        placeholder="Notable quote, phrase, or word"
        rows={2}
        className="block w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
        disabled={!selectedSpeaker}
      />
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full py-2 px-4 rounded-lg font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Log Outstanding {selectedSpeaker && `→ ${selectedSpeaker.name}`}
      </button>

      {session.outstandingLanguage.length > 0 && (
        <ul className="space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700 max-h-40 overflow-y-auto">
          {[...session.outstandingLanguage].reverse().map((entry) => (
            <li key={entry.id} className="flex items-start gap-2 text-sm p-2 rounded bg-emerald-50 dark:bg-emerald-900/20">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 break-words">
                  {entry.speaker.name}: <span className="font-normal italic">&ldquo;{entry.phrase}&rdquo;</span>
                </p>
              </div>
              <button
                onClick={() => removeOutstandingLanguage(entry.id)}
                aria-label={`Delete outstanding language entry for ${entry.speaker.name}`}
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
