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
  Stack,
  Tabs,
  Title,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { CapturedNote } from '@/components/CapturedNote';
import { Counter } from '@/components/Counter';
import { pages } from '@/components/NavBar';
import { NoteRoster } from '@/components/NoteRoster';
import { usePlayer } from '@/hooks/player';
import { firstNoteFromRoster, randomNoteFromRoster, useRoster } from '@/hooks/roster';
import { delay } from '@/utils/async';
import { toFixedDo } from '@/utils/music';

const tabs = {
  spn: 'spn',
  sound: 'sound',
  fixedDo: 'fixed-do',
};

type Settings = {
  hint: boolean;
  counter: boolean;
};

export function Notes() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const [matched, setMatched] = useState<boolean>(false);
  const soundTab = tab === tabs.sound;
  const roster = useRoster({ requireSoundSupport: soundTab });
  const [expected, setExpected] = useState(() => randomNoteFromRoster(roster));
  const [paused, pause] = useState(false);
  const [actual, setActual] = useState('');
  const [settings, setSettings] = useLocalStorage<Settings>({
    key: 'settings',
    defaultValue: { hint: false, counter: false },
  });

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
          <Tabs.Tab value={tabs.fixedDo}>Fixed Do</Tabs.Tab>
        </Tabs.List>
        <Stack gap="xs">
          <Group justify="center" m="md">
            <NoteRoster requireSoundSupport={soundTab} />
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
                </Stack>
              </Popover.Dropdown>
            </Popover>
          </Group>
          <Group justify="center" m="md">
            {roster && <Expected tab={tab!} note={expected.spn} paused={paused} pause={pause} />}
          </Group>
          <Divider size="md" />
          <Stack align="center" gap="xs">
            <CapturedNote
              color={matched ? 'green' : 'red'}
              from={firstNoteFromRoster(roster)}
              pause={paused}
              altered={expected.altered}
              setNote={setActual}
              mapNote={tab === tabs.fixedDo ? toFixedDo : identity}
              expectedNote={expected.spn}
              hint={settings.hint}
            />
            {settings.counter && <Counter matched={matched} />}
          </Stack>
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
  const player = usePlayer(note, tab === tabs.sound);
  switch (tab) {
    case tabs.spn:
      return <ExpectedNote note={note} />;
    case tabs.sound: {
      return player.loaded ? (
        <ActionIcon
          variant="light"
          size="xl"
          onClick={() => {
            pause(true);
            player.playNote().then(() => pause(false));
          }}
          disabled={paused}
        >
          <IconPlayerPlay />
        </ActionIcon>
      ) : (
        <Loader />
      );
    }
    case tabs.fixedDo:
      return <ExpectedNote note={toFixedDo(note)} />;
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
