export type ScrambleTextSegment = {
    isWhitespace: boolean;
    startIndex: number;
    characters: string[];
};

export type ScrambleTextController = {
    /**
     * Scrambles the text and settles it again, whether or not it is already running.
     *
     * @returns `true`, since it always acts.
     */
    restartAnimation: () => boolean;
};

export type ScrambleTextState = {
    /** How long the run under way has been going. */
    elapsedMs: number;
    /** The glyph each position shows while it churns, or the character itself for whitespace. */
    noise: string[];
    /** Whether a run is under way. */
    isScrambling: boolean;
    /** Which positions were carried over settled from the text before, and so do not churn in this run. */
    kept: boolean[];
};

export type ScrambleTextScramblerOpts = {
    /** The text, split into characters. */
    getCharacters: () => string[];
    /** The glyphs each position churns through. */
    getGlyphSets: () => string[][];
    /** When each position settles, from the start of a run. */
    getSettleTimes: () => number[];
    /** When each position starts churning, from the start of a run. */
    getStartTimes: () => number[];
    /** How long to wait before starting. */
    getSettleDelayMs: () => number;
    /** How long the whole run takes. */
    getSettleDurationMs: () => number;
    /** How often an unsettled position is swapped for another glyph. */
    getScrambleIntervalMs: () => number;
    /** Runs once the text has fully settled. */
    onAnimationEnd?: () => void;
};

export type ScrambleTextScrambler = {
    /** The run's state. */
    get: () => ScrambleTextState;
    /** Calls `listener` whenever the state changes, until the returned function is called. */
    subscribe: (listener: () => void) => () => void;
    /** Starts a run from the beginning, throwing away any run under way, with the given positions kept settled. */
    start: (kept?: boolean[]) => boolean;
    /** Stops the run under way, leaving every position settled. */
    stop: () => void;
    /** Which positions of a new text are carried over settled from the old one, given how far the run had got. */
    getKeptAfterChange: (previous: string[], next: string[]) => boolean[];
};
