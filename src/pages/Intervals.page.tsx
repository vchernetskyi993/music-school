import { useEffect, useState } from 'react';
import { ExpectedInterval } from '@/components/expectations/ExpectedInterval';
import { Task } from '@/components/Task';
import { useCounter } from '@/hooks/counter';
import { randomIntervalFromRoster, useRoster } from '@/hooks/roster';
import { IntervalState } from '@/utils/music';

export function Intervals() {
  const roster = useRoster();
  const [notes, setNotes] = useState(() => randomIntervalFromRoster(roster));
  const [state, setState] = useState(() => IntervalState.From);
  const [actual, setActual] = useState('');
  const counter = useCounter();

  useEffect(() => {
    if (state === IntervalState.From && notes.from === actual) {
      setState(IntervalState.To);
    }
    if (state === IntervalState.To && notes.to === actual) {
      counter.increment();
      setState(IntervalState.From);
      setNotes(randomIntervalFromRoster(roster, notes));
    }
  }, [actual, notes]);
  return (
    <Task
      expectedNote={state === IntervalState.From ? notes.from : notes.to}
      settingsConf={{ notation: true, intervals: true }}
      setActual={setActual}
      expectation={<ExpectedInterval notes={notes} state={state} />}
    />
  );
}
