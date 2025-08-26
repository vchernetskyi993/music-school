import { useEffect, useState } from 'react';
import { Note } from 'tonal';
import { Popover, Text, TextInput } from '@mantine/core';

export function NoteInput({
  label,
  note,
  setNote,
  pairNote,
  validator,
  validationError,
  refresh,
}: {
  label: string;
  note: string;
  setNote: (note: string) => void;
  pairNote: string;
  validator: (noteFreq: number, pairNoteFreq: number) => boolean;
  validationError: string;
  refresh: () => void;
}) {
  const [error, setError] = useState<string>('');
  const validate = (newTo: string) => {
    const note = Note.get(newTo);
    if (!note.freq) {
      return 'Not a note!';
    }
    if (validator(Note.get(newTo).freq!, Note.get(pairNote).freq!)) {
      return validationError;
    }
    return '';
  };
  useEffect(() => {
    setError(validate(note));
  }, [pairNote]);
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
              setError(validate(newNote));
              setNote(newNote);
            }}
          />
        </Popover.Target>
        <Popover.Dropdown c="red">{error}</Popover.Dropdown>
      </Popover>
    </>
  );
}
