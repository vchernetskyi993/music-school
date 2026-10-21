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

import { parseInput, Roster, Range, useRoster, Element, isRange } from './common';

export function useNoteRoster(): Roster<string> | null {
  const [roster] = useRosterInternal();
  return roster;
}

export function useNotesInput(): [string, (input: string) => void] {
  const [_, input, setInput] = useRosterInternal();
  return [input, setInput];
}

type InputChecks = { semitones?: number[] | null };

export function parseNotesInput(input: string, checks: InputChecks = {}): Roster<string> | string {
  return parseInput(
    input,
    (e) => {
      if (isRange(e)) {
        return wrapError(validateRange(e)) || e;
      }
      return wrapError(validateNote(e)) || e;
    },
    (roster) => wrapError(validateNotesCount(roster) || validateIntervals(roster, checks))
  );
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
  return roster.flatMap((e) => (isRange(e) ? arrayRosterFromRange(e.from, e.to, opts) : [e]));
}

export function firstNoteFromRoster(roster?: Roster<string> | null): string {
  if (!roster) {
    return '';
  }
  const e = roster[0];
  return isRange(e) ? e.from : e;
}

const defaultRoster: Roster<string> = [{ from: 'E2', to: 'E5' }];

function useRosterInternal(): [Roster<string> | null, string, (input: string) => void] {
  return useRoster('note', defaultRoster, fromInput);
}

function fromInput(e: Element<string>): Element<string> | Error {
  if (isRange(e)) {
    return wrapError(validateRange(e)) || e;
  }
  return wrapError(validateNote(e)) || e;
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

function wrapError(message: string): Error | null {
  return message ? new Error(message) : null;
}

function validateRange({ from, to }: Range<string>): string {
  return validateNote(from) || validateNote(to) || validateFromLowerThanTo(from, to) || '';
}

function validateFromLowerThanTo(from: string, to: string): string {
  if (getFrequency(from)! >= getFrequency(to)!) {
    return 'From should be lower than to!';
  }
  return '';
}

function validateNotesCount(roster: Roster<string>): string {
  if (new Set(rosterAsArray(roster).map(getFrequency)).size < 2) {
    return 'At least 2 notes are required!';
  }
  return '';
}

function validateIntervals(roster: Roster<string>, checks: InputChecks): string {
  if (!checks.semitones) {
    return '';
  }
  const intervals = enumerateIntervals(rosterAsArray(roster), checks.semitones);
  if (intervals.length < 2) {
    return 'At least two valid intervals are required!';
  }
  return '';
}
