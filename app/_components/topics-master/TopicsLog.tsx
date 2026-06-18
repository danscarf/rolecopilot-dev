// app/_components/topics-master/TopicsLog.tsx
'use client';

import React, { useState } from 'react';
import { useTopicsMaster, Topic } from '../../_providers/TopicsMasterProvider';

export function TopicsLog() {
  const { session, logSpeaker, removeLogEntry } = useTopicsMaster();
  const [speakerName, setSpeakerName] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('');

  const selectedTopic = session.topics.find(t => t.id === selectedTopicId) ?? null;

  const handleLog = () => {
    if (!speakerName.trim() || !selectedTopic) return;
    logSpeaker(speakerName, selectedTopic);
    setSpeakerName('');
    setSelectedTopicId('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Speaker Log</h2>

      {/* Add entry */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={speakerName}
            onChange={e => setSpeakerName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLog()}
            placeholder="Speaker name"
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={selectedTopicId}
            onChange={e => setSelectedTopicId(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select topic…</option>
            {session.topics.map(t => (
              <option key={t.id} value={t.id}>{t.text}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleLog}
          disabled={!speakerName.trim() || !selectedTopic}
          className="w-full py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Log Speaker
        </button>
        {session.topics.length === 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400">Add topics in the Setup panel first.</p>
        )}
      </div>

      {/* Log entries */}
      {session.log.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500">No speakers logged yet.</p>
      ) : (
        <div className="space-y-2">
          {session.log.map((entry, idx) => (
            <div
              key={entry.id}
              className="flex items-start justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
            >
              <div>
                <span className="font-mono text-xs text-gray-400 mr-2">{idx + 1}.</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{entry.speakerName}</span>
                <span className="mx-2 text-gray-400">→</span>
                <span className="text-gray-600 dark:text-gray-300 text-sm">{entry.topic.text}</span>
              </div>
              <button
                onClick={() => removeLogEntry(entry.id)}
                className="text-gray-400 hover:text-red-500 transition-colors ml-4 text-lg leading-none flex-shrink-0"
                aria-label="Remove entry"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
