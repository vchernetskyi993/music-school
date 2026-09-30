import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';

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
import { Roster } from '.';

type NoteRoster = Roster<string>;

export function useNoteRoster(): NoteRoster | null {
  const [roster] = useRosterInternal();
  return roster;
}

export function useNotesInput(): [string, (input: string) => void] {
  const [_, input, setInput] = useRosterInternal();
  return [input, setInput];
}

type InputChecks = { semitones?: number[] };

export function parseNotesInput(input: string, checks: InputChecks = {}): NoteRoster | string {
  if (input.includes('-')) {
    const [from, to] = input.split('-');
    return validateRange(from, to, checks) || { from, to };
  }
  const notes = input.split(',');
  return validateArray(notes, checks) || notes;
}

export function randomNoteFromRoster(roster?: NoteRoster | null, previous?: string): string {
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

function rosterAsArray(roster: NoteRoster, opts: { alteration?: Alteration } = {}): string[] {
  return roster instanceof Array ? roster : arrayRosterFromRange(roster.from, roster.to, opts);
}

export function firstNoteFromRoster(roster?: NoteRoster | null): string {
  if (!roster) {
    return '';
  }
  return roster instanceof Array ? roster[0] : roster.from;
}

const defaultRoster: NoteRoster = { from: 'E2', to: 'E5' };

function useRosterInternal(): [NoteRoster | null, string, (input: string) => void] {
  const [input, setInput] = useLocalStorage({
    key: 'note-roster',
    defaultValue: rosterToString(defaultRoster),
  });
  const [roster, setRoster] = useState<NoteRoster | null>(rosterFromInput(input));
  useEffect(() => setRoster(rosterFromInput(input)), [input]);
  return [roster, input, setInput];
}

function rosterFromInput(input: string): NoteRoster | null {
  const parsed = parseNotesInput(input);
  return typeof parsed === 'string' ? null : (parsed as NoteRoster);
}

function rosterToString(roster: NoteRoster): string {
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

function validateIntervals(roster: NoteRoster, checks: InputChecks) {
  if (!checks.semitones) {
    return '';
  }
  const intervals = enumerateIntervals(rosterAsArray(roster), checks.semitones);
  if (intervals.length < 2) {
    return 'At least two valid intervals are required!';
  }
}
