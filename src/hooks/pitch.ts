import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { IAnalyserNode, IAudioContext } from 'standardized-audio-context';
import { ContextType, Detector } from '@/App';
import { delay } from '@/utils/async';
import { median } from '@/utils/math';

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
};

type Abortable = { aborted: boolean };
type Opts = { step: number; pause: boolean };

export function useSound(opts: Opts): number | null {
  const context = useOutletContext<ContextType | null>();
  const [frequency, setFrequency] = useState<number | null>(null);
  useEffect(() => {
    if (opts.pause) {
      return;
    }
    if (context) {
      const { node, detector, rate } = context;
      const abortable = { aborted: false };
      captureFrequency(node, detector, rate, opts.step!, abortable).then((captured) => {
        if (captured) {
          setFrequency(Math.round(captured * 100) / 100);
        }
      });
      return () => {
        abortable.aborted = true;
      };
    }
  }, [context, frequency, opts.pause]);
  return frequency;
}

async function captureFrequency(
  node: IAnalyserNode<IAudioContext>,
  detector: Detector,
  rate: number,
  step: number,
  abortable: Abortable
): Promise<number | null> {
  const nextPitch = () => singlePitch(node, detector, rate);
  let result: number | null = null;
  while (result == null) {
    if (abortable.aborted) {
      return null;
    }
    await delay(config.captureDelay);
    const pitch = nextPitch();
    if (pitch == null) {
      result = pitch;
      continue;
    }
    result = await approximatePitch(pitch, step, nextPitch, abortable);
    // console.log(`Approximate pitch: ${result}`);
  }
  return result;
}

async function approximatePitch(
  initialPitch: number,
  step: number,
  nextPitch: () => number | null,
  abortable: Abortable
): Promise<number | null> {
  const pitches: number[] = [];
  let latestPitch: number | null = initialPitch;
  let waitedFor = 0;
  const isSameNote = () => {
    return (
      pitches.length === 0 ||
      (!!latestPitch && Math.abs(pitches[pitches.length - 1] - latestPitch) <= step)
    );
  };
  while (latestPitch != null && waitedFor < config.maxWait) {
    if (abortable.aborted) {
      return null;
    }
    if (!isSameNote()) {
      break;
    }
    pitches.push(latestPitch);
    await delay(config.captureDelay);
    waitedFor += config.captureDelay;
    latestPitch = nextPitch();
  }
  return median(pitches);
}

function singlePitch(
  node: IAnalyserNode<IAudioContext>,
  detector: Detector,
  rate: number
): number | null {
  const input = new Float32Array(detector.inputLength);
  node.getFloatTimeDomainData(input);
  const [pitch] = detector.findPitch(input, rate);
  // console.log(`Pitch: ${pitch}, Clarity: ${clarity}`);
  if (pitch === 0) {
    return null;
  }
  return pitch;
}
