import type { Snippet } from "svelte";

export type WraparoundProps = {
    /**
     * The name a screen reader gives the window. It is a region the keyboard can move, so it needs one, and it is
     * the only place the user is told what the moving content is.
     */
    ariaLabel: string;
    /** Holds the content still: no drift, drag, wheel or key moves it, and the window leaves the tab order. */
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
     * Whether a person can move the content by hand: dragging it, the wheel, and the arrow, page and `Home` keys,
     * all three together. Defaults to `true`. Turned off, they are left to the page, so the wheel and a touch scroll
     * the page past the window rather than being caught by it, and the window leaves the tab order, since moving the
     * content was the only thing a key did there. Content inside is still reached by Tab, still brought into view when
     * it takes focus, and still clicked through any copy.
     */
    isMovable?: boolean;
    /**
     * How fast the content moves by itself, in pixels per second. `0`, the default, keeps it still until somebody
     * moves it, and is the way to honor a request for reduced motion. The drift pauses while the pointer is over the
     * window, while focus is inside it and while the page is hidden, and carries on from wherever a drag, the wheel
     * or a key left the content. Anything moving for more than five seconds owes its user a way to stop it, so give
     * a drifting window `playback` and a control that writes it.
     */
    driftPxPerSecond?: number;
    /**
     * Which way the content drifts, in degrees: `0` moves it to the right, `90` down, `180` (the default) to the left
     * and `270` up.
     */
    driftDegrees?: number;
    /**
     * Whether the content is drifting. Bind it with `bind:playback` to drive or follow it; left unbound, the window
     * keeps its own, starting on, so a window given a speed drifts at once. Writing `false` stops it where it is and
     * `true` carries on from there. The pointer and focus pause it only while they last; this is what stops it for
     * good.
     */
    playback?: boolean;
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
    renderContent: Snippet;
};
