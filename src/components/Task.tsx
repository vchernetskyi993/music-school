import { ReactNode } from 'react';
import { Divider, Group, Stack } from '@mantine/core';
import { useCounter } from '@/hooks/counter';
import { useSettings } from '@/hooks/settings';
import { getAlteration } from '@/utils/music';
import { CapturedNote } from './CapturedNote';
import { Counter } from './Counter';
import { Settings } from './Settings';

export function Task({
  expectedNote,
  notation,
  setActual,
  expectation,
}: {
  expectedNote: string;
  notation: boolean;
  setActual: (note: string) => void;
  expectation: ReactNode;
}) {
  const settings = useSettings();
  const counter = useCounter();

  return (
    <Stack gap="md" m="sm">
      <Settings notation={notation} />
      <Group justify="center">{expectation}</Group>
      <Divider size="md" />
      <CapturedNote
        setNote={setActual}
        expectedNote={expectedNote}
        alteration={getAlteration(expectedNote)}
      />
      {settings.counter && <Counter counter={counter} />}
    </Stack>
  );
}
