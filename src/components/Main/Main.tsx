import { useEffect, useReducer } from 'react';
import { PitchDetector } from 'pitchy';
import { Note } from 'tonal';
import { Container, Group, Loader, Stack, Text } from '@mantine/core';

type Detector = PitchDetector<Float32Array<ArrayBufferLike>>;
export type Props = {
  node?: AnalyserNode;
  detector?: Detector;
  rate?: number;
};
type State = { note: string; pitch: number };

const minClarity = 95;

export function NoteVisualizer({ node, detector, rate }: Props) {
  const [state, dispatch] = useReducer(reducer, { note: 'C4', pitch: 263 });
  useEffect(() => {
    if (node && detector && rate) {
      findPitch(node, detector, rate).then((pitch) => dispatch(Math.round(pitch)));
    }
  }, [node, detector, rate, state]);
  return (
    <Container fluid>
      <Group justify="center">
        <Stack gap="xs">
          <Text c="grape" ta="center" size="xl" mt="md">
            {state.note}
          </Text>
          <Text c="lime" size="lg">
            {state.pitch}Hz
          </Text>
        </Stack>
      </Group>
      <Text c="dimmed" ta="center" size="md" maw={580} mx="auto" mt="sm">
        Waiting for note...
      </Text>
      <Loader color="blue" type="dots" mx="auto" />
    </Container>
  );
}

function reducer(_state: State, pitch: number): State {
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

async function delay(millis: number) {
  await new Promise<void>((resolve) => setTimeout(resolve, millis));
}
