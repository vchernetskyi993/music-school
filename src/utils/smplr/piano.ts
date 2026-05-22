import { LAYERS } from 'smplr';

type SplendidGrandPianoLayer = {
  vel_range: [number, number];
  samples: [number, string][];
};

export const splendidGrandPianoVelocity = 100;

const splendidGrandPianoLayers = LAYERS as unknown as SplendidGrandPianoLayer[];
const splendidGrandPianoLayer = splendidGrandPianoLayers.find(({ vel_range: [low, high] }) => {
  return splendidGrandPianoVelocity >= low && splendidGrandPianoVelocity <= high;
})!;
const splendidGrandPianoSampleMidiNotes = splendidGrandPianoLayer.samples
  .map(([midi]) => midi)
  // descending sort to prefer higher pitch as is done in smplr itself
  .sort((left, right) => right - left);

export const splendidGrandPianoVelocityRange = splendidGrandPianoLayer.vel_range;

export function nearestSplendidGrandPianoSampleMidi(midi: number): number {
  if (!Number.isInteger(midi) || midi < 0 || midi > 127) {
    throw Error(`Invalid MIDI note '${midi}'`);
  }

  return splendidGrandPianoSampleMidiNotes.reduce((nearest, sampleMidi) => {
    const distance = Math.abs(midi - sampleMidi);
    const nearestDistance = Math.abs(midi - nearest);

    if (distance < nearestDistance) {
      return sampleMidi;
    }

    return nearest;
  });
}
