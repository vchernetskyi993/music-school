import '@mantine/core/styles.css';

import { useEffect, useState } from 'react';
import { PitchDetector } from 'pitchy';
import { Outlet } from 'react-router-dom';
import { AppShell, Burger, Group, MantineProvider, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavBar } from './components/NavBar';
import { theme } from './theme';

export type Detector = PitchDetector<Float32Array<ArrayBufferLike>>;

export type ContextType = {
  node: AnalyserNode;
  detector: Detector;
  rate: number;
};

export default function App() {
  const [opened, { toggle }] = useDisclosure();
  const [state, setState] = useState<ContextType | null>(null);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new window.AudioContext();
      const analyserNode = audioContext.createAnalyser();
      audioContext.createMediaStreamSource(stream).connect(analyserNode);
      const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
      detector.minVolumeDecibels = -10;
      setState({ node: analyserNode, detector, rate: audioContext.sampleRate });
    });
  }, []);
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <AppShell
        padding="md"
        header={{ height: { base: 60, md: 70, lg: 80 } }}
        footer={{ height: 25 }}
        navbar={{
          width: 180,
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
          <Outlet context={state} />
        </AppShell.Main>
        <AppShell.Footer p={5}>
          <Text ta="right" size="xs">
            Build: {__COMMIT_HASH__}
          </Text>
        </AppShell.Footer>
      </AppShell>
    </MantineProvider>
  );
}
