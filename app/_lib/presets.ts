// app/_lib/presets.ts

import { TimerPreset } from '../_providers/TimerProvider';

export const predefinedPresets: TimerPreset[] = [
  {
    name: "Table Topics",
    type: "Table Topics",
    greenTime: 60, // 1 minute
    yellowTime: 90, // 1 minute 30 seconds
    redTime: 120, // 2 minutes
    gracePeriod: { under: 0, over: 15 }, // 15 seconds over
  },
  {
    name: "Ice Breaker (4-6 min)",
    type: "Speech",
    greenTime: 240, // 4 minutes
    yellowTime: 300, // 5 minutes
    redTime: 360, // 6 minutes
    gracePeriod: { under: 30, over: 30 }, // 30 seconds under/over
  },
  {
    name: "Standard Speech (5-7 min)",
    type: "Speech",
    greenTime: 300, // 5 minutes
    yellowTime: 360, // 6 minutes
    redTime: 420, // 7 minutes
    gracePeriod: { under: 30, over: 30 }, // 30 seconds under/over
  },
  {
    name: "Evaluation (2-3 min)",
    type: "Evaluation",
    greenTime: 120, // 2 minutes
    yellowTime: 150, // 2 minutes 30 seconds
    redTime: 180, // 3 minutes
    gracePeriod: { under: 30, over: 30 }, // 30 seconds under/over
  },
  // A placeholder for custom input, type set to Custom
  {
    name: "Custom",
    type: "Custom",
    greenTime: 0,
    yellowTime: 0,
    redTime: 0,
    gracePeriod: { under: 0, over: 0 },
  }
];
