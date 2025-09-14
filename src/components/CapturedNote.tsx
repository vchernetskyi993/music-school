import { useEffect, useState } from 'react';
import { identity } from 'rxjs';
import { Note } from 'tonal';
import { Checkbox, Loader, MantineColor, Stack, Text } from '@mantine/core';
import { useSound } from '@/hooks/pitch';
import { trimDecimal } from '@/utils/math';
import { Altered, frequencyDiff, nextNote, noteFromFrequency } from '@/utils/music';

export function CapturedNote({
  color = 'grape',
  from = 'E2',
  pause = false,
  altered = Altered.Sharp,
  showFrequency = false,
  setNote = () => {},
  mapNote = identity,
  expectedNote = undefined,
}: {
  from?: string;
  color?: MantineColor;
  pause?: boolean;
  altered?: Altered;
  showFrequency?: boolean;
  setNote?: (note: string) => void;
  mapNote?: (note: string) => string;
  expectedNote?: string;
}) {
  const [hint, setHint] = useState(false);
  const sound = useSound({ step: frequencyDiff(from, nextNote(from)), pause });
  const note = sound ? noteFromFrequency(sound, altered) : '';
  const expectedFreq = expectedNote && Note.freq(expectedNote);
  const diff = expectedFreq && sound && trimDecimal(sound - expectedFreq);
  useEffect(() => setNote(note), [note]);
  return (
    <Stack gap="xs" align="center">
      {expectedFreq && (
        <Checkbox
          checked={hint}
          onChange={(event) => setHint(event.currentTarget.checked)}
          label="Frequency Hint"
        />
      )}
      {note && (
        <Text c={color} ta="center" size="xl" mt="sm">
          {mapNote(note)} {hint && diff && (diff < 0 ? '' : '+') + diff}
        </Text>
      )}
      {sound && showFrequency && (
        <Text c="lime" ta="center" size="lg">
          {sound}Hz
        </Text>
      )}
      {!note && (
        <Text c="dimmed" ta="center" size="md" mt="sm">
          Waiting for note...
        </Text>
      )}
      {!pause && <Loader color="blue" type="dots" mx="auto" />}
    </Stack>
  );
}
