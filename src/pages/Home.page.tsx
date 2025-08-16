import { useMantineColorScheme } from '@mantine/core';
import { MusicSchool } from '../components/Main/Main';

export function HomePage() {
  const { setColorScheme } = useMantineColorScheme();
  setColorScheme('dark');

  return <MusicSchool />;
}
