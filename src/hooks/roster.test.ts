import { expect, test } from 'vitest';
import { parseRosterInput } from './roster';

test('rejects notes above the supported playback range', () => {
  expect(parseRosterInput('E12')).toBe("Unsupported note 'E12'");
});

test('rejects ranges above the supported playback range', () => {
  expect(parseRosterInput('E2-E12')).toBe("Unsupported note 'E12'");
});

test('allows notes within the supported playback range', () => {
  expect(parseRosterInput('A0,C4,C8')).toEqual(['A0', 'C4', 'C8']);
});
