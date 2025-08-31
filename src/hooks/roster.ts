import { useEffect, useState } from 'react';
import { Note as TonalNote } from 'tonal';
import { useLocalStorage } from '@mantine/hooks';
import { Altered, Note, randomNoteFromArray, randomNoteFromRange } from '@/utils/music';

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

export function parseRosterInput(input: string): Roster | string {
  if (input.includes('-')) {
    const [from, to] = input.split('-');
    return validateNote(from) || validateNote(to) || validateRange(from, to) || { from, to };
  }
  const notes = input.split(',');
  return validateAlteration(input) || notes.map(validateNote).find((e) => !!e) || notes;
}

export function randomNoteFromRoster(roster?: Roster | null, previous?: string): Note {
  if (!roster) {
    return { spn: '', altered: Altered.Sharp };
  }
  return reduceRoster(
    roster,
    (notes) => randomNoteFromArray(notes, previous),
    (range) => randomNoteFromRange(range.from, range.to, previous)
  );
}

export function firstNoteFromRoster(roster?: Roster | null): string {
  if (!roster) {
    return '';
  }
  return reduceRoster(
    roster,
    (notes) => notes[0],
    (range) => range.from
  );
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
  return reduceRoster(
    roster,
    (notes) => notes.join(','),
    (range) => `${range.from}-${range.to}`
  );
}

function reduceRoster<T>(
  roster: Roster,
  arrayReducer: (notes: string[]) => T,
  rangeReducer: (range: Range) => T
): T {
  if (roster instanceof Array) {
    return arrayReducer(roster as string[]);
  }
  return rangeReducer(roster as Range);
}

function validateNote(note: string): string {
  if (!TonalNote.get(note).freq) {
    return `Invalid note '${note}'!`;
  }
  return '';
}

function validateRange(from: string, to: string): string {
  if (TonalNote.get(from).freq! > TonalNote.get(to).freq!) {
    return 'From should be smaller than to!';
  }
  return '';
}

function validateAlteration(input: string): string {
  if (input.includes('#') && input.includes('b')) {
    return 'Either flats or sharps are allowed!';
  }
  return '';
}
