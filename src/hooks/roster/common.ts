import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';

import { Roster } from '@/components/roster/Roster';

export type Roster<T> = T[] | Range<T>;
export type Range<T> = { from: T; to: T };

type FromInput<T> = (roster: Roster<string>) => Roster<T> | string;

export function parseInput<T>(input: string, fromInput: FromInput<T>): Roster<T> | string {
  if (input.includes(',')) {
    return fromInput(input.split(','));
  }
  if (input.includes('-')) {
    const [from, to] = input.split('-');
    return fromInput({ from, to });
  }
  return fromInput([input]);
}

export function useRoster<T>(
  key: string,
  defaultRoster: Roster<T>,
  fromInput: FromInput<T>
): [Roster<T> | null, string, (input: string) => void] {
  const [input, setInput] = useLocalStorage({
    key: `${key}-roster`,
    defaultValue: rosterToString(defaultRoster),
  });
  const [roster, setRoster] = useState<Roster<T> | null>(rosterFromInput(input, fromInput));
  useEffect(() => setRoster(rosterFromInput(input, fromInput)), [input]);
  return [roster, input, setInput];
}

function rosterToString<T>(roster: Roster<T>): string {
  return roster instanceof Array ? roster.join(',') : `${roster.from}-${roster.to}`;
}

function rosterFromInput<T>(input: string, fromInput: FromInput<T>): Roster<T> | null {
  const parsed = parseInput(input, fromInput);
  return typeof parsed === 'string' ? null : parsed;
}
