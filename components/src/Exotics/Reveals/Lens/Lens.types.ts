import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { PointSource } from "../../../Abstracts/PointerTracker/PointerTracker.types";

export type LensLayerStyle = {
    "visibility"?: "hidden";
    "mask-image"?: string;
    "-webkit-mask-image"?: string;
    "mask-position"?: string;
    "-webkit-mask-position"?: string;
    "mask-size"?: string;
    "-webkit-mask-size"?: string;
    "mask-repeat"?: string;
    "-webkit-mask-repeat"?: string;
};

export type LensCopyStyle = {
    "transform": string;
    "transform-origin": string;
};

export type BaseLensValues = {
    /**
     * How many times larger the content is drawn inside the lens. The copy is scaled about the lens's center, so
     * whatever is under the middle of the lens stays there and everything around it is pushed outwards. `1` draws
     * it at its own size, so nothing looks magnified.
     */
    zoom?: number;
    /** How large the lens that follows the pointer is. */
    radius?: number;
    /** How far the lens's corners are rounded. */
    joinRadii?: number[];
    /** How square or how pinched the lens's rounded corners are. */
    lameExponents?: number[];
    /** How gradually the lens's edge fades into the content around it. `0` gives a hard edge. */
    softness?: number;
    /**
     * How far one press of an arrow key moves the lens, in pixels.
     *
     * The lens is one Tab stop: reaching it from the keyboard opens the lens at the center, the arrow keys move it
     * from there, held inside the element, and it closes again when focus leaves. An arrow pressed while the
     * pointer is over the element picks the lens up from where the pointer left it, and moving the pointer over it
     * hands the lens back.
     */
    stepSize?: number;
    /** Stops the lens following the pointer or the keyboard, leaving the content as it is. */
    isDisabled?: boolean;
    /**
     * The point to follow instead of the pointer.
     *
     * A fraction across a box — the lens's own, or the element named in the source — so a point moving across a
     * banner can be handed to every card under it and each answers to the same spot. While the source has no point
     * the lens closes, as it does when the pointer leaves the window. Left out, the pointer is followed.
     */
    pointSource?: PointSource;
    /**
     * Names the lens for assistive technology. It is required because the lens is focusable, and a focusable
     * element with no name is announced as nothing at all.
     */
    ariaLabel: string;
};

export type BaseLensCbs = {
    /** The contour of the lens, worked out from its size. Left out, the lens is a circle. */
    computePoints?: (size: Size2d) => Point2d[];
};

export type BaseLensProps = BaseLensValues & BaseLensCbs;
