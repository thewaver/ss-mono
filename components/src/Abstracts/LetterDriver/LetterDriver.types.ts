import type { ElementSegment, Rect, Store } from "@thewaver/ss-utils";

export type LetterAnimation = {
    /** The keyframes the letter plays. */
    name: string;
    /** How long the letter takes to play them. */
    durationMs: number;
    /**
     * How far into the run the letter begins. Where the run is now is not part of this: it is one CSS variable on
     * the driver's root, so moving the whole run is one write rather than one per letter.
     */
    delayMs: number;
    /** Whether the keyframes play forwards, as letters arrive, or backwards, as they leave. */
    direction: "normal" | "reverse";
};

export type LetterState = {
    /** Whether the letter takes its place without showing, as a letter waiting for its turn does. */
    isHidden: boolean;
    /** A glyph shown in the letter's place instead of the letter itself, centered over the space it takes. */
    glyph?: string;
    /** The keyframes the letter plays this run, if it plays any. */
    animation?: LetterAnimation;
};

export type LetterRegistryEntry = {
    /** The renderer's own root, which decides where it falls in reading order. */
    element: Element;
    /**
     * The renderer's letters, one per character, image or line break the text holds, in reading order. A break the
     * wrapping inserted is not one, so the letters are the same at any width.
     */
    characters: string[];
    /**
     * Where the renderer drew each letter at rest, in its root's own layout pixels and in the same order as
     * `characters`, for a wrapper that measures nearness to them. Empty until the renderer reports them.
     */
    boxes: Rect[];
};

export type LetterRegistryState = {
    /** Every registered renderer, in the order they appear on the page. */
    entries: LetterRegistryEntry[];
    /** Every renderer's letters run together in that order, which is the text the wrapper drives. */
    characters: string[];
};

export type LetterRegistration = {
    /** Replaces this renderer's letters, as it lays its text out again. */
    setCharacters: (characters: string[]) => void;
    /** Replaces where this renderer drew its letters at rest, as it lays its text out again. */
    setBoxes: (boxes: Rect[]) => void;
    /** Removes this renderer, as it unmounts. */
    unregister: () => void;
};

export type LetterRegistry = Store<LetterRegistryState> & {
    /** Adds a renderer, placed among the others by where its root sits on the page. */
    register: (element: Element) => LetterRegistration;
    /** Where a renderer's first letter falls among all of them, or `0` for one that is not registered. */
    getOffset: (element: Element) => number;
};

export type LetterSegment = ElementSegment & {
    /**
     * Where the segment's first character sits among every letter, an image or a break the text holds counting as
     * one. A break the wrapping inserted takes the index of whatever follows it and is not a letter.
     */
    startIndex: number;
};
