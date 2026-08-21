// app/_components/topics-master/TopicsSetup.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useTopicsMaster } from '../../_providers/TopicsMasterProvider';
import { TopicsGenerator } from './TopicsGenerator';
import { generateTopics } from '../../_lib/generateTopics';
import { useRealSession } from '../../_lib/useRealSession';

export function TopicsSetup() {
  const { session, setTheme, addTopic, removeTopic, updateTopicText, replaceTopicText } = useTopicsMaster();
  const { signedIn } = useRealSession();
  const [topicInput, setTopicInput] = useState('');
  const [wotd, setWotd] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'hard'>('easy');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [regenError, setRegenError] = useState<string | null>(null);

  // Pre-fill WOTD from the current Grammarian session (editable, one-time).
  useEffect(() => {
    try {
      const saved = localStorage.getItem('grammarian-session');
      if (saved) {
        const word = JSON.parse(saved)?.wordOfTheDay?.word;
        if (typeof word === 'string' && word.trim()) setWotd(word.trim());
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const usedIds = new Set(session.log.map(e => e.topic.id));

  const handleAddTopic = () => {
    if (!topicInput.trim()) return;
    addTopic(topicInput);
    setTopicInput('');
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const commitEdit = () => {
    if (editingId && editText.trim()) updateTopicText(editingId, editText);
    setEditingId(null);
    setEditText('');
  };

  const handleRegenerate = async (topicId: string) => {
    if (regeneratingId) return;
    const topic = session.topics.find(t => t.id === topicId);
    if (!topic) return;
    setRegeneratingId(topicId);
    setRegenError(null);
    try {
      const [replacement] = await generateTopics({
        theme: session.theme || undefined,
        wordOfTheDay: wotd || undefined,
        count: 1,
        difficulty: topic.difficulty ?? difficulty,
        avoid: session.topics.map(t => t.text),
      });
      replaceTopicText(topicId, replacement);
    } catch (e: unknown) {
      setRegenError((e as Error).message || 'Regeneration failed. Please try again.');
    } finally {
      setRegeneratingId(null);
    }
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

      {/* Generate */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">✨ Generate Questions</h3>
        <TopicsGenerator
          wotd={wotd}
          onWotdChange={setWotd}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
      </div>

      {/* Add Topic */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
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
            className="flex-1 min-w-0 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={handleAddTopic}
            disabled={!topicInput.trim()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>

        {regenError && (
          <p className="mt-2 text-sm text-red-500" role="alert">{regenError}</p>
        )}

        {session.topics.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">No topics yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {session.topics.map((topic, idx) => {
              const used = usedIds.has(topic.id);
              const isEditing = editingId === topic.id;
              const isRegenerating = regeneratingId === topic.id;
              return (
                <li
                  key={topic.id}
                  className={`flex items-start justify-between gap-2 px-4 py-2 rounded-xl ${
                    used ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={editText}
                      autoFocus
                      onChange={e => setEditText(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={e => {
                        if (e.key === 'Enter') commitEdit();
                        if (e.key === 'Escape') { setEditingId(null); setEditText(''); }
                      }}
                      className="flex-1 min-w-0 px-2 py-1 rounded-lg border border-emerald-400 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
                    />
                  ) : (
                    <span className={`flex-1 min-w-0 break-words text-sm text-gray-800 dark:text-gray-200 ${isRegenerating ? 'opacity-40' : ''}`}>
                      <span className="font-mono text-gray-400 mr-2">{idx + 1}.</span>
                      {topic.text}
                      {topic.source === 'generated' && (
                        <span
                          className="ml-2 text-xs text-emerald-600 dark:text-emerald-400"
                          title={`AI-generated (${topic.difficulty ?? 'easy'})${topic.edited ? ', edited' : ''}`}
                        >
                          ✨{topic.edited ? '✎' : ''}
                        </span>
                      )}
                      {used && (
                        <span className="ml-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400" title="Assigned to a speaker">
                          ✓ used
                        </span>
                      )}
                    </span>
                  )}
                  <span className="flex items-center gap-1 flex-shrink-0">
                    {!isEditing && (
                      <button
                        onClick={() => startEdit(topic.id, topic.text)}
                        disabled={isRegenerating}
                        className="text-gray-400 hover:text-emerald-600 transition-colors text-sm px-1 disabled:opacity-40"
                        aria-label="Edit topic"
                        title="Edit"
                      >
                        ✎
                      </button>
                    )}
                    {topic.source === 'generated' && !isEditing && signedIn && (
                      <button
                        onClick={() => handleRegenerate(topic.id)}
                        disabled={regeneratingId !== null}
                        className={`text-gray-400 hover:text-emerald-600 transition-colors text-sm px-1 disabled:opacity-40 ${isRegenerating ? 'animate-spin' : ''}`}
                        aria-label="Regenerate topic"
                        title="Regenerate this question"
                      >
                        ↻
                      </button>
                    )}
                    <button
                      onClick={() => removeTopic(topic.id)}
                      disabled={isRegenerating}
                      className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none px-1 disabled:opacity-40"
                      aria-label="Remove topic"
                    >
                      ×
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
