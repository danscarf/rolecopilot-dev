// app/_components/topics-master/TopicsSetup.tsx
'use client';

import React, { useState } from 'react';
import { useTopicsMaster } from '../../_providers/TopicsMasterProvider';

export function TopicsSetup() {
  const { session, setTheme, addTopic, removeTopic } = useTopicsMaster();
  const [topicInput, setTopicInput] = useState('');

  const handleAddTopic = () => {
    if (!topicInput.trim()) return;
    addTopic(topicInput);
    setTopicInput('');
  };

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Meeting Theme
        </label>
        <input
          type="text"
          value={session.theme}
          onChange={e => setTheme(e.target.value)}
          placeholder="e.g. The Power of Habit"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Add Topic */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Topics
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={topicInput}
            onChange={e => setTopicInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddTopic()}
            placeholder="Enter a topic prompt..."
            className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleAddTopic}
            disabled={!topicInput.trim()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>

        {session.topics.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">No topics yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {session.topics.map((topic, idx) => (
              <li
                key={topic.id}
                className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
              >
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-mono text-gray-400 mr-2">{idx + 1}.</span>
                  {topic.text}
                </span>
                <button
                  onClick={() => removeTopic(topic.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-2 text-lg leading-none"
                  aria-label="Remove topic"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
