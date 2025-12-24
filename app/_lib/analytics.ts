// app/_lib/analytics.ts

/**
 * Logs an anonymized event for analytics and debugging.
 * In a real application, this would send data to an analytics platform (e.g., Google Analytics, PostHog, custom backend).
 *
 * @param eventName The name of the event (e.g., "timer_started", "preset_selected").
 * @param payload Optional: A payload of anonymized data associated with the event.
 */
export function logEvent(eventName: string, payload?: Record<string, unknown>): void {
  // For now, just log to console. In production, this would send to an analytics service.
  const timestamp = new Date().toISOString();
  console.log(`[ANALYTICS] ${timestamp} - Event: ${eventName}`, payload || '');
  // Example of sending to an external service (would require configuration)
  // fetch('/api/log-analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ eventName, payload, timestamp }),
  // });
}
