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
};

export type PaintedTextLayoutOpts = {
    /** The element holding the consumer's text: the hidden copy it is measured from. */
    getSource: () => HTMLElement | undefined;
    /** An empty element in the flow, which the text is laid out in, invisibly, to find where every run lands. */
    getLayoutHost: () => HTMLElement | undefined;
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
