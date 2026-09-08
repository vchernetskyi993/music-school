import { Interval, IntervalType, Range, Note as TonalNote } from 'tonal';

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

export function arrayRosterFromRange(
  from: string,
  to: string,
  opts: { alteration?: Alteration } = {}
): string[] {
  const alteration =
    opts.alteration ??
    (isAltered(from)
      ? getAlteration(from)
      : isAltered(to)
        ? getAlteration(to)
        : randomAlteration());
  const tonalOpts = alteration === Alteration.Sharp ? { sharps: true } : {};
  return Range.chromatic([from, to], tonalOpts);
}

export type Pair = { from: string; to: string };

export function enumerateIntervals(notes: string[]): Pair[] {
  return notes.flatMap((from) => {
    return notes
      .map((to) => ({ from, to }))
      .filter((pair) => {
        const semitones = tonalInterval(pair).semitones;
        return semitones >= 1 && semitones <= 12;
      });
  });
}

function tonalInterval({ from, to }: Pair): IntervalType {
  return Interval.get(Interval.distance(from, to));
}

export function toInterval(pair: Pair): string {
  const interval = tonalInterval(pair);
  return `${interval.q}${interval.num}`;
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

export function isSameNote(noteA: string, noteB: string): boolean {
  return getFrequency(noteA) === getFrequency(noteB);
}
