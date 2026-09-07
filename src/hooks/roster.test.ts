import { expect, test } from 'vitest';
import { parseRosterInput } from './roster';

test('rejects ranges above the supported playback range', () => {
  expect(parseRosterInput('E2-E12')).toBe("Unsupported note 'E12'");
});

test('allows notes within the supported playback range', () => {
  expect(parseRosterInput('A0,C4,C8')).toEqual(['A0', 'C4', 'C8']);
});

test.each([['F2-E2'], ['E2-E2']])('requires range to grow from the left note', (range) => {
  expect(parseRosterInput(range)).toBe('From should be lower than to!');
});

test('rejects single note', () => {
  expect(parseRosterInput('E2')).toBe('At least 2 notes are required!');
});

test('rejects duplicate notes', () => {
  expect(parseRosterInput('E2,Fb2')).toBe('At least 2 notes are required!');
});

test.each([['E2,F#2'], ['E2,F#2,G3'], ['E2-F2']])('rejects less than 2 intervals', (roster) => {
  expect(parseRosterInput(roster, { intervals: true })).toBe(
    'At least two valid intervals are required!'
  );
});
