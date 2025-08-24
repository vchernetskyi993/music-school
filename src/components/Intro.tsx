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
          <Link to={pages.visualize.to}>{pages.visualize.label}</Link> - verify that application captures pitch of
          your instrument correctly
        </ListItem>
      </List>
    </Stack>
  );
}
