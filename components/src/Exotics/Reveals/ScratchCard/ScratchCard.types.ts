import type { Accessor, JSX } from "solid-js";

import type { Point2d, Rect, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../../Utils/typeUtils";

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
    reset: () => void;
    clear: () => void;
};

export type ScratchCardProps = AccessorProps<{
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
    /** The outline of the patch a stroke clears, worked out from the card's size. */
    computePoints?: (size: Size2d) => Point2d[];
    /** Draws what is underneath, waiting to be revealed. */
    renderContent: () => JSX.Element;
    /** Draws the covering. It is handed the mask that the scratching cuts into it. */
    renderCover: (getMaskStyle: () => JSX.CSSProperties) => JSX.Element;
    /** Draws the brush that follows the pointer, and is told whether it is currently rubbing. */
    renderBrush?: (getIsRubbing: () => boolean, getGeometry: Accessor<ScratchCardBrushGeometry>) => JSX.Element;
    /** Hands the consumer a controller once the card is up, for clearing or resetting it from outside. */
    onMount?: (controller: ScratchCardController) => void;
    /** Runs as the card is scratched, and is told how much of it has been cleared. */
    onScratch?: (clearedRatio: number) => void;
    /** Runs once the card is fully cleared. */
    onClear?: () => void;
}>;
