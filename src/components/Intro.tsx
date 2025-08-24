import { Link } from 'react-router-dom';
import { List, ListItem, Stack, Text, Title } from '@mantine/core';
import { pages } from './NavBar';

export function Intro() {
  return (
    <Stack gap="sm">
      <Title order={1}>{pages.intro.label}</Title>
      <Text>Welcome to Music Shool application.</Text>
      <Title order={3}>Available Tools:</Title>
      <List withPadding>
        <ListItem>
          <Link to={pages.visualize.to}>{pages.visualize.label}</Link> - displays on the screen note
          played. Useful to verify that application is operational and if needed to tune your
          instrument.
        </ListItem>
        <ListItem>
          <Link to={pages.studyNotes.to}>{pages.studyNotes.label}</Link> - play a note displayed on
          the screen. Useful to learn positions of single notes on the instrument.
        </ListItem>
      </List>
    </Stack>
  );
}
