import { useMemo } from 'react';
import * as Tone from 'tone';

interface Player {
  playNote: (note: string) => Promise<void>;
}

const noteLength = '4n';

export function usePlayer(): Player {
  const audio = useMemo(() => new Tone.Synth().toDestination(), []);
  return {
    playNote(note) {
      return new Promise((resolve) => {
        audio.triggerAttackRelease(note, noteLength);
        audio.onsilence = () => resolve();
      });
    },
  };
}
