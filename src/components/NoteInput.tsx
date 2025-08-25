import { useEffect, useState } from 'react';
import { Note } from 'tonal';
import { Input, Text } from '@mantine/core';

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
      <Input
        value={note}
        error={error}
        maw={50}
        onChange={(event) => {
          const newNote = event.currentTarget.value;
          const error = validate(newNote);
          setError(error);
          setNote(newNote);
        }}
      />
    </>
  );
}
