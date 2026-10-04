import type { ReactNode } from "react";

export type WraparoundProps = {
    /**
     * The name a screen reader gives the window. It is a region the keyboard can move, so it needs one, and it is
     * the only place the user is told what the moving content is.
     */
    ariaLabel: string;
    /** Holds the content still: no drag, wheel or key moves it, and the window leaves the tab order. */
    isDisabled?: boolean;
    /**
     * How long the content keeps coasting after a drag lets go: after this long it has lost about 63% of its speed.
     * `0` stops it where the pointer let go, which is the way to honor a request for reduced motion.
     */
    momentumMs?: number;
    /**
     * How long a key, `Home` or a focused item takes to slide the content into place. `0` jumps there, which is the
     * way to honor a request for reduced motion.
     */
    glideDurationMs?: number;
    /** How far one arrow key moves the content, in pixels. The page keys move most of the window's height. */
    keyStepPx?: number;
    /**
     * The most copies drawn at once. Content tiny next to its window would otherwise ask for thousands; past the
     * limit the far side of the window is left uncovered rather than the page brought to a halt.
     */
    maxCopies?: number;
    /**
     * Draws the arrangement to repeat — a `Mosaic`, a `Formation`, a plain grid. It is called once for the original
     * and once for every copy, so the content must have a size of its own: the window does not give it one, and its
     * size is the distance at which it repeats. A gap the arrangement leaves at its edges shows at every join.
     *
     * Only the original is real to a screen reader and to Tab; the copies are inert. Anything with a state of its
     * own — a playing video, a half-filled field, an open popup — runs separately in each copy, so a copy shows
     * whatever it was drawn with rather than what the original is doing. The original moves to whichever tile the
     * pointer is over, so hovering and clicking always reach it.
     */
    renderContent: () => ReactNode;
};
