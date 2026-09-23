import type { SwipeDirection } from "@thewaver/ss-utils";

import type {
    ToastsAlignment,
    ToastsDir,
    ToastsHorizontalAlignment,
    ToastsStackAlignment,
    ToastsVerticalAlignment,
} from "./Toasts.types";

/** Each named edge as its flex equivalent. Both axes are listed, since which one an alignment applies to depends on the stack's direction. */
const EDGE_BY_ALIGNMENT = {
    top: "flex-start",
    middle: "center",
    bottom: "flex-end",
    left: "flex-start",
    center: "center",
    right: "flex-end",
} as const;

/** The way a toast leaves by swiping, for each horizontal edge and then for each vertical one. */
const SWIPE_DIRECTION_BY_HORIZONTAL: Partial<Record<ToastsHorizontalAlignment, SwipeDirection>> = {
    left: "left",
    right: "right",
};

const SWIPE_DIRECTION_BY_VERTICAL: Partial<Record<ToastsVerticalAlignment, SwipeDirection>> = {
    top: "up",
    bottom: "down",
};

/** Each flex edge's mirror, for a reversed stack where the flex direction has already flipped what `flex-start` means. */
const OPPOSITE_EDGE = {
    "flex-start": "flex-end",
    "center": "center",
    "flex-end": "flex-start",
} as const;

/** Turns a toast stack's corner into the flex properties that put it there, and the way a toast is swiped off. */
export namespace ToastUtils {
    /**
     * The flex alignment for a corner and a stacking direction.
     *
     * Two things have to be resolved together. Which of the two named edges is the main axis depends on
     * whether the stack runs in a column or a row, and a reversed direction has already flipped what
     * `flex-start` means — so it is mirrored back, which is what lets new toasts enter from the top
     * while the stack still sits in the bottom corner.
     *
     * @param alignment The corner, as a vertical and a horizontal edge — `"bottom-right"` and the like.
     * @param dir Which way the stack grows.
     * @returns The `justifyContent` and `alignItems` to apply.
     */
    export const computeStackAlignment = (alignment: ToastsAlignment, dir: ToastsDir): ToastsStackAlignment => {
        const [vertical, horizontal] = alignment.split("-") as [ToastsVerticalAlignment, ToastsHorizontalAlignment];
        const isColumn = dir === "column" || dir === "column-reverse";
        const isReversed = dir === "column-reverse" || dir === "row-reverse";

        const main = EDGE_BY_ALIGNMENT[isColumn ? vertical : horizontal];
        const cross = EDGE_BY_ALIGNMENT[isColumn ? horizontal : vertical];

        return {
            justifyContent: isReversed ? OPPOSITE_EDGE[main] : main,
            alignItems: cross,
        };
    };

    /**
     * Which way a toast is swiped to dismiss it, for the corner or edge its stack sits at.
     *
     * The swipe carries the toast off the nearest edge of the screen. A stack against the left or right
     * edge is swiped sideways, corners included; a stack centered along the top or bottom is swiped up or down; a stack in the middle of the screen has
     * no edge to leave by.
     *
     * @param alignment The corner, as a vertical and a horizontal edge — `"bottom-right"` and the like.
     * @returns The direction, or `undefined` for `"middle-center"`.
     */
    export const computeSwipeDirection = (alignment: ToastsAlignment): SwipeDirection | undefined => {
        const [vertical, horizontal] = alignment.split("-") as [ToastsVerticalAlignment, ToastsHorizontalAlignment];

        return SWIPE_DIRECTION_BY_HORIZONTAL[horizontal] ?? SWIPE_DIRECTION_BY_VERTICAL[vertical];
    };
}
