import { useEffect, useState } from 'react';
import { Divider, Group, Stack, Title } from '@mantine/core';
import { CapturedNote } from '@/components/CapturedNote';
import { Counter } from '@/components/Counter';
import { Settings } from '@/components/Settings';
import { useCounter } from '@/hooks/counter';
import { randomIntervalFromRoster, useRoster } from '@/hooks/roster';
import { useSettings } from '@/hooks/settings';
import { getAlteration, toFixedDo, toInterval } from '@/utils/music';

export function Intervals() {
  const roster = useRoster();
  const [notes, setNotes] = useState(() => randomIntervalFromRoster(roster));
  const [from, setFrom] = useState(() => true);
  const [actual, setActual] = useState('');
  const settings = useSettings();
  const counter = useCounter();

  useEffect(() => {
    if (from && notes.from === actual) {
      setFrom(false);
    }
    if (!from && notes.to === actual) {
      counter.increment();
      setFrom(true);
      setNotes(randomIntervalFromRoster(roster, notes));
    }
  }, [actual, notes]);
  return (
    <Stack gap="md" m="sm">
      <Settings notation />
      <Group justify="center">
        {from ? (
          <ExpectedText text={settings.notation === 'SPN' ? notes.from : toFixedDo(notes.from)} />
        ) : (
          <ExpectedText text={toInterval(notes)} />
        )}
      </Group>
      <Divider size="md" />
      <CapturedNote
        setNote={setActual}
        expectedNote={from ? notes.from : notes.to}
        alteration={getAlteration(from ? notes.from : notes.to)}
      />
      {settings.counter && <Counter counter={counter} />}
    </Stack>
  );
}

// TODO: move to commons
function ExpectedText({ text }: { text: string }) {
  return (
    <Title c="grape" ta="center" order={3}>
      {text}
    </Title>
  );
}
