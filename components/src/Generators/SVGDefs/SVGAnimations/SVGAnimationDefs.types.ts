export type SVGAnimationIterationPattern = {
    count: number;
    beginDelayMs?: number;
    nextIndex?: number;
};

export type SVGAnimationDefs = {
    /** How long one pass of the animation takes, in milliseconds. */
    animationDurationMs: number;
    /** The patterns played in turn: how many passes each, how long to wait before it, and which follows. */
    animationIterationPatterns?: SVGAnimationIterationPattern[];
    /** Called once the last pattern finishes and none follows. */
    onAnimationEnd?: () => void;
    /** Called as each pattern finishes, with the index of the pattern that just finished. */
    onAnimationIteration?: (finishedIndex: number) => void;
};
