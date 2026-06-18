// app/_components/ahh-counter/AhhCounterReport.tsx
'use client';

import React from 'react';
import { useAhhCounter, Speaker } from '../../_providers/AhhCounterProvider';

export function AhhCounterReport() {
  const { session } = useAhhCounter();

  /**
   * Processes the log entries to calculate the total count of each filler word for each speaker.
   * @returns A nested object where the outer key is the speaker's name,
   * and the inner key is the filler word, with the value being the count.
   * e.g., { "John Doe": { "Ah": 3, "Um": 2 } }
   */
  const calculateReport = () => {
    const report: Record<string, Record<string, number>> = {};

    for (const speaker of session.speakers) {
      report[speaker.name] = {};
    }

    for (const entry of session.logEntries) {
      const speakerName = entry.speaker.name;
      const fillerWord = entry.fillerWord;

      if (!report[speakerName]) {
        report[speakerName] = {};
      }

      if (!report[speakerName][fillerWord]) {
        report[speakerName][fillerWord] = 0;
      }

      report[speakerName][fillerWord]++;
    }

    return report;
  };

  const reportData = calculateReport();
  const fillerWords = ["Ah", "Um", "Er", "Well", "So", "Like", "But", "Repeats", "Other"];

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-lg mt-4">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Report</h2>
      {session.logEntries.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 mt-2">No entries logged yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full mt-2 border-collapse text-gray-900 dark:text-gray-100">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="p-3 border border-gray-200 dark:border-gray-600 text-left">Speaker</th>
                {fillerWords.map(word => (
                  <th key={word} className="p-3 border border-gray-200 dark:border-gray-600">{word}</th>
                ))}
                <th className="p-3 border border-gray-200 dark:border-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(reportData).map(([speakerName, counts]) => {
                const total = Object.values(counts).reduce((acc, count) => acc + count, 0);
                return (
                  <tr key={speakerName} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 border border-gray-200 dark:border-gray-600 font-semibold">{speakerName}</td>
                    {fillerWords.map(word => (
                      <td key={word} className="p-3 border border-gray-200 dark:border-gray-600 text-center">{counts[word] || 0}</td>
                    ))}
                    <td className="p-3 border border-gray-200 dark:border-gray-600 text-center font-bold">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
