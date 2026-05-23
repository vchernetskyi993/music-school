import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CacheStorage, SplendidGrandPiano } from 'smplr';
import { ContextType } from '@/App';
import { spnToMidi } from '@/utils/music';
import {
  nearestSplendidGrandPianoSampleMidi,
  splendidGrandPianoVelocity,
  splendidGrandPianoVelocityRange,
} from '@/utils/smplr/piano';

interface Player {
  loaded: boolean;
  playNote: () => Promise<void>;
}

type LoadedPiano = {
  note: string;
  piano: SplendidGrandPiano;
};

const sharedCacheStorage = new CacheStorage();

export function usePlayer(note: string, enabled: boolean): Player {
  const context = useOutletContext<ContextType | null>();
  const [loadedPiano, setLoadedPiano] = useState<LoadedPiano | null>(null);

  useEffect(() => {
    setLoadedPiano(null);

    if (!context || !enabled || !note) {
      return;
    }

    const nearestSampleMidi = nearestSplendidGrandPianoSampleMidi(spnToMidi(note));
    const piano = new SplendidGrandPiano(context.audio, {
      storage: sharedCacheStorage,
      velocity: splendidGrandPianoVelocity,
      notesToLoad: {
        notes: [nearestSampleMidi],
        velocityRange: splendidGrandPianoVelocityRange,
      },
    });

    let active = true;
    piano.load.then(() => {
      if (active) {
        setLoadedPiano({ note, piano });
      }
    });

    return () => {
      active = false;
      piano.stop();
    };
  }, [context, enabled, note]);

  const loaded = enabled && loadedPiano?.note === note;

  return {
    loaded,
    async playNote() {
      if (!context || !loadedPiano || loadedPiano.note !== note) {
        throw Error(`Piano not loaded for note '${note}'`);
      }

      return new Promise((resolve) => {
        void context.audio.resume().catch(() => {});
        loadedPiano.piano.start({ note, duration: 1, onEnded: () => resolve() });
      });
    },
  };
}
