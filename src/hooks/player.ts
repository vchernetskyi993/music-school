import { useEffect, useMemo, useState } from 'react';
import { Howl } from 'howler';
import { getMidi } from '@/utils/music';

interface Player {
  loaded: boolean;
  playNote: (note: string) => Promise<void>;
}

type Sample = {
  file: string;
  key: string;
  midi: number;
  note: string;
  url: string;
};

type SampleDefinition = {
  file: string;
  note: string;
};

type Playback = {
  rate: number;
  sample: Sample;
};

const noteDurationMs = 1000;
const fadeDurationMs = 100;
const sampleBaseUrl =
  'https://cdn.jsdelivr.net/npm/@audio-samples/piano-mp3-velocity8@1.0.5/audio/';

const sampleDefinitions: SampleDefinition[] = [
  { note: 'A0', file: 'A0v8.mp3' },
  { note: 'A1', file: 'A1v8.mp3' },
  { note: 'A2', file: 'A2v8.mp3' },
  { note: 'A3', file: 'A3v8.mp3' },
  { note: 'A4', file: 'A4v8.mp3' },
  { note: 'A5', file: 'A5v8.mp3' },
  { note: 'A6', file: 'A6v8.mp3' },
  { note: 'A7', file: 'A7v8.mp3' },
  { note: 'C1', file: 'C1v8.mp3' },
  { note: 'C2', file: 'C2v8.mp3' },
  { note: 'C3', file: 'C3v8.mp3' },
  { note: 'C4', file: 'C4v8.mp3' },
  { note: 'C5', file: 'C5v8.mp3' },
  { note: 'C6', file: 'C6v8.mp3' },
  { note: 'C7', file: 'C7v8.mp3' },
  { note: 'C8', file: 'C8v8.mp3' },
  { note: 'D#1', file: 'D#1v8.mp3' },
  { note: 'D#2', file: 'D#2v8.mp3' },
  { note: 'D#3', file: 'D#3v8.mp3' },
  { note: 'D#4', file: 'D#4v8.mp3' },
  { note: 'D#5', file: 'D#5v8.mp3' },
  { note: 'D#6', file: 'D#6v8.mp3' },
  { note: 'D#7', file: 'D#7v8.mp3' },
  { note: 'F#1', file: 'F#1v8.mp3' },
  { note: 'F#2', file: 'F#2v8.mp3' },
  { note: 'F#3', file: 'F#3v8.mp3' },
  { note: 'F#4', file: 'F#4v8.mp3' },
  { note: 'F#5', file: 'F#5v8.mp3' },
  { note: 'F#6', file: 'F#6v8.mp3' },
  { note: 'F#7', file: 'F#7v8.mp3' },
];

const samples: Sample[] = sampleDefinitions
  .map((sample) => ({
    ...sample,
    key: sample.file,
    midi: getMidi(sample.note)!,
    url: `${sampleBaseUrl}${encodeURIComponent(sample.file)}`,
  }))
  .sort((a, b) => a.midi - b.midi);

const loadedSamples = new Map<string, Howl>();
const loadingSamples = new Map<string, Promise<Howl>>();

export function usePlayer(note?: string): Player {
  const playback = useMemo(() => (note ? safePlaybackForNote(note) : null), [note]);
  const [loaded, setLoaded] = useState(() =>
    playback ? loadedSamples.has(playback.sample.key) : false
  );

  useEffect(() => {
    setLoaded(playback ? loadedSamples.has(playback.sample.key) : false);

    if (!playback || loadedSamples.has(playback.sample.key)) {
      return;
    }

    let cancelled = false;
    loadSample(playback.sample).then(() => {
      if (!cancelled) {
        setLoaded(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [playback]);

  return {
    loaded,
    async playNote(note) {
      const playback = safePlaybackForNote(note);
      if (!playback) {
        return;
      }
      const sample = loadedSamples.get(playback.sample.key) ?? (await loadSample(playback.sample));
      return playSample(sample, playback.rate);
    },
  };
}

function playbackForNote(note: string): Playback {
  const targetMidi = getMidi(note)!;
  const sample = samples.reduce((nearest, sample) => {
    return Math.abs(sample.midi - targetMidi) < Math.abs(nearest.midi - targetMidi)
      ? sample
      : nearest;
  });
  return {
    rate: 2 ** ((targetMidi - sample.midi) / 12),
    sample,
  };
}

function safePlaybackForNote(note: string): Playback | null {
  try {
    return playbackForNote(note);
  } catch {
    return null;
  }
}

function loadSample(sample: Sample): Promise<Howl> {
  const loaded = loadedSamples.get(sample.key);
  if (loaded) {
    return Promise.resolve(loaded);
  }

  const loading = loadingSamples.get(sample.key);
  if (loading) {
    return loading;
  }

  const promise = new Promise<Howl>((resolve, reject) => {
    const howl = new Howl({
      format: ['mp3'],
      onload: () => {
        loadedSamples.set(sample.key, howl);
        resolve(howl);
      },
      onloaderror: (_, error) => {
        loadingSamples.delete(sample.key);
        howl.unload();
        reject(error);
      },
      preload: true,
      src: [sample.url],
    });
  });
  loadingSamples.set(sample.key, promise);
  return promise;
}

function playSample(sample: Howl, rate: number): Promise<void> {
  return new Promise((resolve) => {
    const soundId = sample.play();
    sample.rate(rate, soundId);
    sample.volume(1, soundId);

    window.setTimeout(
      () => sample.fade(1, 0, fadeDurationMs, soundId),
      noteDurationMs - fadeDurationMs
    );
    window.setTimeout(() => {
      sample.stop(soundId);
      resolve();
    }, noteDurationMs);
  });
}
