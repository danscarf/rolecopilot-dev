// app/_components/grammarian/ImproperUsage.tsx
'use client';

import React, { useState } from 'react';
import { useGrammarian } from '../../_providers/GrammarianProvider';

export function ImproperUsage() {
  const { session, selectedSpeaker, logImproperUsage, removeImproperUsage } = useGrammarian();
  const [improperUse, setImproperUse] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const canSubmit = !!selectedSpeaker && improperUse.trim().length > 0;

  const handleSubmit = () => {
    if (!selectedSpeaker) return;
    const iu = improperUse.trim();
    if (!iu) return;
    logImproperUsage(selectedSpeaker, iu, suggestion.trim());
    setImproperUse('');
    setSuggestion('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚠️</span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Improper Usage</h3>
      </div>

      {!selectedSpeaker && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Select a speaker to log an observation.
        </p>
      )}

      <input
        type="text"
        value={improperUse}
        onChange={(e) => setImproperUse(e.target.value)}
        placeholder="Improper use (e.g., 'me and him went')"
        className="block w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        disabled={!selectedSpeaker}
      />
      <input
        type="text"
        value={suggestion}
        onChange={(e) => setSuggestion(e.target.value)}
        placeholder="Suggestion (optional)"
        className="block w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        disabled={!selectedSpeaker}
      />
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full py-2 px-4 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Log Improper Usage {selectedSpeaker && `→ ${selectedSpeaker.name}`}
      </button>

      {session.improperUsages.length > 0 && (
        <ul className="space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700 max-h-40 overflow-y-auto">
          {[...session.improperUsages].reverse().map((entry) => (
            <li key={entry.id} className="flex items-start gap-2 text-sm p-2 rounded bg-red-50 dark:bg-red-900/20">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 break-words">
                  {entry.speaker.name}: <span className="font-normal">{entry.improperUse}</span>
                </p>
                {entry.suggestion && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 break-words">
                    → {entry.suggestion}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeImproperUsage(entry.id)}
                aria-label={`Delete improper usage entry for ${entry.speaker.name}`}
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
