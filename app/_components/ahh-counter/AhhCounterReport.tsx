// app/_components/ahh-counter/AhhCounterReport.tsx
'use client';

import React from 'react';
import { useAhhCounter, Speaker } from '../../_providers/AhhCounterProvider';

export function AhhCounterReport() {
  const { session } = useAhhCounter();

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
    <div className="p-4 border rounded-lg mt-4">
      <h2 className="text-xl font-bold">Report</h2>
      {session.logEntries.length === 0 ? (
        <p className="text-gray-500 mt-2">No entries logged yet.</p>
      ) : (
        <table className="w-full mt-2 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Speaker</th>
              {fillerWords.map(word => (
                <th key={word} className="p-2 border">{word}</th>
              ))}
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(reportData).map(([speakerName, counts]) => {
              const total = Object.values(counts).reduce((acc, count) => acc + count, 0);
              return (
                <tr key={speakerName}>
                  <td className="p-2 border font-semibold">{speakerName}</td>
                  {fillerWords.map(word => (
                    <td key={word} className="p-2 border text-center">{counts[word] || 0}</td>
                  ))}
                  <td className="p-2 border text-center font-bold">{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
