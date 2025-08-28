import { useState } from 'react';
import { Note } from 'tonal';
import { Group, Popover, Text, TextInput } from '@mantine/core';

const width = 55;
const arrowSize = 10;

export function NoteRange({
  from,
  setFrom,
  to,
  setTo,
}: {
  from: string;
  setFrom: (note: string) => void;
  to: string;
  setTo: (note: string) => void;
}) {
  const [fromError, setFromError] = useState('');
  const [toError, setToError] = useState('');
  return (
    <Group justify="center" mt="md">
      <Text>From:</Text>
      <Popover opened={!!fromError} withArrow arrowSize={arrowSize}>
        <Popover.Target>
          <TextInput
            styles={{
              input: { textAlign: 'center' },
            }}
            value={from}
            error={!!fromError}
            maw={width}
            onChange={(event) => {
              const newFrom = event.currentTarget.value;
              setFromError(validateIsNote(newFrom) || validateRange(newFrom, to));
              setFrom(newFrom);
            }}
          />
        </Popover.Target>
        <Popover.Dropdown c="red">{fromError}</Popover.Dropdown>
      </Popover>
      <Text>To:</Text>
      <Popover opened={!!toError} withArrow arrowSize={arrowSize}>
        <Popover.Target>
          <TextInput
            styles={{
              input: { textAlign: 'center' },
            }}
            value={to}
            error={!!toError}
            maw={width}
            onChange={(event) => {
              const newTo = event.currentTarget.value;
              setToError(validateIsNote(newTo) || validateRange(from, newTo));
              setTo(newTo);
            }}
          />
        </Popover.Target>
        <Popover.Dropdown c="red">{toError}</Popover.Dropdown>
      </Popover>
    </Group>
  );
}

function validateIsNote(note: string): string {
  if (!Note.get(note).freq) {
    return 'Note a note!';
  }
  return '';
}

function validateRange(from: string, to: string): string {
  if (Note.get(from).freq! > Note.get(to).freq!) {
    return 'From should be smaller than to!';
  }
  return '';
}
