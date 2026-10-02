import { randomInt } from '@/utils/math';
import {
  Alteration,
  arrayRosterFromRange,
  enumerateIntervals,
  getAlteration,
  getFrequency,
  getMidi,
  isAltered,
  isSameNote,
  randomAlteration,
} from '@/utils/music';

import { parseInput, Roster, Range, useRoster } from './common';

export function useNoteRoster(): Roster<string> | null {
  const [roster] = useRosterInternal();
  return roster;
}

export function useNotesInput(): [string, (input: string) => void] {
  const [_, input, setInput] = useRosterInternal();
  return [input, setInput];
}

type InputChecks = { semitones?: number[] };

export function parseNotesInput(input: string, checks: InputChecks = {}): Roster<string> | string {
  return parseInput(input, (roster) => {
    if (roster instanceof Array) {
      return validateArray(roster, checks) || roster;
    }
    return validateRange(roster, checks) || roster;
  });
}

export function randomNoteFromRoster(roster?: Roster<string> | null, previous?: string): string {
  if (!roster) {
    return '';
  }
  const alteration = previous && isAltered(previous) ? getAlteration(previous) : randomAlteration();
  const notes = rosterAsArray(roster, { alteration });
  return randomNote(notes, previous);
}

function randomNote(notes: string[], previous?: string): string {
  const note = notes[randomInt(0, notes.length - 1)];
  if (previous && isSameNote(note, previous)) {
    return randomNote(notes, previous);
  }
  return note;
}

export function rosterAsArray(
  roster: Roster<string>,
  opts: { alteration?: Alteration } = {}
): string[] {
  return roster instanceof Array ? roster : arrayRosterFromRange(roster.from, roster.to, opts);
}

export function firstNoteFromRoster(roster?: Roster<string> | null): string {
  if (!roster) {
    return '';
  }
  return roster instanceof Array ? roster[0] : roster.from;
}

const defaultRoster: Range<string> = { from: 'E2', to: 'E5' };

function useRosterInternal(): [Roster<string> | null, string, (input: string) => void] {
  return useRoster('note', defaultRoster, fromInput);
}

function fromInput(roster: Roster<string>, checks: InputChecks = {}): Roster<string> | string {
  if (roster instanceof Array) {
    return validateArray(roster, checks) || roster;
  }
  return validateRange(roster, checks) || roster;
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

function validateRange({ from, to }: Range<string>, checks: InputChecks): string {
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

function validateIntervals(roster: Roster<string>, checks: InputChecks) {
  if (!checks.semitones) {
    return '';
  }
  const intervals = enumerateIntervals(rosterAsArray(roster), checks.semitones);
  if (intervals.length < 2) {
    return 'At least two valid intervals are required!';
  }
}
