import { Container, Group, Loader, Stack, Text } from '@mantine/core';
import { frequencyDiff, nextNote } from '@/helpers/music';
import { useNoteSound } from '@/helpers/pitch';

export function Visualizer() {
  const sound = useNoteSound({
    defaultNote: { note: 'C4', frequency: 263 },
    step: frequencyDiff('E2', nextNote('E2')),
  });
  return (
    <Container fluid>
      <Group justify="center">
        <Stack gap="xs">
          <Text c="grape" ta="center" size="xl" mt="md">
            {sound!.note}
          </Text>
          <Text c="lime" size="lg">
            {sound!.frequency}Hz
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
