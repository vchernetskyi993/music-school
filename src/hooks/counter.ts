import { useState } from 'react';

export interface ICounter {
  count: number;
  increment: () => void;
  paused: boolean;
  pause: () => void;
  start: () => void;
  reset: () => void;
}

export function useCounter(): ICounter {
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(true);
  return {
    count,
    increment: () => {
      if (!paused) {
        setCount((c) => c + 1);
      }
    },
    pause: () => setPaused(true),
    start: () => setPaused(false),
    reset: () => setCount(0),
    paused,
  };
}
