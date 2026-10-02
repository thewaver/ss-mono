import type { VNodeChild } from "vue";

import type { ScrambleTextController } from "@thewaver/ss-components";

export type { ScrambleTextController };

export type ScrambleTextProps = {
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
};

export type ScrambleTextSlots = {
    /** A drawer such as `PaintedText`, which draws the scramble in place of the component's own text. */
    default?: () => VNodeChild;
};
