import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { map, takeWhile, timer } from 'rxjs';
import { IAnalyserNode, IAudioContext } from 'standardized-audio-context';
import { ContextType, Detector } from '@/App';

export type NoteSound = { note: string; frequency: number };

const config = {
  /**
   * Time in milliseconds to wait between pitch capture attempts.
   */
  captureInterval: 50,
};

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
      let aborted = false;
      timer(0, config.captureInterval)
        .pipe(
          takeWhile(() => !aborted),
          map(() => singlePitch(node, detector, rate))
        )
        .subscribe((captured) => {
          if (captured) {
            setFrequency(Math.round(captured * 100) / 100);
          } else {
            setFrequency(null);
          }
        });
      return () => {
        aborted = true;
      };
    }
  }, [context, opts.pause]);
  return frequency;
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
