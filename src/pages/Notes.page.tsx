import { useEffect, useState } from 'react';
import { Note } from 'tonal';
import { Container, Divider, Group, Loader, Stack, Text } from '@mantine/core';
import { NoteRange } from '@/components/NoteRange';
import { delay } from '@/helpers/async';
import { Altered, frequencyDiff, nextNote, noteFromFrequency } from '@/helpers/music';
import { useSound } from '@/helpers/pitch';

type State = { expected: string; altered: Altered };

const defaultFrom = 'E2';
const defaultTo = 'E5';

export function Notes() {
  const [matched, setMatched] = useState<boolean>(false);
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [state, setState] = useState<State>(() => freshState(from, to));
  useEffect(() => setState(freshState(from, to, state.expected)), [from, to]);
  const refresh = () => setState(freshState(from, to, state.expected));
  useEffect(refresh, [from, to]);
  const sound = useSound({ step: frequencyDiff(from, nextNote(from)) });
  const actual = sound ? noteFromFrequency(sound, state.altered) : '';
  useEffect(() => {
    if (!matched && actual === state.expected) {
      // console.log(`State is expected: ${state.expected}`);
      setMatched(true);
      delay(1000).then(() => {
        refresh();
        setMatched(false);
      });
    }
  }, [actual]);
  return (
    <Container fluid>
      <Stack gap="xs">
        <NoteRange from={from} setFrom={setFrom} to={to} setTo={setTo} />
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

function freshState(from: string, to: string, previous?: string): State {
  const altered = Math.round(Math.random());
  const note = randomNote(from, to, altered);
  if (note === previous) {
    return freshState(from, to, previous);
  }
  return { altered, expected: note };
}

function randomNote(from: string, to: string, altered: Altered): string {
  const frequency = randomInt(Note.get(from).freq!, Note.get(to).freq!);
  return noteFromFrequency(frequency, altered);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
