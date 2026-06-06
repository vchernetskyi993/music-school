import { act, renderHook } from '@testing-library/react';
import { expect, test } from 'vitest';
import { useCounter } from './counter';

test('initializes counter correctly', () => {
  const { result: counter } = renderHook(() => useCounter());

  expect(counter.current.paused).toBe(true);
  expect(counter.current.count).toBe(0);
});

test('increments counter', () => {
  const { result: counter } = renderHook(() => useCounter());

  act(() => counter.current.start());
  act(() => counter.current.increment());

  expect(counter.current.count).toBe(1);
});

test('does not increment counter when paused', () => {
  const { result: counter } = renderHook(() => useCounter());

  act(() => counter.current.increment());

  expect(counter.current.count).toBe(0);
});

test('resets counter', () => {
  const { result: counter } = renderHook(() => useCounter());

  act(() => counter.current.start());
  act(() => counter.current.increment());
  act(() => counter.current.reset());

  expect(counter.current.count).toBe(0);
});

test('pauses counter with stored state', () => {
  const { result: counter } = renderHook(() => useCounter());

  act(() => counter.current.start());
  act(() => counter.current.increment());
  act(() => counter.current.pause());

  expect(counter.current.count).toBe(1);
});

test('resets counter when paused', () => {
  const { result: counter } = renderHook(() => useCounter());

  act(() => counter.current.start());
  act(() => counter.current.increment());
  act(() => counter.current.pause());
  act(() => counter.current.reset());

  expect(counter.current.count).toBe(0);
});
