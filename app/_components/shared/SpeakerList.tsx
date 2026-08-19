'use client';

import React, { useState } from 'react';
import { useMeeting, type Person, type Segment } from '../../_providers/MeetingProvider';

interface SpeakerListProps {
  selectedSpeaker: Person | null;
  onSelect: (speaker: Person | null) => void;
  tableTopicsPersonIds?: Set<string>;
}

const SEGMENT_LABELS: { key: Segment; short: string }[] = [
  { key: 'Speech', short: 'S' },
  { key: 'Evaluation', short: 'E' },
];

export function SpeakerList({ selectedSpeaker, onSelect, tableTopicsPersonIds }: SpeakerListProps) {
  const { people, addPerson, toggleSegment } = useMeeting();
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    addPerson(trimmed);
    setNewName('');
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Speakers</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
          placeholder="New speaker name"
          className="flex-grow p-2 border rounded-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 px-4"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {people.map((person) => {
          const isSelected = selectedSpeaker?.id === person.id;
          const hasTableTopics = tableTopicsPersonIds?.has(person.id) ?? false;
          return (
            <li
              key={person.id}
              onClick={() => onSelect(isSelected ? null : person)}
              className={`p-3 rounded-xl cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium truncate">{person.name}</span>
                <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {SEGMENT_LABELS.map(({ key, short }) => {
                    const active = person.segments.includes(key);
                    return (
                      <button
                        key={key}
                        title={key}
                        onClick={() => toggleSegment(person.id, key)}
                        className={`w-6 h-6 rounded-full text-xs font-bold transition-colors ${
                          active
                            ? isSelected
                              ? 'bg-white text-purple-700'
                              : 'bg-purple-600 text-white'
                            : isSelected
                              ? 'bg-purple-500/50 text-purple-100'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {short}
                      </button>
                    );
                  })}
                  <span
                    title="Table Topics"
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      hasTableTopics
                        ? isSelected ? 'bg-white text-purple-700' : 'bg-purple-600 text-white'
                        : isSelected ? 'border border-purple-400/50 text-purple-200' : 'border border-gray-300 dark:border-gray-500 text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    T
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
