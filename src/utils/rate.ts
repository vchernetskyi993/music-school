export function calculateCountPerMinute(count: number, totalSeconds: number): number {
  if (!Number.isInteger(count)) {
    throw new Error('Count must be an integer');
  }

  if (count < 0) {
    throw new Error('Count cannot be negative');
  }

  if (!Number.isInteger(totalSeconds)) {
    throw new Error('Duration must be an integer number of seconds');
  }

  if (totalSeconds < 0) {
    throw new Error('Duration cannot be negative');
  }

  if (totalSeconds === 0) {
    return 0;
  }

  return Math.round((count / totalSeconds) * 60 * 100) / 100;
}

export function formatCountPerMinute(count: number, totalSeconds: number): string {
  return calculateCountPerMinute(count, totalSeconds).toFixed(2);
}
