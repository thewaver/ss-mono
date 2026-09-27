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
