import type { AccessorProps } from "../../Utils/typeUtils";

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

export type ScrambleTextProps = AccessorProps<{
    /** The text to settle on. */
    text: string;
    /** How long the whole run takes, from all scrambled to fully settled. */
    settleDurationMs?: number;
    /** How long one character churns before it settles. */
    churnDurationMs?: number;
    /** How often an unsettled character is swapped for another. Shorter intervals make a busier churn. */
    scrambleIntervalMs?: number;
    /** How long to wait before starting. */
    initialDelayMs?: number;
    /** Decides the order the characters settle in, as a weight per character. */
    computeCharacterWeights?: (count: number) => number[];
    /**
     * The characters a position churns through, given the character it is going to settle on, so a digit can
     * churn among digits and a capital among capitals. Leave it out for one mixed set everywhere.
     */
    computeGlyphs?: (character: string) => string;
    /**
     * Scrambles only what changed when the text changes. The old and new texts are compared character by
     * character, so a character carried over starts settled even when an insertion has moved it along; one
     * that was still churning when the text changed keeps churning. The first run and a restart scramble
     * everything.
     */
    changedOnly?: boolean;
    /** Hands the consumer a controller once the text is up, for replaying it from outside. */
    onMount?: (controller: ScrambleTextController) => void;
    /** Runs once the text has fully settled. */
    onAnimationEnd?: () => void;
}>;
