// app/_components/topics-master/TopicsGenerator.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTopicsMaster } from '../../_providers/TopicsMasterProvider';
import { generateTopics } from '../../_lib/generateTopics';
import { useRealSession } from '../../_lib/useRealSession';

interface TopicsGeneratorProps {
  wotd: string;
  onWotdChange: (wotd: string) => void;
  difficulty: 'easy' | 'hard';
  onDifficultyChange: (difficulty: 'easy' | 'hard') => void;
}

export function TopicsGenerator({ wotd, onWotdChange, difficulty, onDifficultyChange }: TopicsGeneratorProps) {
  const { session, addGeneratedTopics, removeUnusedTopics } = useTopicsMaster();
  const { signedIn, checking } = useRealSession();
  const [count, setCount] = useState(5);
  const [replaceUnused, setReplaceUnused] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usedIds = new Set(session.log.map(e => e.topic.id));
  const unusedCount = session.topics.filter(t => !usedIds.has(t.id)).length;

  const handleGenerate = async () => {
    if (generating) return;
    if (replaceUnused && unusedCount > 0) {
      if (!confirm(`Discard the ${unusedCount} unused topic${unusedCount === 1 ? '' : 's'} and replace with a new set?`)) {
        return;
      }
    }
    setGenerating(true);
    setError(null);
    try {
      const avoid = replaceUnused
        ? session.topics.filter(t => usedIds.has(t.id)).map(t => t.text)
        : session.topics.map(t => t.text);
      const questions = await generateTopics({
        theme: session.theme || undefined,
        wordOfTheDay: wotd || undefined,
        count,
        difficulty,
        avoid,
      });
      if (replaceUnused) removeUnusedTopics();
      addGeneratedTopics(questions, difficulty);
    } catch (e: unknown) {
      setError((e as Error).message || 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Word of the Day <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          value={wotd}
          onChange={e => onWotdChange(e.target.value)}
          placeholder="e.g. serendipity"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <div className="flex rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden">
            {(['easy', 'hard'] as const).map(d => (
              <button
                key={d}
                onClick={() => onDifficultyChange(d)}
                className={`flex-1 px-3 py-2 text-sm font-semibold capitalize transition-colors ${
                  difficulty === d
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div className="w-24">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Count
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={count}
            onChange={e => setCount(Math.min(Math.max(Number(e.target.value) || 1, 1), 10))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {unusedCount > 0 && (
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={replaceUnused}
            onChange={e => setReplaceUnused(e.target.checked)}
            className="rounded accent-emerald-600"
          />
          Replace unused topics instead of adding
        </label>
      )}

      <button
        onClick={handleGenerate}
        disabled={generating || checking || !signedIn}
        title={!signedIn && !checking ? 'Sign in to generate questions' : undefined}
        className="w-full py-2 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {generating ? 'Generating…' : '✨ Generate Questions'}
      </button>

      {!checking && !signedIn && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          AI generation uses meeting credits, so it needs a signed-in account.{' '}
          <Link href="/auth/login" className="font-semibold text-emerald-600 hover:text-emerald-700 underline">
            Sign in
          </Link>{' '}
          to generate questions — you can still add topics manually below.
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}{' '}
          <button onClick={handleGenerate} className="underline font-semibold hover:text-red-700">
            Retry
          </button>
        </p>
      )}
    </div>
  );
}
