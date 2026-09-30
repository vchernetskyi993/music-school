import { Popover, TextInput, Tooltip } from '@mantine/core';

import { parseRosterInput, useRosterInput } from '@/hooks/roster';

const arrowSize = 10;
const usage =
  "Supports either semitones range (e.g., '1-12') or comma-separated list of semitones (e.g., '3,4,6')";

export function IntervalRoster({ intervals }: { intervals?: boolean }) {
  const [input, setInput] = useRosterInput();
  const parsed = parseRosterInput(input, { intervals });
  const error = typeof parsed === 'string' ? parsed : '';

  return (
    <Popover opened={!!error} withArrow arrowSize={arrowSize}>
      <Popover.Target>
        <Tooltip label={usage} multiline>
          <TextInput
            value={input}
            error={!!error}
            onChange={(event) => setInput(event.currentTarget.value)}
            label="Notes"
          />
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown c="red">{error}</Popover.Dropdown>
    </Popover>
  );
}
