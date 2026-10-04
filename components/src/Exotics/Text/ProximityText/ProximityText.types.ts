import type { LetterSegment } from "../../../Abstracts/LetterDriver/LetterDriver.types";

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
