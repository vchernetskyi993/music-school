import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';

import { randomInt } from '@/utils/math';
import {
  Alteration,
  arrayRosterFromRange,
  enumerateIntervals,
  getAlteration,
  isAltered,
  isSameNote,
  Pair,
  randomAlteration,
} from '@/utils/music';
import { Roster } from '.';

type SemitoneRoster = Roster<number>;

export function useSemitoneRoster(): SemitoneRoster | null {
  const [roster] = useRosterInternal();
  return roster;
}

export function useSemitonesInput(): [string, (input: string) => void] {
  const [_, input, setInput] = useRosterInternal();
  return [input, setInput];
}

export function parseSemitonesInput(input: string): number[] | string {
  if (input.includes('-')) {
    const [from, to] = input.split('-');
    return fromRange(from, to);
  }
  const notes = input.split(',');
  return fromArray(notes);
}

export function randomIntervalFromRoster(
  roster?: NoteRoster | null,
  semitones?: number[],
  previous?: Pair
): Pair {
  if (!roster || !semitones) {
    return { from: '', to: '' };
  }
  const alteration =
    previous && isAltered(previous.to) ? getAlteration(previous.to) : randomAlteration();
  const notes = rosterAsArray(roster, { alteration });
  const intervals = enumerateIntervals(notes, semitones);
  return randomInterval(intervals, previous);
}

function randomInterval(intervals: Pair[], previous?: Pair): Pair {
  const interval = intervals[randomInt(0, intervals.length - 1)];
  if (
    previous &&
    isSameNote(interval.from, previous.from) &&
    isSameNote(interval.to, previous.to)
  ) {
    return randomInterval(intervals, previous);
  }
  return interval;
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

const defaultRoster: SemitoneRoster = { from: 1, to: 12 };

function useRosterInternal(): [SemitoneRoster | null, string, (input: string) => void] {
  const [input, setInput] = useLocalStorage({
    key: 'semitone-roster',
    defaultValue: rosterToString(defaultRoster),
  });
  const [roster, setRoster] = useState<SemitoneRoster | null>(rosterFromInput(input));
  useEffect(() => setRoster(rosterFromInput(input)), [input]);
  return [roster, input, setInput];
}

function rosterFromInput(input: string): NoteRoster | null {
  const parsed = parseRosterInput(input);
  return typeof parsed === 'string' ? null : (parsed as NoteRoster);
}

function rosterToString(roster: NoteRoster): string {
  return roster instanceof Array ? roster.join(',') : `${roster.from}-${roster.to}`;
}

function validateSemitone(semitone: string): string {
  return '';
}

function fromRange(from: string, to: string): string {
  return validateSemitone(from) || validateSemitone(to) || validateFromLowerThanTo(from, to) || '';
}

function validateFromLowerThanTo(from: string, to: string): string {
  return '';
}

function fromArray(semitones: string[]): number[] | string {
  return '';
}
