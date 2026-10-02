import type { ReactNode } from "react";

import type { LetterRegistry, LetterState } from "@thewaver/ss-components";

export type LetterDriverContextType = {
    /** Where the drawers inside register themselves and report their letters. */
    registry: LetterRegistry;
    /** What one letter is doing right now, counted across every drawer in reading order. */
    getLetterState: (index: number) => LetterState;
    /** Whether a run is under way, which is when letters are drawn one by one rather than as whole lines. */
    isAnimating: boolean;
    /** Whether the text rests hidden once a run has ended, as erased text does. */
    isHidden: boolean;
    /** The letter the caret sits after, or `-1` for before the first, for a wrapper that draws one. */
    caretIndex?: number;
    /** Draws the wrapper's caret, which the drawer only places. */
    renderCaret?: () => ReactNode;
    /** Tells the wrapper a letter's own animation has just started. */
    reportLetterStart?: (index: number) => void;
};
