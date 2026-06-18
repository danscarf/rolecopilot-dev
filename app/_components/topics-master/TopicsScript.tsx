// app/_components/topics-master/TopicsScript.tsx
'use client';

import React from 'react';

export function TopicsScript() {
  return (
    <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed pt-4">
      <p className="italic text-gray-600 dark:text-gray-400 mb-4">
        When introduced by the Toastmaster, read the following:
      </p>
      <blockquote className="border-l-4 border-emerald-500 pl-4 text-gray-800 dark:text-gray-200 not-italic space-y-2">
        <p>
          &ldquo;Greetings Mr./Madam Toastmaster, fellow Toastmasters, and guests. The purpose of
          the Topicsmaster is to facilitate Table Topics&reg;, where guests and members will have
          the opportunity to practice their impromptu speaking. I will introduce a topic and call
          on speakers, who will be given two minutes to speak on the subject. Thank you
          Mr./Madam Toastmaster.&rdquo;
        </p>
      </blockquote>
    </div>
  );
}
