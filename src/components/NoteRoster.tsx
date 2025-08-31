import { useEffect, useState } from 'react';
import { Group, Popover, Text, TextInput, Tooltip } from '@mantine/core';
import { parseRosterInput, useRosterInput } from '@/hooks/roster';

const arrowSize = 10;
const usage =
  "Supports either range (e.g., 'C3-E3') or comma-separated list of notes (e.g., 'C3,D3,E3')";

export function NoteRoster() {
  const [input, setInput] = useRosterInput();
  const [error, setError] = useState('');

  useEffect(() => {
    const parsed = parseRosterInput(input);
    if (typeof parsed === 'string') {
      setError(parsed as string);
    } else {
      setError('');
    }
  }, [input]);

  return (
    <Group justify="center" mt="md">
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
