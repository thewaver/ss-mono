import type { TextMetricsStyle } from "@thewaver/ss-utils";

export type PaintedTextStrokeAlignment = "outside" | "center" | "inside";

export type PaintedTextController = {
    /**
     * Lays the text out again, for a change the component cannot see for itself: a style on an element around it,
     * such as a class that makes the text bolder, changes where every glyph sits without changing any box size.
     *
     * @returns `false` when there is nothing to measure yet, `true` otherwise.
     */
    update: () => boolean;
};

export type PaintedTextRun = {
    /** The words, exactly as they are drawn on one line. */
    text: string;
    /** Where the run starts, from the left of the text block. */
    x: number;
    /** Where the run's baseline sits, from the top of the text block. */
    y: number;
    /** The font the run is drawn in, as dashed CSS properties. */
    style: TextMetricsStyle;
    /** The tooltip the run's element carried, or an empty string. */
    title: string;
    /** The link the run sat inside, if any. */
    anchor?: {
        href?: string;
        target?: string;
        rel?: string;
    };
};

export type PaintedTextLetter = {
    /** A character of a run, a line break, or a whole element such as an image. */
    kind: "text" | "break" | "atomic";
    /** The character, a line feed for a break, or the object replacement character for a whole element. */
    character: string;
    /** Where the letter's box starts, from the left of the text block. */
    x: number;
    /** Where the letter's box starts, from the top of the text block. */
    top: number;
    /** How wide the letter's box is; nothing for a break. */
    width: number;
    /** How tall the letter's box is, which is the line's for a character. */
    height: number;
    /** Where the letter's baseline sits, from the top of the text block. */
    baseline: number;
    /** The run a character belongs to, which carries its font. */
    runIndex?: number;
    /** The whole element a letter stands for, as its place among the layout's atomics. */
    atomicIndex?: number;
};

export type PaintedTextStrokePaint = {
    /** The stroke's width as drawn, which is twice the visible width when half of it is masked away. */
    drawnWidth: number;
    /** Which half of the drawn stroke survives, or `undefined` when all of it does. */
    maskKind: Exclude<PaintedTextStrokeAlignment, "center"> | undefined;
};

export type PaintedTextLayoutState = {
    /** The width the text was wrapped at, or `undefined` before it was first measured. */
    width: number | undefined;
    /** How tall the wrapped text stands. */
    height: number;
    /** Every run of text, one line at most each, in reading order. */
    runs: PaintedTextRun[];
    /** The images and other whole elements, already built as SVG and placed where they sit in the text. */
    atomics: SVGElement[];
    /**
     * Every letter on its own, counted as `Typewriter` counts them — a character, a line break or a whole element
     * each — and measured only while a wrapper is driving the letters.
     */
    letters: PaintedTextLetter[];
};

export type PaintedTextLayoutOpts = {
    /** The element holding the consumer's text: the hidden copy it is measured from. */
    getSource: () => HTMLElement | undefined;
    /** An empty element in the flow, which the text is laid out in, invisibly, to find where every run lands. */
    getLayoutHost: () => HTMLElement | undefined;
    /** Whether a wrapper is driving the letters, and so needs each one measured on its own. */
    getIsMeasuringLetters?: () => boolean;
};

export type PaintedTextLayout = {
    /** The layout's state. */
    get: () => PaintedTextLayoutState;
    /** Calls `listener` whenever the state changes, until the returned function is called. */
    subscribe: (listener: () => void) => () => void;
    /** Measures the text and lays it out again. */
    update: () => boolean;
    /**
     * Lays the text out again whenever its size or content changes or a web font or an image in it finishes
     * loading, until the returned function is called.
     */
    observe: (source: HTMLElement) => () => void;
};
