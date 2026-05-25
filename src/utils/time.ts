export function formatDuration(totalSeconds: number): string {
  if (!Number.isInteger(totalSeconds)) {
    throw new Error('Duration must be an integer number of seconds');
  }

  if (totalSeconds < 0) {
    throw new Error('Duration cannot be negative');
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  return `${pad(minutes)}:${pad(seconds)}`;
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
