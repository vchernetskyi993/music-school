import { useState } from 'react';

interface Player {
  playNote: (note: string) => Promise<void>;
}

const noteLength = '8n';

export function usePlayer(): Player {
  const [cachedTone, setTone] = useState<any>();
  const importTone = async () => {
    const tone = await import('tone');
    setTone(tone);
    return tone;
  };
  const buildAudio = (tone: any) => {
    const audio = new tone.Synth().toDestination();
    setAudio(audio);
    return audio;
  };
  const [cachedAudio, setAudio] = useState<any>();
  return {
    async playNote(note) {
      const tone = cachedTone || await importTone();
      const audio = cachedAudio || buildAudio(tone);
      return new Promise((resolve) => {
        tone.start().then(() => {
          audio.triggerAttackRelease(note, noteLength);
          audio.onsilence = () => resolve();
        });
      });
    },
  };
}
