import { expect, test } from 'vitest';
import { formatDuration } from './time';

test('formats durations under one minute', () => {
  expect(formatDuration(0)).toBe('00:00');
  expect(formatDuration(1)).toBe('00:01');
  expect(formatDuration(9)).toBe('00:09');
  expect(formatDuration(10)).toBe('00:10');
  expect(formatDuration(59)).toBe('00:59');
});

test('formats durations under one hour', () => {
  expect(formatDuration(60)).toBe('01:00');
  expect(formatDuration(61)).toBe('01:01');
  expect(formatDuration(599)).toBe('09:59');
  expect(formatDuration(3599)).toBe('59:59');
});

test('formats durations of one hour or more', () => {
  expect(formatDuration(3600)).toBe('01:00:00');
  expect(formatDuration(3601)).toBe('01:00:01');
  expect(formatDuration(3665)).toBe('01:01:05');
  expect(formatDuration(86399)).toBe('23:59:59');
  expect(formatDuration(86400)).toBe('24:00:00');
});

test('rejects negative durations', () => {
  expect(() => formatDuration(-1)).toThrow('Duration cannot be negative');
});

test('rejects decimal durations', () => {
  expect(() => formatDuration(1.5)).toThrow('Duration must be an integer number of seconds');
});

test('rejects non-finite durations', () => {
  expect(() => formatDuration(Number.NaN)).toThrow('Duration must be an integer number of seconds');
  expect(() => formatDuration(Number.POSITIVE_INFINITY)).toThrow(
    'Duration must be an integer number of seconds'
  );
});
