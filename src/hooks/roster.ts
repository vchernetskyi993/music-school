import { useMemo } from 'react';
import { Range, Note as TonalNote } from 'tonal';
import { useLocalStorage } from '@mantine/hooks';
import { Altered, arrayRosterFromRange, Note, randomNoteFromArray, spnToMidi } from '@/utils/music';

export type Roster = string[] | Range;
export type Range = { from: string; to: string };
type RosterOptions = { requireSoundSupport?: boolean };

export function useRoster(options?: RosterOptions): Roster | null {
  const [roster] = useRosterInternal(options);
  return roster;
}

export function useRosterInput(options?: RosterOptions): [string, (input: string) => void] {
  const [_, input, setInput] = useRosterInternal(options);
  return [input, setInput];
}

export function parseRosterInput(input: string, options?: RosterOptions): Roster | string {
  if (input.includes('-')) {
    const [from, to] = input.split('-');
    return (
      validateNote(from, options) ||
      validateNote(to, options) ||
      validateRange(from, to) || { from, to }
    );
  }
  const notes = input.split(',');
  return (
    validateAlteration(input) ||
    notes.map((note) => validateNote(note, options)).find((e) => !!e) ||
    notes
  );
}

export function randomNoteFromRoster(roster?: Roster | null, previous?: string): Note {
  if (!roster) {
    return { spn: '', altered: Altered.Sharp };
  }
  const normalizedRoster =
    roster instanceof Array ? roster : arrayRosterFromRange(roster.from, roster.to);
  return randomNoteFromArray(normalizedRoster, previous);
}

export function firstNoteFromRoster(roster?: Roster | null): string {
  if (!roster) {
    return '';
  }
  return roster instanceof Array ? roster[0] : roster.from;
}

const defaultRoster: Roster = { from: 'E2', to: 'E5' };

function useRosterInternal(
  options?: RosterOptions
): [Roster | null, string, (input: string) => void] {
  const requireSoundSupport = options?.requireSoundSupport;
  const [input, setInput] = useLocalStorage({
    key: 'note-roster',
    defaultValue: rosterToString(defaultRoster),
  });
  const roster = useMemo(
    () => rosterFromInput(input, { requireSoundSupport }),
    [input, requireSoundSupport]
  );
  return [roster, input, setInput];
}

function rosterFromInput(input: string, options?: RosterOptions): Roster | null {
  const parsed = parseRosterInput(input, options);
  return typeof parsed === 'string' ? null : (parsed as Roster);
}

function rosterToString(roster: Roster): string {
  return roster instanceof Array ? roster.join(',') : `${roster.from}-${roster.to}`;
}

function validateNote(note: string, options?: RosterOptions): string {
  if (!TonalNote.get(note).freq) {
    return `Invalid note '${note}'!`;
  }

  if (options?.requireSoundSupport) {
    const midi = spnToMidi(note);
    if (midi < 0 || midi > 127) {
      return `Unsupported note '${note}'`;
    }
  }

  return '';
}

function validateRange(from: string, to: string): string {
  if (TonalNote.get(from).freq! > TonalNote.get(to).freq!) {
    return 'From should be smaller than to!';
  }
  return '';
}

function validateAlteration(input: string): string {
  if (input.includes('#') && input.includes('b')) {
    return 'Either flats or sharps are allowed!';
  }
  return '';
}
