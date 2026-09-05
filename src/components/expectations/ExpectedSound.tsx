import { IconPlayerPlay } from '@tabler/icons-react';
import { ActionIcon, Loader } from '@mantine/core';
import { usePlayer } from '@/hooks/player';

export function ExpectedSound({
  note,
  paused,
  pause,
}: {
  note: string;
  paused: boolean;
  pause: (pause: boolean) => void;
}) {
  const player = usePlayer(note);
  return player.loaded ? (
    <ActionIcon
      variant="light"
      size="xl"
      onClick={() => {
        pause(true);
        player.playNote(note).then(() => pause(false));
      }}
      disabled={paused}
    >
      <IconPlayerPlay />
    </ActionIcon>
  ) : (
    <Loader />
  );
}
