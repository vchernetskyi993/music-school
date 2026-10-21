import { expect, test } from 'vitest';

import { parseSemitonesInput } from './semitones';

test('parses range', () => {
  expect(parseSemitonesInput('1-10')).toEqual([{ from: 1, to: 10 }]);
});

test('parses array', () => {
  expect(parseSemitonesInput('3,4,10')).toEqual([3, 4, 10]);
});

test('parses list of ranges', () => {
  expect(parseSemitonesInput('1-3,10-12')).toEqual([
    { from: 1, to: 3 },
    { from: 10, to: 12 },
  ]);
});

test('parses range and semitone', () => {
  expect(parseSemitonesInput('12,11,2-3')).toEqual([12, 11, { from: 2, to: 3 }]);
});

test('supports whitespace', () => {
  expect(parseSemitonesInput('12, 11, 2-3')).toEqual([12, 11, { from: 2, to: 3 }]);
});

test.each([['3-1'], ['3-3']])('requires range to grow from the left', (range) => {
  expect(parseSemitonesInput(range)).toBe('From should be lower than to!');
});

test.each([['a-1'], ['5,b,3']])('rejects non-number semitones', (roster) => {
  expect(parseSemitonesInput(roster)).toContain('Invalid semitone');
});

test('rejects negative semitones', () => {
  expect(parseSemitonesInput('5,-4,3')).toBe('Only positive semitones are supported!');
});
