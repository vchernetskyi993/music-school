import { Group, Popover, Text, TextInput, Tooltip } from '@mantine/core';
import { parseRosterInput, useRosterInput } from '@/hooks/roster';

const arrowSize = 10;
const usage =
  "Supports either range (e.g., 'C3-E3') or comma-separated list of notes (e.g., 'C3,D3,E3')";

export function NoteRoster() {
  const [input, setInput] = useRosterInput();
  const parsed = parseRosterInput(input);
  const error = typeof parsed === 'string' ? parsed : '';

  return (
    <Group justify="center">
      <Text>Notes:</Text>
      <Popover opened={!!error} withArrow arrowSize={arrowSize}>
        <Popover.Target>
          <Tooltip label={usage} multiline>
            <TextInput
              value={input}
              error={!!error}
              onChange={(event) => setInput(event.currentTarget.value)}
            />
          </Tooltip>
        </Popover.Target>
        <Popover.Dropdown c="red">{error}</Popover.Dropdown>
      </Popover>
    </Group>
  );
}
