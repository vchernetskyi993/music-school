import { useEffect, useReducer } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Note } from 'tonal';
import { ContextType, Detector } from '@/App';
import { delay } from './async';

export type NoteSound = { note: string; pitch: number };

const minClarity = 80;

export function useNoteSound(
  opts: { defaultNote: NoteSound | null } = { defaultNote: null }
): NoteSound | null {
  const context = useOutletContext<ContextType | null>();
  const [state, dispatch] = useReducer(reducer, opts.defaultNote);
  useEffect(() => {
    if (context) {
      const { node, detector, rate } = context;
      findPitch(node, detector, rate).then((pitch) => dispatch(Math.round(pitch)));
    }
  }, [context, state]);
  return state;
}

function reducer(_state: NoteSound | null, pitch: number): NoteSound {
  const note = Note.fromFreqSharps(pitch);
  return { note, pitch };
}

async function findPitch(node: AnalyserNode, detector: Detector, rate: number): Promise<number> {
  const nextPitch = () => singlePitch(node, detector, rate);
  let result: number | null = null;
  while (result == null) {
    await delay(50);
    const pitch = nextPitch();
    if (pitch == null) {
      result = pitch;
      continue;
    }
    result = await averagePitch(pitch, nextPitch);
  }
  return result;
}

async function averagePitch(initialPitch: number, nextPitch: () => number | null): Promise<number> {
  const pitches = [];
  let latestPitch: number | null = initialPitch;
  while (latestPitch != null) {
    pitches.push(latestPitch);
    await delay(50);
    latestPitch = nextPitch();
  }
  return pitches.reduce((a, b) => a + b) / pitches.length;
}

function singlePitch(node: AnalyserNode, detector: Detector, rate: number): number | null {
  const input = new Float32Array(detector.inputLength);
  node.getFloatTimeDomainData(input);
  const [pitch, clarity] = detector.findPitch(input, rate);
  // console.log(`Pitch: ${pitch}, Clarity: ${clarity}`);
  if (pitch === 0 || clarity * 100 <= minClarity) {
    return null;
  }
  return pitch;
}
