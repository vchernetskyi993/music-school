import { useEffect, useState } from 'react';
import { Note } from 'tonal';
import { Popover, Text, TextInput } from '@mantine/core';

export function NoteInput({
  label,
  note,
  setNote,
  validation,
  validationError,
  refresh,
}: {
  label: string;
  note: string;
  setNote: (note: string) => void;
  validation: (note: string) => boolean;
  validationError: string;
  refresh: () => void;
}) {
  const [error, setError] = useState<string>('');
  const validate = (newTo: string) => {
    const note = Note.get(newTo);
    if (!note.freq) {
      return 'Not a note!';
    }
    if (validation(newTo)) {
      return validationError;
    }
    return '';
  };
  useEffect(() => {
    if (!error) {
      refresh();
    }
  }, [error]);
  return (
    <>
      <Text>{label}</Text>
      <Popover opened={!!error} withArrow arrowSize={10}>
        <Popover.Target>
          <TextInput
            styles={{
              input: { textAlign: 'center' },
            }}
            value={note}
            error={!!error}
            maw={55}
            onChange={(event) => {
              const newNote = event.currentTarget.value;
              const error = validate(newNote);
              setError(error);
              setNote(newNote);
            }}
          />
        </Popover.Target>
        <Popover.Dropdown c="red">{error}</Popover.Dropdown>
      </Popover>
    </>
  );
}
