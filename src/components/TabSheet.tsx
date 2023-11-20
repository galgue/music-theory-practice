import {
  component$,
  useSignal,
  useVisibleTask$,
  type Signal,
} from "@builder.io/qwik";

import { Formatter, Renderer, Stave, StaveNote, StemmableNote } from "vexflow";
import { isSmall } from "../utils/isSmall";

type Key = "c" | "d" | "e" | "f" | "g" | "a" | "b";
export type Note = {
  key: Key | "r" | Key[];
  duration: "q" | "h" | "w" | "8";
  octave_shift?: number;
  id?: string;
};

export const MusicSheet = component$<{
  notes: Signal<Note[]>;
  className?: string;
}>(({ notes, className }) => {
  const outputRef = useSignal<HTMLDivElement>();

  useVisibleTask$(({ track }) => {
    track(notes);
    if (!outputRef.value) {
      return;
    }
    outputRef.value.innerHTML = "";
    const renderer = new Renderer(
      outputRef.value as HTMLDivElement,
      Renderer.Backends.SVG
    );
    // Configure the rendering context.
    const context = renderer.getContext();
    const width = isSmall()
      ? outputRef.value.clientWidth / 2
      : outputRef.value.clientWidth;
    context.resize(width, 150);

    // Measure 1
    const staveMeasure = new Stave(10, 0, width - 20);
    staveMeasure
      .addClef("treble")
      .addTimeSignature("4/4")
      .setContext(context)
      .draw();

    const notesMeasure: StemmableNote[] = notes.value
      .slice(0, isSmall() ? 4 : 8)
      .map((note) =>
        new StaveNote({
          keys:
            note.key instanceof Array
              ? note.key.map((key) => `${key}/4`)
              : [`${note.key}/4`],
          duration: note.duration,
          octave_shift: note.octave_shift,
        }).setAttribute("id", note.id)
      );

    // Helper function to justify and draw a 4/4 voice
    Formatter.FormatAndDraw(context, staveMeasure, notesMeasure);
    const svg = outputRef.value.children[0] as SVGElement;
    svg.setAttribute("style", "width: 100%; height: 100%;");
  });

  return (
    <div
      id="output"
      ref={outputRef}
      class={`[&>svg]:w-full [&>svg]:h-full dark:[&_*]:fill-white dark:[&_*]:stroke-white ${className}`}
    />
  );
});
