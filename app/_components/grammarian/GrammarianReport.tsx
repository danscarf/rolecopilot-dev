'use client';

import React, { useState } from 'react';
import { useGrammarian } from '../../_providers/GrammarianProvider';
import { useMeeting } from '../../_providers/MeetingProvider';
import { sortPeopleBy, type SortOrder } from '../../_lib/sortPeople';
import type { ImproperUsageEntry, OutstandingLanguageEntry } from '../../_providers/GrammarianProvider';

function groupBySpeaker<T extends { speaker: { id: string; name: string } }>(entries: T[]) {
  const groups = new Map<string, { id: string; name: string; items: T[] }>();
  for (const e of entries) {
    const g = groups.get(e.speaker.id) ?? { id: e.speaker.id, name: e.speaker.name, items: [] };
    g.items.push(e);
    groups.set(e.speaker.id, g);
  }
  return [...groups.values()];
}

export function GrammarianReport() {
  const { session } = useGrammarian();
  const { people } = useMeeting();
  const [sortOrder, setSortOrder] = useState<SortOrder>('roster');
  const { improperUsages, outstandingLanguage, wotdUsages, wordOfTheDay } = session;

  const isEmpty =
    improperUsages.length === 0 &&
    outstandingLanguage.length === 0 &&
    wotdUsages.length === 0;

  if (isEmpty) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">📭</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">No observations recorded yet</p>
      </div>
    );
  }

  const getObsCount = (id: string) =>
    improperUsages.filter(e => e.speaker.id === id).length +
    outstandingLanguage.filter(e => e.speaker.id === id).length;

  const sortedPeople = sortPeopleBy(people, sortOrder, getObsCount);

  const improperBySpeaker = groupBySpeaker(improperUsages);
  const outstandingBySpeaker = groupBySpeaker(outstandingLanguage);

  // Sort the grouped arrays to match sortedPeople order
  const sortedIds = sortedPeople.map(p => p.id);
  const orderIndex = (id: string) => {
    const idx = sortedIds.indexOf(id);
    return idx === -1 ? 999 : idx;
  };
  improperBySpeaker.sort((a, b) => orderIndex(a.id) - orderIndex(b.id));
  outstandingBySpeaker.sort((a, b) => orderIndex(a.id) - orderIndex(b.id));

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-full">
          {(['roster', 'most', 'az'] as SortOrder[]).map(order => (
            <button
              key={order}
              onClick={() => setSortOrder(order)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                sortOrder === order
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
              }`}
            >
              {order === 'roster' ? 'Roster order' : order === 'most' ? 'Most obs.' : 'A–Z'}
            </button>
          ))}
        </div>
      </div>

      {wordOfTheDay.word && (
        <section>
          <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-2">
            Word of the Day
          </h3>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <p className="font-bold text-gray-900 dark:text-gray-100 break-words">
              {wordOfTheDay.word}
              {wordOfTheDay.meaning && (
                <span className="font-normal text-sm text-gray-600 dark:text-gray-400"> — {wordOfTheDay.meaning}</span>
              )}
            </p>
            {wotdUsages.length > 0 ? (
              <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Used by:</span>{' '}
                {wotdUsages.map((u) => u.speaker.name).join(', ')}
              </p>
            ) : (
              <p className="text-sm mt-1 text-gray-500 dark:text-gray-400 italic">No speakers used the Word of the Day.</p>
            )}
          </div>
        </section>
      )}

      {improperBySpeaker.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2">
            Improper Usage
          </h3>
          <div className="space-y-3">
            {improperBySpeaker.map((group) => (
              <div key={group.id} className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{group.name}</p>
                <ul className="mt-1 space-y-1 text-sm">
                  {group.items.map((entry: ImproperUsageEntry) => (
                    <li key={entry.id} className="break-words">
                      <span className="text-gray-800 dark:text-gray-200">{entry.improperUse}</span>
                      {entry.suggestion && (
                        <span className="text-gray-600 dark:text-gray-400"> &rarr; {entry.suggestion}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {outstandingBySpeaker.length > 0 && (
        <section>
          <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-2">
            Outstanding Language
          </h3>
          <div className="space-y-3">
            {outstandingBySpeaker.map((group) => (
              <div key={group.id} className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{group.name}</p>
                <ul className="mt-1 space-y-1 text-sm">
                  {group.items.map((entry: OutstandingLanguageEntry) => (
                    <li key={entry.id} className="italic text-gray-800 dark:text-gray-200 break-words">
                      &ldquo;{entry.phrase}&rdquo;
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
