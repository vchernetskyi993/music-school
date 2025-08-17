import { useEffect, useState } from 'react';
import { PitchDetector } from 'pitchy';
import { useMantineColorScheme } from '@mantine/core';
import { Props as MainProps, MusicSchool } from '../components/Main/Main';

export function HomePage() {
  const { setColorScheme } = useMantineColorScheme();
  setColorScheme('dark');
  const [state, setState] = useState<MainProps>({});
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new window.AudioContext();
      const analyserNode = audioContext.createAnalyser();
      audioContext.createMediaStreamSource(stream).connect(analyserNode);
      const detector = PitchDetector.forFloat32Array(analyserNode.fftSize);
      detector.minVolumeDecibels = -10;
      setState({ node: analyserNode, detector, rate: audioContext.sampleRate });
    });
  }, []);

  return <MusicSchool node={state.node} detector={state.detector} rate={state.rate} />;
}
