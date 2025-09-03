export function median(arr: number[]): number {
  if (arr.length === 0) {
    throw new Error("Array can't be empty!'");
  }
  const sorted = [...arr].sort((a, b) => a - b);
  const isEven = arr.length % 2 === 0;
  const middle = Math.floor(arr.length / 2);
  return isEven ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
