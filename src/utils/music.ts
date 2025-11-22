import { Range, Note as TonalNote } from 'tonal';
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

export function arrayRosterFromRange(from: string, to: string): string[] {
  const altered = Math.random() < 0.5;
  return Range.chromatic([from, to], { sharps: altered });
}

const fixedDoMapping: { [key: string]: string } = {
  C: 'Do',
  D: 'Re',
  E: 'Mi',
  F: 'Fa',
  G: 'Sol',
  A: 'La',
  B: 'Si',
};

const alterationsMapping: { [key: string]: string } = {
  b: '♭',
  '#': '♯',
};

export function toFixedDo(note: string): string {
  const key = Object.keys(fixedDoMapping).find((key) => note.startsWith(key))!;
  const result = note.replace(key, fixedDoMapping[key]);
  return Object.keys(alterationsMapping).reduce(
    (note, alt) => note.replace(alt, alterationsMapping[alt]),
    result
  );
}
