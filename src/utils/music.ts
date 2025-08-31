import { Note as TonalNote } from 'tonal';
import { randomInt } from './math';

export enum Altered {
  Flat = 0,
  Sharp,
}

export function noteFromFrequency(frequency: number, altered: Altered): string {
  return altered === 1 ? TonalNote.fromFreqSharps(frequency) : TonalNote.fromFreq(frequency);
}

export function nextNote(note: string): string {
  return TonalNote.transpose(note, 'm2');
}

export function frequencyDiff(from: string, to: string): number {
  const fromNote = TonalNote.get(from);
  const toNote = TonalNote.get(to);
  const diff = toNote.freq! - fromNote.freq!;
  return Math.round(diff * 100) / 100;
}

export type Note = { spn: string; altered: Altered };

export function randomNoteFromArray(notes: string[], previous?: string): Note {
  const altered = notes.find((note) => note.includes('b')) ? Altered.Flat : Altered.Sharp;
  if (notes.length === 1) {
    return { altered, spn: noteFromFrequency(TonalNote.get(notes[0]).freq!, altered) };
  }

  const note = notes[randomInt(0, notes.length - 1)];
  if (note === previous) {
    return randomNoteFromArray(notes, previous);
  }

  return { altered, spn: note };
}

export function randomNoteFromRange(from: string, to: string, previous?: string): Note {
  const altered = Math.round(Math.random());
  if (from === to) {
    return { altered, spn: noteFromFrequency(TonalNote.get(from).freq!, altered) };
  }

  const frequency = randomInt(TonalNote.get(from).freq!, TonalNote.get(to).freq!);
  const note = noteFromFrequency(frequency, altered);
  if (note === previous) {
    return randomNoteFromRange(from, to, previous);
  }

  return { altered, spn: note };
}
