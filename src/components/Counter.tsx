import React, { useEffect, useState } from 'react';
import { IconPlayerPause, IconPlayerPlay, IconRestore } from '@tabler/icons-react';
import { ActionIcon, Group, Paper, Stack, Text, Title, Tooltip } from '@mantine/core';
import { ICounter } from '@/hooks/counter';
import { formatCountPerMinute } from '@/utils/rate';
import { formatDuration } from '@/utils/time';

export function Counter({ counter }: { counter: ICounter }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const elapsedTime = formatDuration(elapsedSeconds);
  const countPerMinute = formatCountPerMinute(counter.count, elapsedSeconds);

  useEffect(() => {
    if (counter.paused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [counter.paused]);

  return (
    <Stack align="center" gap="xs" w="100%">
      <Paper
        withBorder
        radius="md"
        shadow="xs"
        p={5}
        styles={{ root: { borderColor: counter.paused ? 'gray' : 'cornflowerblue' } }}
      >
        <Group gap="xs" wrap="nowrap">
          <StyledTooltip label="Elapsed time">
            <Text size="sm" fw={500} c="dimmed" ta="center">
              {elapsedTime}
            </Text>
          </StyledTooltip>
          <StyledTooltip label="Total count">
            <Title order={3} c="gray">
              {counter.count}
            </Title>
          </StyledTooltip>
          <StyledTooltip label="Count per minute">
            <Text size="sm" fw={500} c="dimmed" ta="center">
              {countPerMinute}
            </Text>
          </StyledTooltip>
        </Group>
      </Paper>

      <Group>
        {counter.paused && (
          <Button label="Start counting" onClick={() => counter.start()}>
            <IconPlayerPlay />
          </Button>
        )}

        {!counter.paused && (
          <Button label="Pause counting" onClick={() => counter.pause()}>
            <IconPlayerPause />
          </Button>
        )}

        <Button
          label="Reset counter"
          onClick={() => {
            counter.reset();
            setElapsedSeconds(0);
          }}
        >
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
    <StyledTooltip label={label}>
      <ActionIcon variant="light" size="lg" onClick={onClick}>
        {children}
      </ActionIcon>
    </StyledTooltip>
  );
}

function StyledTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip label={label} color="gray">
      {children}
    </Tooltip>
  );
}
