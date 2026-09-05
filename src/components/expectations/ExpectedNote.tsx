import { useSettings } from '@/hooks/settings';
import { toFixedDo } from '@/utils/music';
import { ExpectedText } from './ExpectedText';

export function ExpectedNote({ note }: { note: string }) {
  const settings = useSettings();
  return <ExpectedText text={settings.notation === 'SPN' ? note : toFixedDo(note)} />;
}
