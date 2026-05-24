import React, { useEffect, useState } from 'react';
import { IconPlayerPause, IconPlayerPlay, IconRestore } from '@tabler/icons-react';
import { ActionIcon, Group, Paper, Stack, Title, Tooltip } from '@mantine/core';

export function Counter({ matched }: { matched: boolean }) {
  const [count, setCount] = useState(0);
  const [paused, setPaused] = useState(true);
  const color = paused ? 'gray' : 'green';

  useEffect(() => {
    if (matched && !paused) {
      setCount((c) => c + 1);
    }
  }, [matched]);

  return (
    <Stack align="center" gap="xs">
      <Paper
        withBorder
        radius="md"
        shadow="xs"
        p={5}
        w={80}
        styles={{ root: { borderColor: color } }}
      >
        <Title order={3} c={color} style={{ textAlign: 'center' }}>
          {count}
        </Title>
      </Paper>

      <Group align="center" gap="xs">
        {paused && (
          <Button label="Start counting" onClick={() => setPaused(false)}>
            <IconPlayerPlay />
          </Button>
        )}

        {!paused && (
          <Button label="Pause counting" onClick={() => setPaused(true)}>
            <IconPlayerPause />
          </Button>
        )}

        <Button label="Reset counter" onClick={() => setCount(0)}>
          <IconRestore />
        </Button>
      </Group>
    </Stack>
  );
}

function Button({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip label={label} color="gray">
      <ActionIcon variant="light" size="lg" onClick={onClick}>
        {children}
      </ActionIcon>
    </Tooltip>
  );
}
