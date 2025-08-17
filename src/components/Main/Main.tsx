import { useEffect, useReducer } from 'react';
import { PitchDetector } from 'pitchy';
import { Container, Loader, Text } from '@mantine/core';

type Detector = PitchDetector<Float32Array<ArrayBufferLike>>;
export type Props = {
  node?: AnalyserNode;
  detector?: Detector;
  rate?: number;
};
type State = { pitches: number[] };

const minClarity = 95;

export function MusicSchool({ node, detector, rate }: Props) {
  const [state, dispatch] = useReducer(reducer, { pitches: [] });
  useEffect(() => {
    if (node && detector && rate) {
      findPitch(node, detector, rate).then((pitch) => dispatch(Math.round(pitch)));
    }
  }, [node, detector, rate, state]);
  return (
    <Container fluid>
      <Text c="lime" ta="center" size="xl" maw={580} mx="auto" mt="xl">
        {state.pitches.join(' ')}
      </Text>
      <Text c="dimmed" ta="center" size="md" maw={580} mx="auto" mt="sm">
        Waiting for note...
      </Text>
      <Loader color="blue" type="dots" mx="auto" />
    </Container>
  );
}

function reducer(state: State, pitch: number): State {
  return {
    pitches: state.pitches.concat([pitch]),
  };
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

async function averagePitch(
  initialPitch: number,
  nextPitch: () => number | null,
): Promise<number> {
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
  if (pitch == 0 || clarity * 100 <= minClarity) {
    return null;
  }
  return pitch;
}

async function delay(millis: number) {
  await new Promise<void>((resolve) => setTimeout(resolve, millis));
}
