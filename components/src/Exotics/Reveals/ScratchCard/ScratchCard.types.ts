import type { Point2d, Rect, Size2d } from "@thewaver/ss-utils";

export type ScratchCardBrushShape = {
    radius: number;
    computePoints?: (size: Size2d) => Point2d[];
    joinRadii?: number[];
    lameExponents?: number[];
};

export type ScratchCardBrushGeometry = {
    point: Point2d;
    radius: number;
    box: Rect;
    clipPath: string;
};

export type ScratchCardController = {
    /**
     * Puts the cover back and throws away everything that was scratched.
     *
     * @returns `true`, since it always acts.
     */
    reset: () => boolean;
    /**
     * Wipes the cover away in one go, as though it had been scratched off.
     *
     * @returns `false` when a wipe is already under way.
     */
    clear: () => boolean;
};

export type BaseScratchCardValues = {
    /** How large a patch one stroke of the pointer clears. */
    brushRadius?: number;
    /** How far the brush's corners are rounded. */
    joinRadii?: number[];
    /** How square or how pinched the brush's rounded corners are. */
    lameExponents?: number[];
    /** How gradually a cleared patch fades into what is still covered. */
    softness?: number;
    /**
     * How finely the card measures how much has been scratched off. Finer measurement costs more work per frame, so it
     * is a knob rather than a fixed price.
     */
    precision?: number;
    /** How much of the card has to be scratched off before the rest is cleared for the reader. */
    clearThreshold?: number;
    /** How long that last clearing takes. */
    clearDurationMs?: number;
    /** Turns the card off, so nothing can be scratched. */
    isDisabled?: boolean;
    /** Names the card for assistive technology. */
    ariaLabel: string;
};

export type BaseScratchCardCbs = {
    /** The contour of the patch a stroke clears, worked out from the card's size. */
    computePoints?: (size: Size2d) => Point2d[];
    /** Hands the consumer a controller once the card is up, for clearing or resetting it from outside. */
    onMount?: (controller: ScratchCardController) => void;
    /** Runs as the card is scratched, and is told how much of it has been cleared. */
    onScratch?: (clearedRatio: number) => void;
    /** Runs once the card is fully cleared. */
    onClear?: () => void;
};

export type BaseScratchCardProps = BaseScratchCardValues & BaseScratchCardCbs;
