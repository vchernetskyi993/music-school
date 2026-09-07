import { useEffect, useState } from 'react';
import { ExpectedNote } from '@/components/expectations/ExpectedNote';
import { ExpectedText } from '@/components/expectations/ExpectedText';
import { Task } from '@/components/Task';
import { useCounter } from '@/hooks/counter';
import { randomIntervalFromRoster, useRoster } from '@/hooks/roster';
import { toInterval } from '@/utils/music';

enum State {
  From = 0,
  To,
}

export function Intervals() {
  const roster = useRoster();
  const [notes, setNotes] = useState(() => randomIntervalFromRoster(roster));
  const [state, setState] = useState(() => State.From);
  const [actual, setActual] = useState('');
  const counter = useCounter();

  useEffect(() => {
    if (state === State.From && notes.from === actual) {
      setState(State.To);
    }
    if (state === State.To && notes.to === actual) {
      counter.increment();
      setState(State.From);
      setNotes(randomIntervalFromRoster(roster, notes));
    }
  }, [actual, notes]);
  return (
    <Task
      expectedNote={state === State.From ? notes.from : notes.to}
      settingsConf={{ notation: true, intervals: true }}
      setActual={setActual}
      expectation={
        state === State.From ? (
          <ExpectedNote note={notes.from} />
        ) : (
          <ExpectedText text={toInterval(notes)} />
        )
      }
    />
  );
}
