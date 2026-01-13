// app/_components/ahh-counter/AhhCounterScript.tsx
'use client';

import React from 'react';

export function AhhCounterScript() {
  const scriptText = `
"Greetings Mr./Madam Toastmaster, fellow Toastmasters, and guests. The purpose of the Ah-Counter is to note words and sounds that are used as a “crutch” or “pause filler” by anyone who speaks. During the meeting, I will listen for overused words, including and, well, but, so, and you know. I will also listen for filler sounds, including ah, um, and er . I will also note when a speaker repeats a word or phrase, such as “I, I” or “This means, this means.” At the end of the meeting, I will report the number of times that each speaker used these expressions. Thank you, Mr./Madam Toastmaster.”
  `;

  return (
    <div className="mt-4">
      <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
        {scriptText.trim()}
      </pre>
    </div>
  );
}
