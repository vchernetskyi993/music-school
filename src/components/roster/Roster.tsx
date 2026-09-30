import { Popover, TextInput, Tooltip } from '@mantine/core';

const arrowSize = 10;

export function Roster<T>({
  useInput,
  parseInput,
  label,
  usage,
}: {
  useInput: () => [string, (input: string) => void];
  parseInput: (input: string) => T | string;
  label: string;
  usage: string;
}) {
  const [input, setInput] = useInput();
  const parsed = parseInput(input);
  const error = typeof parsed === 'string' ? parsed : '';

  return (
    <Popover opened={!!error} withArrow arrowSize={arrowSize}>
      <Popover.Target>
        <Tooltip label={usage} multiline>
          <TextInput
            value={input}
            error={!!error}
            onChange={(event) => setInput(event.currentTarget.value)}
            label={label}
          />
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown c="red">{error}</Popover.Dropdown>
    </Popover>
  );
}
