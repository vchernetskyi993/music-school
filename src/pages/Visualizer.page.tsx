import { Note } from 'tonal';
import { Container, Group, Loader, Stack, Text } from '@mantine/core';
import { useSound } from '@/hooks/pitch';
import { frequencyDiff, nextNote } from '@/utils/music';

export function Visualizer() {
  const sound = useSound({
    defaultFrequency: 263,
    step: frequencyDiff('E2', nextNote('E2')),
    pause: false,
  });
  return (
    <Container fluid>
      <Group justify="center">
        <Stack gap="xs">
          <Text c="grape" ta="center" size="xl" mt="md">
            {Note.fromFreqSharps(sound!)}
          </Text>
          <Text c="lime" size="lg">
            {sound}Hz
          </Text>
        </Stack>
      </Group>
      <Text c="dimmed" ta="center" size="md" maw={580} mx="auto" mt="sm">
        Waiting for note...
      </Text>
      <Loader color="blue" type="dots" mx="auto" />
    </Container>
  );
}
