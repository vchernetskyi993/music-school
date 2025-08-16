import { useMemo, useReducer } from 'react';
import { Container, Loader, Text } from '@mantine/core';

type State = { pitches: number[] };

export function MusicSchool() {
  const [state, dispatch] = useReducer(reducer, { pitches: [] });
  useMemo(() => dispatch(440), []);
  useMemo(() => dispatch(530), []);
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
