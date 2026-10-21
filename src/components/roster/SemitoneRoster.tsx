import { parseSemitonesInput, useSemitonesInput } from '@/hooks/roster/semitones';

import { Roster } from './Roster';

const usage =
  "Supports either range (e.g., '1-5') or comma-separated list of semitones (e.g., '3,5,7'). Ranges and lists can be combined (e.g., '3,5,7-9').";

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
