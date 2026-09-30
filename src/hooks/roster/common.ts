import { Roster } from "@/components/roster/Roster";

export type Roster<T> = T[] | Range<T>;
type Range<T> = { from: T; to: T };

export function parseInput<T>(input: string, fromInput: (input: Roster<string>) => Roster<T>): Roster<T> | string {
  if (input.includes('-')) {
    const [from, to] = input.split('-');
    return fromInput({ from, to });
  }
  return fromInput(input.split(','));
}

