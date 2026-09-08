import { generatePath, Link } from 'react-router-dom';
import { List, ListItem, Stack, Text, Title } from '@mantine/core';
import { pages } from '@/components/NavBar';

export function Intro() {
  return (
    <Stack gap="sm">
      <Title order={1} mt="md">
        {pages.intro.label}
      </Title>
      <Text>
        Welcome to the <b>Music Shool</b> application.
      </Text>
      <Title order={2}>Motivation</Title>
      <Text>
        There are dozens of applications that provide visual learning of notes, intervals, and
        similar concepts, but I haven’t found one that lets you build{' '}
        <i>mental maps directly on the instrument itself</i>. To address this, the{' '}
        <b>Music School</b> application is designed to capture sound from any instrument and
        validate it against the expected one. This way, you can chart pathways that connect
        theoretical knowledge directly to your fingertips.
      </Text>
      <Title order={2}>Available Tools</Title>
      <Title order={3}>
        <Link to={pages.visualize.to}>{pages.visualize.label}</Link>
      </Title>
      <Text>
        Displays played note on the screen. Useful to verify that application is operational and, if
        needed, to tune your instrument.
      </Text>
      <Title order={3}>
        <Link to={generatePath(pages.notes.to, pages.notes.params)}>{pages.notes.label}</Link>
      </Title>
      <Text>
        Play a note displayed on the screen. Useful to learn positions of single notes on the
        instrument.
      </Text>
      <Title order={3}>
        <Link to={pages.intervals.to}>{pages.intervals.label}</Link>
      </Title>
      <Text>
        Play a pair of notes. Task is formatted as{' '}
        <b>
          <code>`[Note] +[Interval] ([Index])`</code>
        </b>{' '}
        (e.g.,{' '}
        <b>
          <code>`E2 +P8 (2)`</code>
        </b>{' '}
        meaning the ending note of the perfect octave starting from E2).
      </Text>
      <List withPadding>
        <ListItem>
          <b>[Note]</b> - single note notation. Adheres to <b>Text</b> study mode rules below.
        </ListItem>
        <ListItem>
          <b>[Interval]</b> - interval from the <b>[Note]</b> in the{' '}
          <a href="https://en.wikipedia.org/wiki/Interval_(music)#Main_intervals">
            conventional notation
          </a>
          .
        </ListItem>
        <ListItem>
          <b>[Index]</b> - either 1 or 2 depending if you need to input starting or ending note.
        </ListItem>
      </List>
      <Title order={2}>Study Modes</Title>
      <Text>Expectations can be represented in the following formats:</Text>
      <List withPadding>
        <ListItem>
          <b>Text</b> - either{' '}
          <a href="https://en.wikipedia.org/wiki/Scientific_pitch_notation">
            Scientific Pitch Notation (SPN)
          </a>{' '}
          or <a href="https://en.wikipedia.org/wiki/Solf%C3%A8ge#Fixed_do_solf%C3%A8ge">Fixed Do</a>{' '}
          solfège.
        </ListItem>
        <ListItem>
          <b>Sound</b> - playable audio.
        </ListItem>
        <ListItem>
          <b>Staff</b> - expected note on a{' '}
          <a href="https://en.wikipedia.org/wiki/Staff_(music)">musical staff</a>.
        </ListItem>
      </List>
    </Stack>
  );
}
