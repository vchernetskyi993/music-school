import { useMemo } from 'react';

import { randomInt } from '@/utils/math';
import {
  enumerateIntervals,
  getAlteration,
  isAltered,
  isSameNote,
  Pair,
  randomAlteration,
} from '@/utils/music';

import { parseInput, Element, Range, Roster, useRoster } from './common';
import { rosterAsArray as noteRosterAsArray } from './notes';

export function useSemitoneRoster(): number[] | null {
  const [roster] = useRosterInternal();
  return useMemo(() => (roster ? rosterAsArray(roster) : roster), [roster]);
}

export function useSemitonesInput(): [string, (input: string) => void] {
  const [_, input, setInput] = useRosterInternal();
  return [input, setInput];
}

export function parseSemitonesInput(input: string): Roster<number> | string {
  return parseInput(input, fromInput);
}

const emptyInterval = { from: '', to: '' };

export function randomIntervalFromRoster(
  notesRoster?: Roster<string> | null,
  semitones?: number[] | null,
  previous?: Pair
): Pair {
  if (!notesRoster || !semitones) {
    return emptyInterval;
  }
  const alteration =
    previous && isAltered(previous.to) ? getAlteration(previous.to) : randomAlteration();
  const notes = noteRosterAsArray(notesRoster, { alteration });
  const intervals = enumerateIntervals(notes, semitones);
  if (intervals.length === 0) {
    return emptyInterval;
  }
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
  return roster.flatMap((e) => (typeof e === 'number' ? [e] : rangeAsArray(e)));
}

function rangeAsArray({ from: start, to: end }: Range<number>) {
  return [...Array(1 + end - start).keys()].map((v) => start + v);
}

const defaultRoster: Roster<number> = [{ from: 1, to: 12 }];

function useRosterInternal(): [Roster<number> | null, string, (input: string) => void] {
  return useRoster('semitone', defaultRoster, fromInput);
}

function fromInput(element: Element<string>): Element<number> | Error {
  return typeof element === 'string' ? parseSemitone(element) : parseRange(element);
}

function parseRange(range: Range<string>): Range<number> | Error {
  const from = parseSemitone(range.from);
  if (from instanceof Error) {
    return from;
  }
  const to = parseSemitone(range.to);
  if (to instanceof Error) {
    return to;
  }
  if (from >= to) {
    return new Error('From should be lower than to!');
  }
  return { from, to };
}

function parseSemitone(semitone: string): number | Error {
  const parsed = parseInt(semitone, 10);
  if (isNaN(parsed)) {
    return new Error(`Invalid semitone '${semitone}'`);
  }
  if (parsed < 1) {
    return new Error('Only positive semitones are supported!');
  }
  return parsed;
}
