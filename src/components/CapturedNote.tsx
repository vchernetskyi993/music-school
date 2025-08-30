import { useEffect } from 'react';
import { Loader, MantineColor, Stack, Text } from '@mantine/core';
import { useSound } from '@/hooks/pitch';
import { Altered, frequencyDiff, nextNote, noteFromFrequency } from '@/utils/music';

export function CapturedNote({
  color = 'grape',
  from = 'E2',
  pause = false,
  altered = Altered.Sharp,
  showFrequency = false,
  setNote = () => {},
}: {
  from?: string;
  color?: MantineColor;
  pause?: boolean;
  altered?: Altered;
  showFrequency?: boolean;
  setNote?: (note: string) => void;
}) {
  const sound = useSound({ step: frequencyDiff(from, nextNote(from)), pause });
  const note = sound ? noteFromFrequency(sound, altered) : '';
  useEffect(() => setNote(note), [note]);
  return (
    <Stack gap="xs">
      {note && (
        <Text c={color} ta="center" size="xl" mt="sm">
          {note}
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
