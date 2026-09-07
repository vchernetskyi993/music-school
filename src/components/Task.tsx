import { ReactNode } from 'react';
import { Divider, Group, Stack } from '@mantine/core';
import { useCounter } from '@/hooks/counter';
import { useSettings } from '@/hooks/settings';
import { getAlteration } from '@/utils/music';
import { CapturedNote } from './CapturedNote';
import { Counter } from './Counter';
import { Settings, SettingsConf } from './Settings';

export function Task({
  expectedNote,
  settingsConf,
  setActual,
  expectation,
}: {
  expectedNote: string;
  settingsConf: SettingsConf;
  setActual: (note: string) => void;
  expectation: ReactNode;
}) {
  const settings = useSettings();
  const counter = useCounter();

  return (
    <Stack gap="md" m="sm">
      <Settings {...settingsConf} />
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
