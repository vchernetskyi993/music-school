import { parseNotesInput, useNotesInput } from '@/hooks/roster/notes';

import { Roster } from './Roster';

const usage =
  "Supports either range (e.g., 'C3-E3') or comma-separated list of notes (e.g., 'C3,D3,E3'). Ranges and lists can be combined (e.g., 'E2,G2,A2-C3').";

export function NoteRoster({ semitones }: { semitones?: number[] | null }) {
  return (
    <Roster
      useInput={useNotesInput}
      parseInput={(input) => parseNotesInput(input, { semitones })}
      label="Notes"
      usage={usage}
    />
  );
}
