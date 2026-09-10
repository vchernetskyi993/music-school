import { useEffect, useState } from 'react';
import { ExpectedInterval } from '@/components/expectations/ExpectedInterval';
import { Task } from '@/components/Task';
import { useCounter } from '@/hooks/counter';
import { randomIntervalFromRoster, useRoster } from '@/hooks/roster';
import { IntervalState } from '@/utils/music';

export function Intervals() {
  const roster = useRoster();
  const [interval, setInterval] = useState(() => randomIntervalFromRoster(roster));
  const [state, setState] = useState(() => IntervalState.From);
  const [previousNote, setPreviousNote] = useState<string>();
  const [actual, setActual] = useState('');
  const counter = useCounter();

  useEffect(() => {
    if (state === IntervalState.From && interval.from === actual) {
      setState(IntervalState.To);
      setPreviousNote(interval.from);
    }
    if (state === IntervalState.To && interval.to === actual) {
      counter.increment();
      setState(IntervalState.From);
      setPreviousNote(interval.to);
      setInterval(randomIntervalFromRoster(roster, interval));
    }
  }, [actual, interval]);
  return (
    <Task
      expectedNote={state === IntervalState.From ? interval.from : interval.to}
      previousNote={previousNote}
      settingsConf={{ notation: true, intervals: true }}
      setActual={setActual}
      expectation={<ExpectedInterval notes={interval} state={state} />}
      counter={counter}
    />
  );
}
