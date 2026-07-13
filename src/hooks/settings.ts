import { useLocalStorage } from '@mantine/hooks';

export type Notation = 'SPN' | 'Fixed Do';

type Settings = {
  hint: boolean;
  counter: boolean;
  notation: Notation;
};

export function useSettings(): Settings {
  const [settings, _] = useMutableSettings();
  return settings;
}

export function useMutableSettings(): [Settings, (settings: Settings) => void] {
  const [settings, setSettings] = useLocalStorage<Settings>({
    key: 'settings',
    defaultValue: { hint: false, counter: false, notation: 'SPN' },
  });
  return [settings, setSettings];
}
