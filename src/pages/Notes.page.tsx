import { useEffect, useState } from 'react';
import { IconPlayerPlay, IconSettings } from '@tabler/icons-react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { identity } from 'rxjs';
import {
  ActionIcon,
  Checkbox,
  Container,
  Divider,
  Group,
  Loader,
  Popover,
  Select,
  Stack,
  Tabs,
  Title,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { CapturedNote } from '@/components/CapturedNote';
import { Counter } from '@/components/Counter';
import { ExpectedStaff } from '@/components/ExpectedStaff';
import { pages } from '@/components/NavBar';
import { NoteRoster } from '@/components/NoteRoster';
import { useCounter } from '@/hooks/counter';
import { usePlayer } from '@/hooks/player';
import { firstNoteFromRoster, randomNoteFromRoster, useRoster } from '@/hooks/roster';
import { toFixedDo } from '@/utils/music';

const tabs = {
  text: 'text',
  sound: 'sound',
  staff: 'staff',
};

type Notation = 'SPN' | 'Fixed Do';

type Settings = {
  hint: boolean;
  counter: boolean;
  notation: Notation;
};

export function Notes() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const counter = useCounter();
  const roster = useRoster();
  const [expected, setExpected] = useState(() => randomNoteFromRoster(roster));
  const [paused, pause] = useState(false);
  const [actual, setActual] = useState('');
  const [settings, setSettings] = useLocalStorage<Settings>({
    key: 'settings',
    defaultValue: { hint: false, counter: false, notation: 'SPN' },
  });

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
  }, [actual, expected.spn]);
  return (
    <Container fluid>
      <Tabs
        value={tab}
        onChange={(tab) => {
          navigate(generatePath(pages.studyNotes.to, { tab }));
          refresh();
        }}
      >
        <Tabs.List justify="center">
          <Tabs.Tab value={tabs.text}>Text</Tabs.Tab>
          <Tabs.Tab value={tabs.sound}>Sound</Tabs.Tab>
          <Tabs.Tab value={tabs.staff}>Staff</Tabs.Tab>
        </Tabs.List>
        <Stack gap="md" m="sm">
          <Group justify="center">
            <NoteRoster />
            <Popover>
              <Popover.Target>
                <ActionIcon variant="transparent">
                  <IconSettings />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Stack>
                  <Checkbox
                    checked={settings.hint}
                    onChange={(e) => setSettings({ ...settings, hint: e.currentTarget.checked })}
                    label="Frequency Hint"
                  />
                  <Checkbox
                    checked={settings.counter}
                    onChange={(e) => setSettings({ ...settings, counter: e.currentTarget.checked })}
                    label="Counter"
                  />
                  {tab === 'text' && (
                    <Select<Notation>
                      label="Notation"
                      value={settings.notation}
                      data={['SPN', 'Fixed Do']}
                      onChange={(value) => setSettings({ ...settings, notation: value! })}
                    />
                  )}
                </Stack>
              </Popover.Dropdown>
            </Popover>
          </Group>
          <Group justify="center">
            <Expected
              tab={tab!}
              note={expected.spn}
              textNotationType={settings.notation}
              paused={paused}
              pause={pause}
            />
          </Group>
          <Divider size="md" />
          <CapturedNote
            from={firstNoteFromRoster(roster)}
            pause={paused}
            altered={expected.altered}
            setNote={setActual}
            mapNote={settings.notation === 'SPN' ? identity : toFixedDo}
            expectedNote={expected.spn}
            hint={settings.hint}
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
  textNotationType,
  paused,
  pause,
}: {
  tab: string;
  note: string;
  textNotationType: Notation;
  paused: boolean;
  pause: (pause: boolean) => void;
}) {
  const player = usePlayer(tab === tabs.sound ? note : undefined);
  switch (tab) {
    case tabs.text:
      return <ExpectedNote note={textNotationType === 'SPN' ? note : toFixedDo(note)} />;
    case tabs.sound: {
      return player.loaded ? (
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
      ) : (
        <Loader />
      );
    }
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
