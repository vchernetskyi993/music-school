import { useMemo } from 'react';
import * as Tone from 'tone';

interface Player {
  playNote: (note: string) => void;
}

export function usePlayer(): Player {
  const audio = useMemo(() => new Tone.Synth().toDestination(), []);
  return {
    playNote(note) {
      audio.triggerAttackRelease(note, '4n');
    },
  };
}
