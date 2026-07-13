import { useEffect } from 'react';
import { useWakeLock } from 'react-screen-wake-lock';
import { identity } from 'rxjs';
import { Loader, Stack, Text } from '@mantine/core';
import { useSound } from '@/hooks/pitch';
import { firstNoteFromRoster, useRoster } from '@/hooks/roster';
import { useSettings } from '@/hooks/settings';
import { trimDecimal } from '@/utils/math';
import {
  Altered,
  frequencyDiff,
  getFrequency,
  nextNote,
  noteFromFrequency,
  toFixedDo,
} from '@/utils/music';

export function CapturedNote({
  pause = false,
  altered = Altered.Sharp,
  showFrequency = false,
  setNote = () => {},
  expectedNote = undefined,
}: {
  pause?: boolean;
  altered?: Altered;
  showFrequency?: boolean;
  setNote?: (note: string) => void;
  expectedNote?: string;
}) {
  const settings = useSettings();
  const mapNote = settings.notation === 'Fixed Do' ? toFixedDo : identity;
  const roster = useRoster();
  const from = firstNoteFromRoster(roster) || 'E2';
  const sound = useSound({ step: frequencyDiff(from, nextNote(from)), pause });
  const note = sound ? noteFromFrequency(sound, altered) : '';
  const expectedFreq = expectedNote && getFrequency(expectedNote);
  const diff = expectedFreq && sound && trimDecimal(sound - expectedFreq);
  const wakeLock = useWakeLock({ reacquireOnPageVisible: true });
  useEffect(() => {
    void wakeLock.request();
    return () => {
      void wakeLock.release();
    };
  }, []);
  useEffect(() => setNote(note), [note]);
  return (
    <Stack gap="xs" align="center">
      {note && (
        <Text c="blue" ta="center" size="xl">
          {mapNote(note)} {settings.hint && diff && (diff < 0 ? '' : '+') + diff}
        </Text>
      )}
      {sound && showFrequency && (
        <Text c="lime" ta="center" size="lg">
          {sound}Hz
        </Text>
      )}
      {!note && <Loader color="blue" type="dots" mx="auto" />}
    </Stack>
  );
}
