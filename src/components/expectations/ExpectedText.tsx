import { Title } from '@mantine/core';

export function ExpectedText({ text }: { text: string }) {
  return (
    <Title c="grape" ta="center" order={3}>
      {text}
    </Title>
  );
}
