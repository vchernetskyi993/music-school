import { useEffect, useReducer } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Note } from 'tonal';
import { ContextType, Detector } from '@/App';
import { delay } from './async';
import { median } from './math';

export type NoteSound = { note: string; frequency: number };

const config = {
  /**
   * Time in milliseconds to wait between pitch capture attempts.
   */
  captureDelay: 50,

  /**
   * Maximum time in milliseconds to produce note sound from received pitches.
   */
  maxWait: 500,

  /**
   * Minimum pitch clarity to consider for frequency detection.
   * Valid range: 0-100.
   */
  minClarity: 80,
};

type Opts = { defaultNote?: NoteSound; step: number };

export function useNoteSound(opts: Opts): NoteSound | undefined {
  const context = useOutletContext<ContextType | null>();
  const [state, dispatch] = useReducer(reducer, opts.defaultNote);
  useEffect(() => {
    if (context) {
      const { node, detector, rate } = context;
      captureFrequency(node, detector, rate, opts.step!).then((frequency) =>
        dispatch(Math.round(frequency))
      );
    }
  }, [context, state]);
  return state;
}

function reducer(_state: NoteSound | undefined, frequency: number): NoteSound {
  const note = Note.fromFreqSharps(frequency);
  return { note, frequency };
}

async function captureFrequency(
  node: AnalyserNode,
  detector: Detector,
  rate: number,
  step: number
): Promise<number> {
  const nextPitch = () => singlePitch(node, detector, rate);
  let result: number | null = null;
  while (result == null) {
    await delay(config.captureDelay);
    const pitch = nextPitch();
    if (pitch == null) {
      result = pitch;
      continue;
    }
    result = await approximatePitch(pitch, step, nextPitch);
    console.log(`Approximate pitch: ${result}`);
  }
  return result;
}

async function approximatePitch(
  initialPitch: number,
  step: number,
  nextPitch: () => number | null
): Promise<number> {
  const pitches: number[] = [];
  let latestPitch: number | null = initialPitch;
  let waitedFor = 0;
  const isSameNote = () => {
    return (
      pitches.length === 0 ||
      (!!latestPitch && Math.abs(pitches[pitches.length - 1] - latestPitch) <= step)
    );
  };
  while (latestPitch != null && isSameNote() && waitedFor < config.maxWait) {
    pitches.push(latestPitch);
    await delay(config.captureDelay);
    waitedFor += config.captureDelay;
    latestPitch = nextPitch();
  }
  return median(pitches);
}

function singlePitch(node: AnalyserNode, detector: Detector, rate: number): number | null {
  const input = new Float32Array(detector.inputLength);
  node.getFloatTimeDomainData(input);
  const [pitch, clarity] = detector.findPitch(input, rate);
  console.log(`Pitch: ${pitch}, Clarity: ${clarity}`);
  if (pitch === 0 || clarity * 100 <= config.minClarity) {
    return null;
  }
  return pitch;
}
