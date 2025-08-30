import { useEffect, useState } from 'react';
import { IconPlayerPlay } from '@tabler/icons-react';
import { ActionIcon, Container, Divider, Group, Stack, Tabs, Title } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { CapturedNote } from '@/components/CapturedNote';
import { NoteRange } from '@/components/NoteRange';
import { usePlayer } from '@/hooks/player';
import { delay } from '@/utils/async';
import { randomNote } from '@/utils/music';

const defaultFrom = 'E2';
const defaultTo = 'E5';

const tabs = {
  spn: 'spn',
  sound: 'sound',
};

export function Notes() {
  const [tab, setTab] = useState(tabs.spn);
  const [matched, setMatched] = useState<boolean>(false);
  const [from, setFrom] = useLocalStorage({ key: 'from', defaultValue: defaultFrom });
  const [to, setTo] = useLocalStorage({ key: 'to', defaultValue: defaultTo });
  const [expected, setExpected] = useState(() => randomNote(from, to));
  const [paused, pause] = useState(false);
  const [actual, setActual] = useState('');

  const refresh = () => {
    setMatched(false);
    pause(false);
    setExpected(randomNote(from, to, expected.spn));
  };

  useEffect(refresh, [from, to]);
  useEffect(() => {
    if (!matched && actual === expected.spn) {
      // console.log(`State is expected: ${state.expected}`);
      setMatched(true);
      pause(true);
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
          <Tabs.Tab value={tabs.spn}>SPN</Tabs.Tab>
          <Tabs.Tab value={tabs.sound}>Sound</Tabs.Tab>
        </Tabs.List>
        <Stack gap="xs">
          <NoteRange from={from} setFrom={setFrom} to={to} setTo={setTo} />
          <Group justify="center" m="md">
            <Expected tab={tab} note={expected.spn} paused={paused} pause={pause} />
          </Group>
          <Divider size="md" />
          <CapturedNote
            color={matched ? 'green' : 'red'}
            from={from}
            pause={paused}
            altered={expected.altered}
            setNote={setActual}
          />
        </Stack>
      </Tabs>
    </Container>
  );
}

function Expected({
  tab,
  note,
  paused,
  pause,
}: {
  tab: string;
  note: string;
  paused: boolean;
  pause: (pause: boolean) => void;
}) {
  const player = usePlayer();
  switch (tab) {
    case tabs.spn:
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
          disabled={paused}
        >
          <IconPlayerPlay />
        </ActionIcon>
      );
    }
    default:
      throw Error(`Unsupported tab ${tab}`);
  }
}
