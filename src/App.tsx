import '@mantine/core/styles.css';

import { Outlet } from 'react-router-dom';
import { AppShell, Burger, Group, MantineProvider, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavBar } from './components/NavBar';
import { theme } from './theme';

export default function App() {
  const [opened, { toggle }] = useDisclosure();
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <AppShell
        padding="md"
        header={{ height: { base: 60, md: 70, lg: 80 } }}
        navbar={{
          width: { base: 200, md: 300, lg: 400 },
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title>Music School</Title>
          </Group>
        </AppShell.Header>
        <NavBar toggle={toggle} />
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
