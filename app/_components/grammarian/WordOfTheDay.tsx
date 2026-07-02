// app/_components/grammarian/WordOfTheDay.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useGrammarian } from '../../_providers/GrammarianProvider';

export function WordOfTheDay() {
  const { session, setWordOfTheDay, logWotdUsage, removeWotdUsage } = useGrammarian();
  const wotd = session.wordOfTheDay;
  const isSet = wotd.word.trim().length > 0;

  const [isEditing, setIsEditing] = useState(!isSet);
  const [word, setWord] = useState(wotd.word);
  const [meaning, setMeaning] = useState(wotd.meaning);
  const [example, setExample] = useState(wotd.example);

  // Keep editor fields in sync when the stored WOTD changes (e.g. new session).
  useEffect(() => {
    setWord(wotd.word);
    setMeaning(wotd.meaning);
    setExample(wotd.example);
    if (!wotd.word.trim()) setIsEditing(true);
  }, [wotd.word, wotd.meaning, wotd.example]);

  const usageBySpeaker = new Set(session.wotdUsages.map((u) => u.speaker.id));

  const handleSave = () => {
    setWordOfTheDay({ word: word.trim(), meaning: meaning.trim(), example: example.trim() });
    if (word.trim()) setIsEditing(false);
  };

  const toggleUsage = (speakerId: string) => {
    const existing = session.wotdUsages.find((u) => u.speaker.id === speakerId);
    if (existing) {
      removeWotdUsage(existing.id);
    } else {
      const speaker = session.speakers.find((s) => s.id === speakerId);
      if (speaker) logWotdUsage(speaker);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">📚</span>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Word of the Day</h3>
        </div>
        {isSet && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Word (e.g., 'Ephemeral')"
            className="block w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <input
            type="text"
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            placeholder="Meaning"
            className="block w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <textarea
            value={example}
            onChange={(e) => setExample(e.target.value)}
            placeholder="Example sentence"
            rows={2}
            className="block w-full p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!word.trim()}
              className="flex-1 py-2 px-4 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {isSet ? 'Update' : 'Set Word of the Day'}
            </button>
            {isSet && (
              <button
                onClick={() => {
                  setWord(wotd.word);
                  setMeaning(wotd.meaning);
                  setExample(wotd.example);
                  setIsEditing(false);
                }}
                className="py-2 px-4 rounded-lg font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 break-words">{wotd.word}</p>
          {wotd.meaning && (
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 break-words">
              <span className="font-semibold">Meaning:</span> {wotd.meaning}
            </p>
          )}
          {wotd.example && (
            <p className="mt-1 text-sm italic text-gray-600 dark:text-gray-400 break-words">
              &ldquo;{wotd.example}&rdquo;
            </p>
          )}
        </div>
      )}

      {isSet && !isEditing && (
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Who used the Word of the Day?
          </p>
          {session.speakers.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add speakers to track WOTD usage.
            </p>
          ) : (
            <ul className="space-y-1">
              {session.speakers.map((s) => {
                const used = usageBySpeaker.has(s.id);
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => toggleUsage(s.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                        used
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="font-medium">{s.name}</span>
                      <span className="text-xs">{used ? '✓ Used' : 'Mark used'}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
