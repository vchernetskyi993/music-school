import { useEffect, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { Container, Tabs } from '@mantine/core';
import { ExpectedNote } from '@/components/expectations/ExpectedNote';
import { ExpectedSound } from '@/components/expectations/ExpectedSound';
import { ExpectedStaff } from '@/components/expectations/ExpectedStaff';
import { pages } from '@/components/NavBar';
import { Task } from '@/components/Task';
import { useCounter } from '@/hooks/counter';
import { randomNoteFromRoster, useRoster } from '@/hooks/roster';

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
  const [previousNote, setPreviousNote] = useState<string>();
  const [paused, pause] = useState(false);
  const [actual, setActual] = useState('');
  const [initial, setInitial] = useState(true);

  const refresh = () => {
    pause(false);
    setPreviousNote(expected);
    setExpected(randomNoteFromRoster(roster, expected));
  };

  useEffect(refresh, [roster]);
  useEffect(() => {
    if (actual && actual === expected) {
      counter.increment();
      setInitial(false);
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
        <Task
          expectedNote={expected}
          previousNote={previousNote}
          settingsConf={{ notation: tab === 'text' }}
          setActual={setActual}
          expectation={
            <Expected tab={tab!} note={expected} paused={paused} pause={pause} initial={initial} />
          }
          counter={counter}
        />
      </Tabs>
    </Container>
  );
}

function Expected({
  tab,
  note,
  paused,
  pause,
  initial,
}: {
  tab: string;
  note: string;
  paused: boolean;
  pause: (pause: boolean) => void;
  initial: boolean;
}) {
  switch (tab) {
    case tabs.text:
      return <ExpectedNote note={note} />;
    case tabs.sound:
      return <ExpectedSound note={note} paused={paused} pause={pause} initial={initial} />;
    case tabs.staff:
      return <ExpectedStaff note={note} />;
    default:
      throw Error(`Unsupported tab ${tab}`);
  }
}
