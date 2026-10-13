import type { LetterSegment } from "../../../Abstracts/LetterDriver/LetterDriver.types";
import type { PointSource } from "../../../Abstracts/PointerTracker/PointerTracker.types";

export type ProximityTextDistanceAxis = "both" | "horizontal" | "vertical";

export type ProximityTextLayoutState = {
    /** The measured text, split and wrapped for every letter at its last frame. */
    segments: LetterSegment[];
    /** How many letters there are, an image or a break the text holds counting as one. */
    count: number;
    /** The width the text was wrapped at, or `undefined` before it was first measured. */
    width: number | undefined;
};

export type ProximityTextLayoutOpts = {
    /** The element holding the text to measure: the hidden copy the consumer's children are rendered into. */
    getContainer: () => HTMLElement | undefined;
    /** Names each letter's keyframes, which the text is wrapped for. */
    getComputeAnimationName: () => (character: string, index: number, count: number) => string;
    /** Whether a drawer inside draws the letters, in which case nothing is measured here. */
    getIsDriven?: () => boolean;
};

export type ProximityTextLayout = {
    /** The layout's state. */
    get: () => ProximityTextLayoutState;
    /** Calls `listener` whenever the state changes, until the returned function is called. */
    subscribe: (listener: () => void) => () => void;
    /** Measures and wraps the text again, and reports whether anything was measured. */
    update: (isForced?: boolean) => boolean;
    /**
     * Measures again whenever the container changes size or content, or a web font or an image in the text finishes
     * loading, until the returned function is called.
     */
    observe: (container: HTMLElement) => () => void;
};

export type BaseProximityTextValues = {
    /**
     * How far from a letter's middle the point still reaches it, in pixels. A letter under the point is at its last
     * frame, and the hold falls with the square of the distance to the first frame at this reach.
     */
    reachPx?: number;
    /**
     * The point to follow instead of the pointer.
     *
     * A fraction across a box — the text's own, or the element named in the source — so a point moving across a
     * banner can sweep a wave of weight through every line under it. While the source has no point every letter
     * rests, as it does when the pointer leaves the window. Left out, the pointer is followed.
     */
    pointSource?: PointSource;
    /**
     * Which way nearness is measured. `"both"`, the default, measures straight to the point. `"vertical"` counts only
     * how far above or below the point a letter sits, so the point acts as a line across the text and every letter
     * on one line answers it alike — a band of text near the bottom of a scrolling box can swell as one line at a
     * time. `"horizontal"` counts only how far across, a line down the text.
     */
    distanceAxis?: ProximityTextDistanceAxis;
    /**
     * Rests every letter at its first frame and stops following the point. It is what a consumer honoring a
     * reduced-motion preference passes, since the library never reads that preference itself.
     */
    isDisabled?: boolean;
};

export type BaseProximityTextCbs = {
    /**
     * Names the keyframes one letter plays, from the letter itself, where it falls among all of them from `0`, and
     * how many there are. Each letter is held between the first frame, far from the point, and the last, under it, so
     * the keyframes can move any property — a variable font's weight or width, a color, a letter spacing. **The widest
     * frame has to be the first or the last**: the text is wrapped for every letter at whichever of the two is wider,
     * so a frame wider partway through can push a line past the box. An image or other whole element is passed as `"￼"` and a line break
     * the text holds as `"\n"`. Left out, the letters thicken.
     */
    computeAnimationName?: (character: string, index: number, count: number) => string;
};

export type BaseProximityTextProps = BaseProximityTextValues & BaseProximityTextCbs;
