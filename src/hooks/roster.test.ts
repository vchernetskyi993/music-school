import { expect, test } from 'vitest';
import { parseRosterInput } from './roster';

test('rejects notes without octave', () => {
  expect(parseRosterInput('F')).toBe("Invalid note 'F'!");
});

test('accepts notes outside the MIDI range without sound support validation', () => {
  expect(parseRosterInput('F12')).toEqual(['F12']);
});

test('rejects unsupported notes outside the MIDI range with sound support validation', () => {
  expect(parseRosterInput('F12', { requireSoundSupport: true })).toBe("Unsupported note 'F12'");
});
