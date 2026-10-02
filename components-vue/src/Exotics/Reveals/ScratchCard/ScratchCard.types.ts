import type { CSSProperties, VNodeChild } from "vue";

import type { ScratchCardBrushGeometry, ScratchCardController } from "@thewaver/ss-components";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type ScratchCardProps = {
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
    /** The contour of the patch a stroke clears, worked out from the card's size. */
    computePoints?: (size: Size2d) => Point2d[];
    /** Hands the consumer a controller once the card is up, for clearing or resetting it from outside. */
    onMount?: (controller: ScratchCardController) => void;
    /** Runs as the card is scratched, and is told how much of it has been cleared. */
    onScratch?: (clearedRatio: number) => void;
    /** Runs once the card is fully cleared. */
    onClear?: () => void;
};

export type ScratchCardSlots = {
    /** Draws what is underneath, waiting to be revealed. */
    renderContent: () => VNodeChild;
    /** Draws the covering. It is handed the mask that the scratching cuts into it. */
    renderCover: (maskStyle: CSSProperties) => VNodeChild;
    /** Draws the brush that follows the pointer, and is told whether it is currently rubbing. */
    renderBrush: (props: { isRubbing: boolean; geometry: ScratchCardBrushGeometry }) => VNodeChild;
};
