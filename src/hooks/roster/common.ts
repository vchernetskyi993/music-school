import { useLocalStorage } from '@mantine/hooks';
import { useMemo } from 'react';

import { Roster } from '@/components/roster/Roster';

export type Roster<T> = Element<T>[];
export type Element<T> = Range<T> | T;
export type Range<T> = { from: T; to: T };

export function isRange<T>(e: Element<T>): e is Range<T> {
  return typeof e === 'object';
}

type FromInput<T> = (element: Element<string>) => Element<T> | Error;
type ValidateRoster<T> = (roster: Roster<T>) => null | Error;

export function parseInput<T>(
  input: string,
  fromInput: FromInput<T>,
  validate: ValidateRoster<T> = () => null
): Roster<T> | string {
  const parsed = input.split(',').map((element) => {
    const regex = /(.+?)\s*-\s*(.+)/g;
    const matches = [...element.matchAll(regex)];
    if (matches.length === 0) {
      return fromInput(element);
    }
    const [_, from, to] = matches[0];
    return fromInput({ from, to });
  });
  const error = parsed.find((e) => e instanceof Error);
  if (error) {
    return error.message;
  }
  const result = parsed as Roster<T>;
  const validationError = validate(result);
  if (validationError) {
    return validationError.message;
  }
  return result;
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
  const roster = useMemo(() => rosterFromInput(input, fromInput), [input]);
  return [roster, input, setInput];
}

function rosterToString<T>(roster: Roster<T>): string {
  return roster.map((e) => (isRange(e) ? `${e.from}-${e.to}` : e)).join(',');
}

function rosterFromInput<T>(input: string, fromInput: FromInput<T>): Roster<T> | null {
  const parsed = parseInput(input, fromInput);
  return typeof parsed === 'string' ? null : parsed;
}
