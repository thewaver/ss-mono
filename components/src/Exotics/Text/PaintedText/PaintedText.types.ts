import type { Point2d, TextMetricsStyle } from "@thewaver/ss-utils";

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
    /** Where the run starts, from the left of the text block, or `0` on a path, where the path places it. */
    x: number;
    /** Where the run's baseline sits, from the top of the text block, or `0` on a path, where the path places it. */
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

export type PaintedTextPathPlacement = {
    /** Where the middle of the letter's baseline sits, in the path's own coordinates. */
    point: Point2d;
    /** Which way the letter's baseline runs there, in degrees, zero pointing right and increasing clockwise. */
    angle: number;
    /** How far the letter takes up along the path. */
    advance: number;
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
    /**
     * Where the letter sits on a path, and which way it is turned, or `undefined` off a path and for a letter that
     * falls past the end of the path. On a path, `x`, `top`, `width` and `height` are the upright box round the
     * turned letter, and `baseline` is the height of `point`.
     */
    placement?: PaintedTextPathPlacement;
};

export type PaintedTextCaretBox = {
    /** Where the caret's left edge sits, in the drawing's coordinates. */
    x: number;
    /** Where the caret's top sits, in the drawing's coordinates. */
    top: number;
    /** How tall the caret stands. */
    height: number;
    /** On a path, how far the caret is turned, in degrees, to stand upright on the letter beside it. */
    angle?: number;
    /** On a path, how far below the caret's top it meets the baseline, which is the point it is turned about. */
    pivotY?: number;
};

export type PaintedTextStrokePaint = {
    /** The stroke's width as drawn, which is twice the visible width when half of it is masked away. */
    drawnWidth: number;
    /** Which half of the drawn stroke survives, or `undefined` when all of it does. */
    maskKind: Exclude<PaintedTextStrokeAlignment, "center"> | undefined;
};

export type PaintedTextLayoutState = {
    /**
     * The width the text was wrapped at, or `undefined` before it was first measured. On a path, the width of the
     * box the text is drawn in.
     */
    width: number | undefined;
    /** How tall the wrapped text stands. On a path, the height of the box the text is drawn in. */
    height: number;
    /**
     * Where the box the text is drawn in starts, in the coordinates the text is drawn in: `0, 0` off a path, and on a
     * path the corner of the path's own box grown by how far the letters reach either side of it.
     */
    origin: Point2d;
    /** How long the path is, or `0` off a path. */
    pathLength: number;
    /** On a path, how far the tallest letter reaches above its baseline; `0` off a path. */
    ascent: number;
    /** On a path, how far the deepest letter reaches below its baseline; `0` off a path. */
    descent: number;
    /** Every run of text, one line at most each, in reading order. */
    runs: PaintedTextRun[];
    /**
     * The images and other whole elements, already built as SVG and placed where they sit in the text. Empty on a
     * path.
     */
    atomics: SVGElement[];
    /**
     * Every letter on its own, counted as `Typewriter` counts them — a character, a line break the text holds or a
     * whole element each, but not a break the wrapping inserted — and measured only while a wrapper is driving the
     * letters.
     */
    letters: PaintedTextLetter[];
    /**
     * The same letters where they sit at rest. While letters push each other along, `letters` is where they are
     * drawn and this is where they started, which is what nearness is measured from; otherwise the two are the same.
     */
    restLetters: PaintedTextLetter[];
};

export type PaintedTextLayoutOpts = {
    /** The element holding the consumer's text: the hidden copy it is measured from. */
    getSource: () => HTMLElement | undefined;
    /** An empty element in the flow, which the text is laid out in, invisibly, to find where every run lands. */
    getLayoutHost: () => HTMLElement | undefined;
    /** Whether a wrapper is driving the letters, and so needs each one measured on its own. */
    getIsMeasuringLetters?: () => boolean;
    /**
     * Names each letter's keyframes, for a wrapper whose letters take room as they animate. Given, the text is
     * wrapped with every letter at its last frame and each letter is laid out in a box of its own, so
     * {@link PaintedTextLayout.relayout} can move the letters along as they grow without moving a line break.
     */
    getComputePushingAnimationName?: () => ((character: string, index: number, count: number) => string) | undefined;
    /**
     * The path the text is set along, as SVG path data, or `undefined` for text laid out in lines. On a path the text
     * is one line that never wraps, line breaks and whole elements are left out, and letters do not push each other
     * along.
     */
    getPath?: () => string | undefined;
    /** Whether the spacing between letters is stretched or squeezed so the text runs the path's whole length once. */
    getIsFittedToPath?: () => boolean;
};

export type PaintedTextLayout = {
    /** The layout's state. */
    get: () => PaintedTextLayoutState;
    /** Calls `listener` whenever the state changes, until the returned function is called. */
    subscribe: (listener: () => void) => () => void;
    /** Measures the text and lays it out again. */
    update: () => boolean;
    /**
     * Lays the letters out again with each one styled as given, and measures where they land, without wrapping the
     * text again. Only letters laid out in boxes of their own move, which is while
     * {@link PaintedTextLayoutOpts.getComputePushingAnimationName} names keyframes.
     */
    relayout: (styles: readonly (Record<string, string> | undefined)[]) => void;
    /**
     * Places every letter along the path for the text starting `startOffset` along it, as the drawn text does, so a
     * wrapper's letters follow the text as it slides. A letter that slides past the end comes round from the start.
     * Does nothing off a path or while no wrapper is driving the letters.
     */
    placeAlongPath: (startOffset: number) => void;
    /**
     * Lays the text out again whenever its size or content changes or a web font or an image in it finishes
     * loading, until the returned function is called.
     */
    observe: (source: HTMLElement) => () => void;
};

export type PaintedTextCircleDirection = "clockwise" | "counterclockwise";
