import { Note } from 'tonal';

export enum Altered {
  Flat = 0,
  Sharp,
}

export function noteFromFrequency(frequency: number, altered: Altered): string {
  return altered === 1 ? Note.fromFreqSharps(frequency) : Note.fromFreq(frequency);
}

export function nextNote(note: string): string {
  return Note.transpose(note, 'm2');
}

export function frequencyDiff(from: string, to: string): number {
  const fromNote = Note.get(from);
  const toNote = Note.get(to);
  const diff = toNote.freq! - fromNote.freq!;
  return Math.round(diff * 100) / 100;
}
