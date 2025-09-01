import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CacheStorage, SplendidGrandPiano } from 'smplr';
import { ContextType } from '@/App';

interface Player {
  loaded: boolean;
  playNote: (note: string) => Promise<void>;
}

export function usePlayer(): Player {
  const context = useOutletContext<ContextType | null>();
  const [loaded, setLoaded] = useState(false);
  const piano = useMemo(
    () => context && new SplendidGrandPiano(context.audio, { storage: new CacheStorage() }),
    [context]
  );
  useEffect(() => {
    if (piano) {
      piano.load.then(() => setLoaded(true));
    }
  }, [piano]);

  return {
    loaded,
    async playNote(note) {
      return new Promise((resolve) => {
        piano!.start({ note, duration: 1, onEnded: () => resolve() });
      });
    },
  };
}
