'use client';

import React from 'react';
import { useAhhCounter } from '../../_providers/AhhCounterProvider';
import { useMeeting } from '../../_providers/MeetingProvider';

export function AhhCounterReport() {
  const { session } = useAhhCounter();
  const { people } = useMeeting();

  const fillerWords = ["Ah", "Um", "Er", "Uh", "Well", "So", "Like", "But", "And", "You know", "Okay", "Repeats"];

  const calculateReport = () => {
    const report: Record<string, Record<string, number>> = {};
    for (const person of people) {
      report[person.name] = {};
    }
    for (const entry of session.logEntries) {
      const name = entry.speaker.name;
      if (!report[name]) report[name] = {};
      report[name][entry.fillerWord] = (report[name][entry.fillerWord] ?? 0) + 1;
    }
    return report;
  };

  const reportData = calculateReport();

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
