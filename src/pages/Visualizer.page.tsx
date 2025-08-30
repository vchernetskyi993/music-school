import { Container } from '@mantine/core';
import { CapturedNote } from '@/components/CapturedNote';

export function Visualizer() {
  return (
    <Container fluid>
      <CapturedNote showFrequency />
    </Container>
  );
}
