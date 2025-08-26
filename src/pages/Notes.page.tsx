import { useEffect, useState } from 'react';
import { Note } from 'tonal';
import { Container, Divider, Group, Loader, Stack, Text } from '@mantine/core';
import { NoteInput } from '@/components/NoteInput';
import { delay } from '@/helpers/async';
import { Altered, frequencyDiff, nextNote, noteFromFrequency } from '@/helpers/music';
import { useSound } from '@/helpers/pitch';

type State = { expected: string; altered: Altered };

export function Notes() {
  const [matched, setMatched] = useState<boolean>(false);
  const [from, setFrom] = useState('E2');
  const [to, setTo] = useState('E5');
  const [state, setState] = useState<State>(() => freshState(from, to));
  const refresh = () => setState(freshState(from, to, state.expected));
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
        <Group justify="center">
          <NoteInput
            label="From:"
            note={from}
            setNote={setFrom}
            pairNote={to}
            validator={(from, to) => from > to}
            validationError="From should be lower than to"
            refresh={refresh}
          />
          <NoteInput
            label="To:"
            note={to}
            setNote={setTo}
            pairNote={from}
            validator={(to, from) => to < from}
            validationError="To should be higher than from"
            refresh={refresh}
          />
        </Group>
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
