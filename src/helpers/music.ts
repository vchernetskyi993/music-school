import { Note } from 'tonal';

export function nextNote(note: string): string {
  return Note.transpose(note, 'm2');
}

export function frequencyDiff(from: string, to: string): number {
  const fromNote = Note.get(from);
  const toNote = Note.get(to);
  const diff = toNote.freq! - fromNote.freq!;
  return Math.round(diff * 100) / 100;
}
