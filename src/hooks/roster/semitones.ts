import { randomInt } from '@/utils/math';
import {
  enumerateIntervals,
  getAlteration,
  isAltered,
  isSameNote,
  Pair,
  randomAlteration,
} from '@/utils/music';

import { parseInput, Range, Roster, useRoster } from './common';
import { rosterAsArray as noteRosterAsArray } from './notes';

export function useSemitoneRoster(): number[] {
  const [roster] = useRosterInternal();
  return roster ? rosterAsArray(roster) : [];
}

export function useSemitonesInput(): [string, (input: string) => void] {
  const [_, input, setInput] = useRosterInternal();
  return [input, setInput];
}

export function parseSemitonesInput(input: string): Roster<number> | string {
  return parseInput(input, fromInput);
}

export function randomIntervalFromRoster(
  notesRoster?: Roster<string> | null,
  semitones?: number[] | null,
  previous?: Pair
): Pair {
  if (!notesRoster || !semitones) {
    return { from: '', to: '' };
  }
  const alteration =
    previous && isAltered(previous.to) ? getAlteration(previous.to) : randomAlteration();
  const notes = noteRosterAsArray(notesRoster, { alteration });
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

function rosterAsArray(roster: Roster<number>): number[] {
  return roster instanceof Array ? roster : rangeAsArray(roster);
}

function rangeAsArray({ from: start, to: end }: Range<number>) {
  return [...Array(1 + end - start).keys()].map((v) => start + v);
}

const defaultRoster: Range<number> = { from: 1, to: 12 };

function useRosterInternal(): [Roster<number> | null, string, (input: string) => void] {
  return useRoster('semitone', defaultRoster, fromInput);
}

function fromInput(roster: Roster<string>): Roster<number> | string {
  return roster instanceof Array ? fromArray(roster) : fromRange(roster);
}

function fromRange(range: Range<string>): Range<number> | string {
  const from = parseSemitone(range.from);
  if (typeof from === 'string') {
    return from;
  }
  const to = parseSemitone(range.to);
  if (typeof to === 'string') {
    return to;
  }
  if (from >= to) {
    return 'From should be lower than to!';
  }
  return { from, to };
}

function parseSemitone(semitone: string): number | string {
  const parsed = parseInt(semitone, 10);
  if (isNaN(parsed)) {
    return `Invalid semitone '${semitone}'`;
  }
  if (parsed < 1) {
    return 'Only positive semitones are supported!';
  }
  return parsed;
}

function fromArray(semitones: string[]): number[] | string {
  const parsed = semitones.map(parseSemitone);
  const error = parsed.find((s) => typeof s === 'string');
  if (error) {
    return error;
  }
  return [...new Set(parsed.map(Number))];
}
