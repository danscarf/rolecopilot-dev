// app/_lib/haptics.ts

/**
 * Triggers haptic feedback (device vibration) if supported by the browser.
 * @param duration The duration of the vibration in milliseconds. Defaults to 200ms.
 */
export function vibrate(duration: number = 200): void {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(duration);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
      // Gracefully handle cases where vibrate API might be restricted or throw errors
    }
  } else {
    // console.log('Haptic feedback not supported on this device.');
  }
}
