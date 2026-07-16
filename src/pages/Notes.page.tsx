import { useEffect, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Container, Divider, Group, Stack, Tabs, Title } from '@mantine/core';
import { CapturedNote } from '@/components/CapturedNote';
import { Counter } from '@/components/Counter';
import { ExpectedSound } from '@/components/ExpectedSound';
import { ExpectedStaff } from '@/components/ExpectedStaff';
import { pages } from '@/components/NavBar';
import { Settings } from '@/components/Settings';
import { useCounter } from '@/hooks/counter';
import { randomNoteFromRoster, useRoster } from '@/hooks/roster';
import { useSettings } from '@/hooks/settings';
import { toFixedDo } from '@/utils/music';

const tabs = {
  text: 'text',
  sound: 'sound',
  staff: 'staff',
};

export function Notes() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const counter = useCounter();
  const roster = useRoster();
  const [expected, setExpected] = useState(() => randomNoteFromRoster(roster));
  const [paused, pause] = useState(false);
  const [actual, setActual] = useState('');
  const settings = useSettings();

  const refresh = () => {
    pause(false);
    setExpected(randomNoteFromRoster(roster, expected.spn));
  };

  useEffect(refresh, [roster]);
  useEffect(() => {
    if (actual === expected.spn) {
      counter.increment();
      refresh();
    }
  }, [actual, expected]);
  return (
    <Container fluid>
      <Tabs
        value={tab}
        onChange={(tab) => {
          navigate(generatePath(pages.notes.to, { tab }));
          refresh();
        }}
      >
        <Tabs.List justify="center">
          <Tabs.Tab value={tabs.text}>Text</Tabs.Tab>
          <Tabs.Tab value={tabs.sound}>Sound</Tabs.Tab>
          <Tabs.Tab value={tabs.staff}>Staff</Tabs.Tab>
        </Tabs.List>
        <Stack gap="md" m="sm">
          <Settings notation={tab === 'text'} />
          <Group justify="center">
            <Expected tab={tab!} note={expected.spn} paused={paused} pause={pause} />
          </Group>
          <Divider size="md" />
          <CapturedNote
            pause={paused}
            setNote={setActual}
            expectedNote={expected.spn}
            alteration={expected.alteration}
          />
          {settings.counter && <Counter counter={counter} />}
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
  const settings = useSettings();
  switch (tab) {
    case tabs.text:
      return <ExpectedNote note={settings.notation === 'SPN' ? note : toFixedDo(note)} />;
    case tabs.sound:
      return <ExpectedSound note={note} paused={paused} pause={pause} />;
    case tabs.staff:
      return <ExpectedStaff note={note} />;
    default:
      throw Error(`Unsupported tab ${tab}`);
  }
}

function ExpectedNote({ note }: { note: string }) {
  return (
    <Title c="grape" ta="center" order={3}>
      {note}
    </Title>
  );
}
