import type { Store } from "@thewaver/ss-utils";

export type FittedTextLayoutState = {
    /** One font size per line, in pixels, or an empty list before the box has been measured. */
    fontSizes: number[];
};

export type FittedTextLayoutOpts = {
    /** The lines, already split, top to bottom. */
    getLines: () => string[];
    /** Each line's height as a multiple of its own font size. */
    getLineHeightRatio: () => number;
};

export type FittedTextLayout = Store<FittedTextLayoutState> & {
    /** Measures the box and sizes the lines again, for a change the layout cannot see for itself. */
    update: () => boolean;
    /** Sizes the lines now, and again whenever the box changes size or a web font finishes loading. */
    observe: (root: HTMLElement) => () => void;
};

export type FittedTextController = {
    /**
     * Sizes the lines again, for a change the component cannot see for itself: a style on an element around it, such
     * as a class that changes the font, changes every width without changing the box.
     *
     * @returns `false` when there is nothing to measure yet, `true` otherwise.
     */
    update: () => boolean;
};
