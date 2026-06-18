// app/_components/ahh-counter/SpeakerList.tsx
'use client';

import React, { useState } from 'react';
import { useAhhCounter } from '../../_providers/AhhCounterProvider';

export function SpeakerList() {
  const { session, addSpeaker, selectedSpeaker, selectSpeaker } = useAhhCounter();
  const [newSpeakerName, setNewSpeakerName] = useState('');

  const handleAddSpeaker = () => {
    if (newSpeakerName.trim()) {
      addSpeaker(newSpeakerName.trim());
      setNewSpeakerName('');
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Speakers</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newSpeakerName}
          onChange={(e) => setNewSpeakerName(e.target.value)}
          placeholder="New speaker name"
          className="flex-grow p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
        <button onClick={handleAddSpeaker} className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {session.speakers.map((speaker) => (
          <li
            key={speaker.id}
            onClick={() => selectSpeaker(speaker)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedSpeaker?.id === speaker.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
            }`}
          >
            {speaker.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
