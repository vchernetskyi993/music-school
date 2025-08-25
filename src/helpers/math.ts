export function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const isEven = arr.length % 2 === 0;
  const middle = Math.floor(arr.length / 2);
  return isEven ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}
