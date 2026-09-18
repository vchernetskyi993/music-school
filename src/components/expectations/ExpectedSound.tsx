import { useEffect } from 'react';
import { IconPlayerPlay } from '@tabler/icons-react';
import { ActionIcon, Loader } from '@mantine/core';
import { usePlayer } from '@/hooks/player';

export function ExpectedSound({
  note,
  paused,
  pause,
  initial,
}: {
  note: string;
  paused: boolean;
  pause: (pause: boolean) => void;
  initial: boolean;
}) {
  const player = usePlayer(note);
  const play = () => {
    pause(true);
    player.playNote(note).then(() => pause(false));
  };
  useEffect(() => {
    if (!initial && !paused) {
      play();
    }
  }, [note]);
  return player.loaded ? (
    <ActionIcon variant="light" size="xl" onClick={play} disabled={paused}>
      <IconPlayerPlay />
    </ActionIcon>
  ) : (
    <Loader />
  );
}
