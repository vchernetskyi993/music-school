import { useEffect, useState } from 'react';
import { IconPlayerPlay } from '@tabler/icons-react';
import { Note } from 'tonal';
import { ActionIcon, Container, Divider, Group, Stack, Tabs, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { CapturedNote } from '@/components/CapturedNote';
import { NoteRange } from '@/components/NoteRange';
import { useSound } from '@/hooks/pitch';
import { usePlayer } from '@/hooks/player';
import { delay } from '@/utils/async';
import { Altered, frequencyDiff, nextNote, noteFromFrequency } from '@/utils/music';

type State = { expected: string; altered: Altered };

const defaultFrom = 'E2';
const defaultTo = 'E5';

const tabs = {
  ipn: 'ipn',
  sound: 'sound',
};

export function Notes() {
  const [tab, setTab] = useState(tabs.ipn);
  const [matched, setMatched] = useState<boolean>(false);
  const [from, setFrom] = useLocalStorage({ key: 'from', defaultValue: defaultFrom });
  const [to, setTo] = useLocalStorage({ key: 'to', defaultValue: defaultTo });
  const [state, setState] = useState<State>(() => freshState(from, to));
  const [pause, setPause] = useState(false);

  const refresh = () => {
    setMatched(false);
    setPause(false);
    setState(freshState(from, to, state.expected));
  };

  useEffect(refresh, [from, to]);
  const sound = useSound({ step: frequencyDiff(from, nextNote(from)), pause });
  const actual = sound ? noteFromFrequency(sound, state.altered) : '';
  useEffect(() => {
    if (!matched && actual === state.expected) {
      // console.log(`State is expected: ${state.expected}`);
      setMatched(true);
      setPause(true);
      delay(1000).then(refresh);
    }
  }, [actual]);
  return (
    <Container fluid>
      <Tabs
        value={tab}
        onChange={(value) => {
          setTab(value!);
          refresh();
        }}
      >
        <Tabs.List>
          <Tabs.Tab value={tabs.ipn}>IPN</Tabs.Tab>
          <Tabs.Tab value={tabs.sound}>Sound</Tabs.Tab>
        </Tabs.List>
        <Stack gap="xs">
          <NoteRange from={from} setFrom={setFrom} to={to} setTo={setTo} />
          <Group justify="center" m="md">
            <Expected tab={tab} note={state.expected} pause={setPause} />
          </Group>
          <Divider size="md" />
          <CapturedNote
            color={matched ? 'green' : 'red'}
            from={from}
            pause={pause}
            altered={state.altered}
          />
        </Stack>
      </Tabs>
    </Container>
  );
}

function Expected({
  tab,
  note,
  pause,
}: {
  tab: string;
  note: string;
  pause: (pause: boolean) => void;
}) {
  const player = usePlayer();
  switch (tab) {
    case tabs.ipn:
      return (
        <Title c="grape" ta="center" order={3}>
          {note}
        </Title>
      );
    case tabs.sound: {
      return (
        <ActionIcon
          variant="light"
          size="xl"
          onClick={() => {
            pause(true);
            player.playNote(note).then(() => pause(false));
          }}
        >
          <IconPlayerPlay />
        </ActionIcon>
      );
    }
    default:
      throw Error(`Unsupported tab ${tab}`);
  }
}

function freshState(from: string, to: string, previous?: string): State {
  const altered = Math.round(Math.random());
  if (from === to) {
    return { altered, expected: noteFromFrequency(Note.get(from).freq!, altered) };
  }
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
