import { useEffect, useState } from 'react';
import { PitchDetector } from 'pitchy';
import { Props as MainProps, NoteVisualizer } from '../components/Main/Main';

export function HomePage() {
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

  return <NoteVisualizer node={state.node} detector={state.detector} rate={state.rate} />;
}
