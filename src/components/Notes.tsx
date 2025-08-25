import { useEffect, useState } from 'react';
import { Note } from 'tonal';
import { Container, Divider, Group, Loader, Stack, Text } from '@mantine/core';
import { delay } from '@/helpers/async';
import { frequencyDiff, nextNote } from '@/helpers/music';
import { useNoteSound } from '@/helpers/pitch';

export function Notes() {
  const [expected, setExpected] = useState<string>(randomNote());
  const sound = useNoteSound({ step: frequencyDiff('E2', nextNote('E2')) });
  useEffect(() => {
    if (sound && sound.note === expected) {
      delay(1000).then(() => setExpected(randomNote()));
    }
  });
  return (
    <Container fluid>
      <Stack gap="xs">
        <Group justify="center">
          <Text c="grape" ta="center" size="xl" mt="md">
            {expected}
          </Text>
        </Group>
        <Divider size="md" />
        <Text
          c={sound ? (sound.note === expected ? 'green' : 'red') : 'dimmed'}
          ta="center"
          size={sound ? 'xl' : 'md'}
          maw={580}
          mx="auto"
          mt="sm"
        >
          {sound ? sound.note : 'Waiting for note...'}
        </Text>
        <Loader color="blue" type="dots" mx="auto" />
      </Stack>
    </Container>
  );
}

function randomNote(): string {
  const noteFromFreq = Math.round(Math.random()) ? Note.fromFreqSharps : Note.fromFreq;
  const frequency = randomInt(Note.get('E2').freq!, Note.get('E5').freq!);
  return noteFromFreq(frequency);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
