import { useEffect, useId, useRef } from 'react';
import { Clef, EasyScore, Factory, type Stave, type StaveNote } from 'vexflow';
import { Box } from '@mantine/core';
import { getMidi } from '@/utils/music';

const staveWidth = 100;
const initialRendererHeight = 200;
const notationColor = '#fff';
const notationStyle = {
  fillStyle: notationColor,
  strokeStyle: notationColor,
};
const middleCMidi = 60;

type StaffClef = 'bass' | 'treble';

type VerticalBounds = {
  getH: () => number;
  getY: () => number;
};

export function ExpectedStaff({ note }: { note: string }) {
  const containerId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || !note) {
      return;
    }

    element.replaceChildren();

    drawExpectedStaff(element, containerId, note);

    return () => element.replaceChildren();
  }, [containerId, note]);

  return (
    <Box
      ref={containerRef}
      id={containerId}
      aria-label={`Expected note ${note} on musical staff`}
      role="img"
    />
  );
}

function drawExpectedStaff(element: HTMLDivElement, containerId: string, note: string) {
  const clef = clefForNote(note);
  const vf = vexFactory(containerId);
  const score = vf.EasyScore();
  const vexNote = toStaveNote(score, note, clef);
  const stave = vf
    .System({
      width: staveWidth,
      x: 0,
    })
    .addStave({
      options: {
        leftBar: true,
      },
      voices: [score.voice([vexNote], { time: '1/4' })],
    })
    .addClef(clef);

  vf.draw();
  cropSvgToNotation(element, stave, vexNote);
}

function vexFactory(containerId: string): Factory {
  const vf = new Factory({
    renderer: {
      elementId: containerId,
      height: initialRendererHeight,
      width: staveWidth,
    },
  });
  const context = vf.getContext();
  context.setFillStyle(notationColor).setStrokeStyle(notationColor);
  return vf;
}

function toStaveNote(score: EasyScore, note: string, clef: StaffClef): StaveNote {
  const [vexNote] = score.notes(`${note}/q`, { clef }) as StaveNote[];
  vexNote.setStyle(notationStyle).setStemStyle(notationStyle).setLedgerLineStyle(notationStyle);
  return vexNote;
}

function cropSvgToNotation(element: HTMLDivElement, stave: Stave, note: StaveNote) {
  const svg = element.querySelector('svg');
  if (!svg) {
    return;
  }
  const svgBounds = svg.getBBox();
  const clefModifier = stave.getModifiers(undefined, Clef.CATEGORY)[0];
  const verticalBounds: VerticalBounds[] = [
    {
      getH: () => stave.getBottomLineBottomY() - stave.getTopLineTopY(),
      getY: () => stave.getTopLineTopY(),
    },
    note.getBoundingBox(),
  ];

  if (clefModifier) {
    verticalBounds.push(clefModifier.getBoundingBox());
  }

  const top = Math.floor(Math.min(...verticalBounds.map((box) => box.getY())));
  const bottom = Math.ceil(Math.max(...verticalBounds.map((box) => box.getY() + box.getH())));
  const width = Math.ceil(svgBounds.x + svgBounds.width);
  const height = bottom - top;

  svg.setAttribute('viewBox', `0 ${top} ${width} ${height}`);
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
}

function clefForNote(note: string): StaffClef {
  const midi = getMidi(note);
  if (midi === null) {
    throw Error(`Invalid note '${note}'`);
  }
  return midi < middleCMidi ? 'bass' : 'treble';
}
