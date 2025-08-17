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

export function MusicSchool({ node, detector, rate }: Props) {
  const [state, dispatch] = useReducer(reducer, { pitches: [] });
  useEffect(() => {
    async function findPitch(
      node: AnalyserNode,
      detector: Detector,
      rate: number
    ): Promise<number> {
      let result = 0;
      while (result == 0) {
        result = await new Promise((resolve) =>
          setTimeout(() => {
            const input = new Float32Array(detector.inputLength);
            node.getFloatTimeDomainData(input);
            const [pitch, clarity] = detector.findPitch(input, rate);
            console.log(`Pitch: ${pitch}, Clarity: ${clarity}`);
            resolve(pitch);
          }, 100)
        );
      }
      return result;
    }
    if (node && detector && rate) {
      findPitch(node, detector, rate).then((pitch) => dispatch(pitch));
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
