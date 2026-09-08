import { useSettings } from '@/hooks/settings';
import { IntervalState, Pair, toFixedDo, toInterval } from '@/utils/music';
import { ExpectedText } from './ExpectedText';

export function ExpectedInterval({ notes, state }: { notes: Pair; state: IntervalState }) {
  const settings = useSettings();
  const note = settings.notation === 'SPN' ? notes.from : toFixedDo(notes.from);
  const interval = toInterval(notes);
  const index = state === IntervalState.From ? 1 : 2;
  return <ExpectedText text={`${note} +${interval} (${index})`} />;
}
