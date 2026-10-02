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

export function useSemitoneRoster(): Roster<number> | null {
  const [roster] = useRosterInternal();
  return roster;
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
  semitones?: Roster<number> | null,
  previous?: Pair
): Pair {
  if (!notesRoster || !semitones) {
    return { from: '', to: '' };
  }
  const alteration =
    previous && isAltered(previous.to) ? getAlteration(previous.to) : randomAlteration();
  const notes = noteRosterAsArray(notesRoster, { alteration });
  const intervals = enumerateIntervals(notes, rosterAsArray(semitones));
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

/* TODO: validate semitones
 * is number
 * lower < upper
 * is >= 1
 */
function fromRange(_range: Range<string>): Range<number> | string {
  return '';
}

function fromArray(_semitones: string[]): Range<number> | string {
  return '';
}
