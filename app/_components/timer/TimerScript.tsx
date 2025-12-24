// app/_components/timer/TimerScript.tsx
'use client';

import React from 'react';

export function TimerScript() {
  const scriptText = `
"Greetings Mr./Madam Toastmaster, fellow Toastmasters, and guests. As Timer, I will time the Table Topics® speakers,
formal speeches, and the evaluations. I will also alert each speaker of the time they have left, using the green,
yellow, and red cards, which denote specific times remaining.

Table Topics Speakers should limit their remarks to no more than 2 minutes.
At 1 minute, I will raise the green card.
• At 1 minute and 30 seconds, I will raise the yellow card.
• At 2 minutes, I will raise the red card.

Those giving speeches should limit their remarks to their specific speech times,
Ice Breaker speeches should be 4-6 minutes in length.
• At 4 minutes, I will raise the green card.
• At 5 minutes, I will raise the yellow card.
• At 6 minutes, I will raise the red card.

Most other speeches should be 5-7 minutes in length.
• At 5 minutes, I will raise the green card.
• At 6 minutes, I will raise the yellow card.
• At 7 minutes, I will raise the red card.

The individual evaluations should be between 2-3 minutes.
• At 2 minutes, I will raise the green card.
• At 2 minutes and 30 seconds, I will raise the yellow card.
• At 3 minutes, I will raise the red card.

Thank you Mr./Madam Toastmaster."
  `;

  return (
    <div className="mt-4">
      <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
        {scriptText.trim()}
      </pre>
    </div>
  );
}
