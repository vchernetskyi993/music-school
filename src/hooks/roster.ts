import { useEffect, useState } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import {
  Alteration,
  arrayRosterFromRange,
  enumerateIntervals,
  getAlteration,
  getFrequency,
  getMidi,
  isAltered,
  Pair,
  randomAlteration,
  randomNoteFromArray,
} from '@/utils/music';

export type Roster = string[] | Range;
export type Range = { from: string; to: string };

export function useRoster(): Roster | null {
  const [roster] = useRosterInternal();
  return roster;
}

export function useRosterInput(): [string, (input: string) => void] {
  const [_, input, setInput] = useRosterInternal();
  return [input, setInput];
}

type InputChecks = { intervals?: boolean };

export function parseRosterInput(input: string, checks: InputChecks = {}): Roster | string {
  if (input.includes('-')) {
    const [from, to] = input.split('-');
    return validateRange(from, to, checks) || { from, to };
  }
  const notes = input.split(',');
  return validateArray(notes, checks) || notes;
}

export type Note = { alteration: Alteration; spn: string };

export function randomNoteFromRoster(roster?: Roster | null, previous?: string): Note {
  if (!roster) {
    return { spn: '', alteration: Alteration.Sharp };
  }
  const alteration = previous && isAltered(previous) ? getAlteration(previous) : randomAlteration();
  return { alteration, spn: randomNoteFromArray(rosterAsArray(roster, { alteration }), previous) };
}

export function randomIntervalFromRoster(_roster?: Roster | null, _previous?: Pair): Pair {
  // TODO: randomize
  return { from: 'E2', to: 'F#2' };
}

function rosterAsArray(roster: Roster, opts: { alteration?: Alteration } = {}): string[] {
  return roster instanceof Array ? roster : arrayRosterFromRange(roster.from, roster.to, opts);
}

export function firstNoteFromRoster(roster?: Roster | null): string {
  if (!roster) {
    return '';
  }
  return roster instanceof Array ? roster[0] : roster.from;
}

const defaultRoster: Roster = { from: 'E2', to: 'E5' };

function useRosterInternal(): [Roster | null, string, (input: string) => void] {
  const [input, setInput] = useLocalStorage({
    key: 'note-roster',
    defaultValue: rosterToString(defaultRoster),
  });
  const [roster, setRoster] = useState<Roster | null>(rosterFromInput(input));
  useEffect(() => setRoster(rosterFromInput(input)), [input]);
  return [roster, input, setInput];
}

function rosterFromInput(input: string): Roster | null {
  const parsed = parseRosterInput(input);
  return typeof parsed === 'string' ? null : (parsed as Roster);
}

function rosterToString(roster: Roster): string {
  return roster instanceof Array ? roster.join(',') : `${roster.from}-${roster.to}`;
}

function validateNote(note: string): string {
  if (!getFrequency(note)) {
    return `Invalid note '${note}'`;
  }
  if (!getMidi(note)) {
    return `Unsupported note '${note}'`;
  }
  return '';
}

function validateRange(from: string, to: string, checks: InputChecks): string {
  return (
    validateNote(from) ||
    validateNote(to) ||
    validateFromLowerThanTo(from, to) ||
    validateIntervals({ from, to }, checks) ||
    ''
  );
}

function validateFromLowerThanTo(from: string, to: string): string {
  if (getFrequency(from)! >= getFrequency(to)!) {
    return 'From should be lower than to!';
  }
  return '';
}

function validateArray(notes: string[], checks: InputChecks): string {
  const parseError = notes.map(validateNote).find((e) => !!e);
  if (parseError) {
    return parseError;
  }
  const frequencies = new Set(notes.map(getFrequency));
  if (frequencies.size < 2) {
    return 'At least 2 notes are required!';
  }
  return validateIntervals(notes, checks) || '';
}

function validateIntervals(roster: Roster, checks: InputChecks) {
  if (!checks.intervals) {
    return '';
  }
  const intervals = enumerateIntervals(rosterAsArray(roster));
  if (intervals.length < 2) {
    return 'At least two valid intervals are required!';
  }
}
