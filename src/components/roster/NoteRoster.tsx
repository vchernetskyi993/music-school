import { parseRosterInput, useRosterInput } from '@/hooks/roster/notes';

import { Roster } from './Roster';

const usage =
  "Supports either range (e.g., 'C3-E3') or comma-separated list of notes (e.g., 'C3,D3,E3')";

export function NoteRoster({ semitones }: { semitones?: number[] }) {
  return (
    <Roster
      useInput={useRosterInput}
      parseInput={(input) => parseRosterInput(input, { semitones })}
      label="Notes"
      usage={usage}
    />
  );
}
