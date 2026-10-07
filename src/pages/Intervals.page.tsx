import { useEffect, useState } from 'react';

import { ExpectedInterval } from '@/components/expectations/ExpectedInterval';
import { Task } from '@/components/Task';
import { useCounter } from '@/hooks/counter';
import { useNoteRoster } from '@/hooks/roster/notes';
import { randomIntervalFromRoster, useSemitoneRoster } from '@/hooks/roster/semitones';
import { IntervalState } from '@/utils/music';

export function Intervals() {
  const roster = useNoteRoster();
  const semitones = useSemitoneRoster();
  const [interval, setInterval] = useState(() => randomIntervalFromRoster(roster, semitones));
  const [state, setState] = useState(() => IntervalState.From);
  const [previousNote, setPreviousNote] = useState<string>();
  const [actual, setActual] = useState('');
  const counter = useCounter();

  const refresh = () => {
    setState(IntervalState.From);
    setPreviousNote(state === IntervalState.From ? interval.from : interval.to);
    setInterval(randomIntervalFromRoster(roster, semitones, interval));
  };

  useEffect(refresh, [roster]);
  useEffect(() => {
    if (state === IntervalState.From && interval.from === actual) {
      setState(IntervalState.To);
      setPreviousNote(interval.from);
    }
    if (state === IntervalState.To && interval.to === actual) {
      counter.increment();
      refresh();
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
