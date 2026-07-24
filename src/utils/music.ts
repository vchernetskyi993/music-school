import { Interval, Range, Note as TonalNote } from 'tonal';
import { randomInt } from './math';

export enum Alteration {
  Flat = 0,
  Sharp,
  None,
}

export function noteFromFrequency(frequency: number, alteration: Alteration): string {
  return alteration === Alteration.Flat
    ? TonalNote.fromFreq(frequency)
    : TonalNote.fromFreqSharps(frequency);
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

export function getAlteration(note: string): Alteration {
  return note.includes('b')
    ? Alteration.Flat
    : note.includes('#')
      ? Alteration.Sharp
      : Alteration.None;
}

export function isAltered(note: string): boolean {
  return getAlteration(note) !== Alteration.None;
}

export function randomAlteration(): Alteration {
  return Math.round(Math.random());
}

export function randomNoteFromArray(notes: string[], previous?: string): string {
  const note = notes[randomInt(0, notes.length - 1)];
  if (previous && TonalNote.get(note).freq === TonalNote.get(previous).freq) {
    return randomNoteFromArray(notes, previous);
  }

  return note;
}

export function arrayRosterFromRange(from: string, to: string, alteration: Alteration): string[] {
  const opts = alteration ? { sharps: true } : {};
  return Range.chromatic([from, to], opts);
}

export function enumerateIntervals(notes: string[]): { note: string; interval: string }[] {
  return notes.flatMap((from) => {
    return notes
      .map((to) => Interval.get(Interval.distance(from, to)))
      .filter((interval) => interval.semitones >= 1)
      .filter((interval) => interval.semitones <= 12)
      .map((interval) => `${interval.q}${interval.num}`)
      .map((interval) => ({ note: from, interval }));
  });
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

export function getMidi(note: string): number | null {
  return TonalNote.get(note).midi;
}

export function getFrequency(note: string): number | null {
  return TonalNote.get(note).freq;
}
