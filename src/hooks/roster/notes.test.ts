import { expect, test } from 'vitest';

import { parseNotesInput } from './notes';

test('rejects ranges above the supported playback range', () => {
  expect(parseNotesInput('E2-E12')).toBe("Unsupported note 'E12'");
});

test('allows notes within the supported playback range', () => {
  expect(parseNotesInput('A0,C4,C8')).toEqual(['A0', 'C4', 'C8']);
});

test.each([['F2-E2'], ['E2-E2']])('requires range to grow from the left note', (range) => {
  expect(parseNotesInput(range)).toBe('From should be lower than to!');
});

test('rejects single note', () => {
  expect(parseNotesInput('E2')).toBe('At least 2 notes are required!');
});

test('rejects duplicate notes', () => {
  expect(parseNotesInput('E2,Fb2')).toBe('At least 2 notes are required!');
});

test.each([['E2,F#2'], ['E2,F#2,G3'], ['E2-F2']])('rejects less than 2 intervals', (roster) => {
  expect(parseNotesInput(roster, { semitones: [2, 12] })).toBe(
    'At least two valid intervals are required!'
  );
});
