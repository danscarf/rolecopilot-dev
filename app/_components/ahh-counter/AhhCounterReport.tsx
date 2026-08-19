'use client';

import React, { useState } from 'react';
import { useAhhCounter, type MeetingSegment } from '../../_providers/AhhCounterProvider';
import { useMeeting, type Person } from '../../_providers/MeetingProvider';
import { sortPeopleBy, type SortOrder } from '../../_lib/sortPeople';

const SEGMENTS: MeetingSegment[] = ['Speech', 'Table Topics', 'Evaluation'];

function PersonCard({ person, logEntries }: {
  person: Person;
  logEntries: Array<{ segment: MeetingSegment; word: string }>;
}) {
  if (logEntries.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{person.name}</h3>
          <span className="text-2xl font-bold text-gray-300 dark:text-gray-600">0</span>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 italic">Nothing counted</p>
      </div>
    );
  }

  const total = logEntries.length;

  const bySegment: Record<MeetingSegment, number> = { Speech: 0, 'Table Topics': 0, Evaluation: 0 };
  const byWord: Record<string, number> = {};
  for (const e of logEntries) {
    bySegment[e.segment]++;
    byWord[e.word] = (byWord[e.word] ?? 0) + 1;
  }

  const wordsSorted = Object.entries(byWord).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{person.name}</h3>
        <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">{total}</span>
      </div>

      {/* Segment breakdown */}
      <div className="flex gap-2 mb-4">
        {SEGMENTS.filter(s => bySegment[s] > 0).map(seg => (
          <div key={seg} className="flex flex-col items-center bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2 min-w-[60px]">
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{seg}</span>
            <span className="text-lg font-bold text-gray-800 dark:text-gray-100">{bySegment[seg]}</span>
          </div>
        ))}
      </div>

      {/* Word chips */}
      <div className="flex flex-wrap gap-1.5">
        {wordsSorted.map(([word, count]) => (
          <span
            key={word}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200"
          >
            {word} &times; {count}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AhhCounterReport() {
  const { session } = useAhhCounter();
  const { people } = useMeeting();
  const [sortOrder, setSortOrder] = useState<SortOrder>('roster');

  const getCount = (personId: string) => session.logEntries.filter(e => e.personId === personId).length;

  const sortedPeople = sortPeopleBy(people, sortOrder, getCount);

  // Also include people in logs but not in roster (e.g. TT speakers added on the fly but then roster was reset)
  const rosterIds = new Set(people.map(p => p.id));
  const ghostNames = new Map<string, string>();
  for (const e of session.logEntries) {
    if (!rosterIds.has(e.personId)) ghostNames.set(e.personId, e.personName);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Report</h2>
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
              {order === 'roster' ? 'Roster order' : order === 'most' ? 'Most fillers' : 'A–Z'}
            </button>
          ))}
        </div>
      </div>

      {people.length === 0 && session.logEntries.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No entries logged yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedPeople.map(person => (
            <PersonCard
              key={person.id}
              person={person}
              logEntries={session.logEntries.filter(e => e.personId === person.id)}
            />
          ))}
          {[...ghostNames.entries()].map(([id, name]) => (
            <PersonCard
              key={id}
              person={{ id, name, segments: [] }}
              logEntries={session.logEntries.filter(e => e.personId === id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
