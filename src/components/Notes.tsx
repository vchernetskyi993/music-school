import { useEffect, useState } from 'react';
import { Note } from 'tonal';
import { Container, Divider, Group, Loader, Stack, Text } from '@mantine/core';
import { delay } from '@/helpers/async';
import { Altered, frequencyDiff, nextNote, noteFromFrequency } from '@/helpers/music';
import { useNoteSound } from '@/helpers/pitch';

type State = { expected: string; altered: Altered };

export function Notes() {
  const [state, setState] = useState<State>(freshState());
  const sound = useNoteSound({ step: frequencyDiff('E2', nextNote('E2')), altered: state.altered });
  useEffect(() => {
    if (sound && sound.note === state.expected) {
      delay(1000).then(() => setState(freshState()));
    }
  });
  return (
    <Container fluid>
      <Stack gap="xs">
        <Group justify="center">
          <Text c="grape" ta="center" size="xl" mt="md">
            {state.expected}
          </Text>
        </Group>
        <Divider size="md" />
        <Text
          c={sound ? (sound.note === state.expected ? 'green' : 'red') : 'dimmed'}
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

function freshState(): State {
  const altered = Math.round(Math.random());
  return { altered, expected: randomNote(altered) };
}

function randomNote(altered: Altered): string {
  const frequency = randomInt(Note.get('E2').freq!, Note.get('E5').freq!);
  return noteFromFrequency(frequency, altered);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
