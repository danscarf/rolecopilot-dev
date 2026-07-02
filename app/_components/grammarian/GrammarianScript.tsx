// app/_components/grammarian/GrammarianScript.tsx
'use client';

import React from 'react';
import { useGrammarian } from '../../_providers/GrammarianProvider';

export function GrammarianScript() {
  const { session } = useGrammarian();
  const { word, meaning, example } = session.wordOfTheDay;

  const blank = (v: string) => v.trim() || '______________________________';

  return (
    <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
      <p>
        &ldquo;Mr./Madam Toastmaster, fellow Toastmasters, and guests. As Grammarian, it is my
        responsibility to pay close attention to all speakers, listening carefully to their language
        usage. I&rsquo;ll take note of any improper language, as well as any outstanding words, quotes,
        sayings, or thoughts. As Grammarian, it is also my duty to introduce the Word of the Day.
      </p>
      <p>
        For today&rsquo;s meeting, the Word is <span className="font-semibold text-purple-700 dark:text-purple-300">{blank(word)}</span>,
        which means <span className="font-semibold text-purple-700 dark:text-purple-300">{blank(meaning)}</span>.
      </p>
      <p className="italic text-xs text-gray-500 dark:text-gray-400">
        [Display the Word of the Day at the front of the room.]
      </p>
      <p>
        An example of using the word is: <span className="italic text-purple-700 dark:text-purple-300">{blank(example)}</span>
      </p>
      <p>Each speaker is encouraged to use the Word of the Day.</p>
      <p>
        I will give the Grammarian&rsquo;s report when called upon during the meeting and also report
        on the usage of the Word of the Day.
      </p>
      <p>Thank you, Mr./Madam Toastmaster.&rdquo;</p>
    </div>
  );
}
