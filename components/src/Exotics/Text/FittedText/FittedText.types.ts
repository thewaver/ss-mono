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

export type BaseFittedTextValues = {
    /**
     * The lines, top to bottom, already split where the consumer wants them broken; nothing is wrapped. Each is
     * scaled to the full width of the box, then all of them shrink together until the stack fits the height, so a
     * short line comes out larger than a long one. The font is the one the component inherits.
     */
    lines: string[];
    /** Each line's height as a multiple of its own font size, which is the room the stack is fitted with. */
    lineHeightRatio?: number;
};

export type BaseFittedTextCbs = {
    /** Hands the consumer a controller once the text is up, for sizing it again after a change it cannot see. */
    onMount?: (controller: FittedTextController) => void;
};

export type BaseFittedTextProps = BaseFittedTextValues & BaseFittedTextCbs;
