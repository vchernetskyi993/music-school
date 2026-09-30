import { parseSemitonesInput, useSemitonesInput } from '@/hooks/roster/semitones';

import { Roster } from './Roster';

const usage =
  "Supports either range (e.g., 'C3-E3') or comma-separated list of notes (e.g., 'C3,D3,E3')";

export function SemitoneRoster() {
  return (
    <Roster
      useInput={useSemitonesInput}
      parseInput={parseSemitonesInput}
      label="Semitones"
      usage={usage}
    />
  );
}
