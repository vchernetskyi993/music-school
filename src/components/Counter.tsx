import React, { useEffect, useState } from 'react';
import { IconPlayerPause, IconPlayerPlay, IconRestore } from '@tabler/icons-react';
import { ActionIcon, Group, Paper, Stack, Text, Title, Tooltip } from '@mantine/core';
import { formatCountPerMinute } from '@/utils/rate';
import { formatDuration } from '@/utils/time';

export function Counter({ matched }: { matched: boolean }) {
  const [count, setCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [paused, setPaused] = useState(true);
  const elapsedTime = formatDuration(elapsedSeconds);
  const countPerMinute = formatCountPerMinute(count, elapsedSeconds);

  useEffect(() => {
    if (matched && !paused) {
      setCount((c) => c + 1);
    }
  }, [matched]);

  useEffect(() => {
    if (paused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [paused]);

  return (
    <Stack align="center" gap="xs" w="100%">
      <Paper
        withBorder
        radius="md"
        shadow="xs"
        p={5}
        styles={{ root: { borderColor: paused ? 'gray' : 'cornflowerblue' } }}
      >
        <Group gap="xs" wrap="nowrap">
          <StyledTooltip label="Elapsed time">
            <Text size="sm" fw={500} c="dimmed" ta="center">
              {elapsedTime}
            </Text>
          </StyledTooltip>
          <StyledTooltip label="Total count">
            <Title order={3} c="gray">
              {count}
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

        <Button
          label="Reset counter"
          onClick={() => {
            setCount(0);
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
