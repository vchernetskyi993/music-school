import { useEffect, useState } from 'react';
import { Note } from 'tonal';
import { Container, Divider, Group, Loader, Stack, Text } from '@mantine/core';
import { delay } from '@/helpers/async';
import { Altered, frequencyDiff, nextNote, noteFromFrequency } from '@/helpers/music';
import { useSound } from '@/helpers/pitch';

type State = { expected: string; altered: Altered };

export function Notes() {
  const [matched, setMatched] = useState<boolean>(false);
  const [state, setState] = useState<State>(freshState());
  const sound = useSound({ step: frequencyDiff('E2', nextNote('E2')) });
  const actual = sound ? noteFromFrequency(sound, state.altered) : '';
  useEffect(() => {
    if (!matched && actual === state.expected) {
      console.log(`State is expected: ${state.expected}`);
      setMatched(true);
      delay(1000).then(() => {
        setState(freshState(state.expected));
        setMatched(false);
      });
    }
  }, [actual]);
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
          c={sound ? (matched ? 'green' : 'red') : 'dimmed'}
          ta="center"
          size={sound ? 'xl' : 'md'}
          maw={580}
          mx="auto"
          mt="sm"
        >
          {actual || 'Waiting for note...'}
        </Text>
        <Loader color="blue" type="dots" mx="auto" />
      </Stack>
    </Container>
  );
}

function freshState(previous?: string): State {
  const altered = Math.round(Math.random());
  const note = randomNote(altered);
  if (note === previous) {
    return freshState(previous);
  }
  return { altered, expected: note };
}

function randomNote(altered: Altered): string {
  const frequency = randomInt(Note.get('E2').freq!, Note.get('E5').freq!);
  return noteFromFrequency(frequency, altered);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
