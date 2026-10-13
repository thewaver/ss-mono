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

export type BaseScrambleTextValues = {
    /**
     * The text to settle on. Leave it out when a drawer such as `PaintedText` sits inside, which supplies the text
     * and draws the scramble itself.
     */
    text?: string;
    /** How long the whole run takes, from all scrambled to fully settled. */
    settleDurationMs?: number;
    /** How long one character churns before it settles. */
    churnDurationMs?: number;
    /** How often an unsettled character is swapped for another. Shorter intervals make a busier churn. */
    scrambleIntervalMs?: number;
    /** How long to wait before the run starts; the run itself then takes `settleDurationMs`. */
    settleDelayMs?: number;
    /**
     * Scrambles only what changed when the text changes. The old and new texts are compared character by
     * character, so a character carried over starts settled even when an insertion has moved it along; one
     * that was still churning when the text changed keeps churning. The first run and a restart scramble
     * everything.
     */
    changedOnly?: boolean;
};

export type BaseScrambleTextCbs = {
    /** Decides the order the characters settle in, as a weight per character. */
    computeCharacterWeights?: (count: number) => number[];
    /**
     * The characters a position churns through, given the character it is going to settle on, so a digit can
     * churn among digits and a capital among capitals. Leave it out for one mixed set everywhere.
     */
    computeGlyphs?: (character: string) => string;
    /** Hands the consumer a controller once the text is up, for replaying it from outside. */
    onMount?: (controller: ScrambleTextController) => void;
    /** Runs once the text has fully settled. */
    onAnimationEnd?: () => void;
};

export type BaseScrambleTextProps = BaseScrambleTextValues & BaseScrambleTextCbs;
