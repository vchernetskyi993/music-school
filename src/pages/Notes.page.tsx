import { useEffect, useState } from 'react';
import { IconPlayerPlay } from '@tabler/icons-react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { ActionIcon, Container, Divider, Group, Stack, Tabs, Title } from '@mantine/core';
import { CapturedNote } from '@/components/CapturedNote';
import { pages } from '@/components/NavBar';
import { NoteRoster } from '@/components/NoteRoster';
import { usePlayer } from '@/hooks/player';
import { firstNoteFromRoster, randomNoteFromRoster, useRoster } from '@/hooks/roster';
import { delay } from '@/utils/async';

const tabs = {
  spn: 'spn',
  sound: 'sound',
};

export function Notes() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const [matched, setMatched] = useState<boolean>(false);
  const roster = useRoster();
  const [expected, setExpected] = useState(() => randomNoteFromRoster(roster));
  const [paused, pause] = useState(false);
  const [actual, setActual] = useState('');

  const refresh = () => {
    setMatched(false);
    pause(false);
    setExpected(randomNoteFromRoster(roster, expected.spn));
  };

  useEffect(refresh, [roster]);
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
        onChange={(tab) => {
          navigate(generatePath(pages.studyNotes.to, { tab }));
          refresh();
        }}
      >
        <Tabs.List>
          <Tabs.Tab value={tabs.spn}>SPN</Tabs.Tab>
          <Tabs.Tab value={tabs.sound}>Sound</Tabs.Tab>
        </Tabs.List>
        <Stack gap="xs">
          <NoteRoster />
          <Group justify="center" m="md">
            <Expected tab={tab!} note={expected.spn} paused={paused} pause={pause} />
          </Group>
          <Divider size="md" />
          <CapturedNote
            color={matched ? 'green' : 'red'}
            from={firstNoteFromRoster(roster)}
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
