import type { Point2d, QuadCorner } from "@thewaver/ss-utils";

import type { QuadWarpAxis } from "../../../Abstracts/QuadWarp/QuadWarp.types";

export type CornerPinAxisLabels = Record<QuadWarpAxis, string>;

export type CornerPinGripRenderProps = {
    /** Which corner the grip holds. */
    corner: QuadCorner;
    /** Where that corner is, in shares of the box: `0` to `1` across each axis, and beyond past the box's edges. */
    point: Point2d;
    /**
     * Whether the grip has been tapped and is waiting for a tap saying where to go. Tapping it again puts it down
     * where it is.
     */
    isPicked: boolean;
    /** Whether the grip is being dragged. */
    isDragging: boolean;
    /**
     * Which of the grip's two axes holds keyboard focus that should be shown, for a painter drawing a ring. Left out
     * while neither does, or while focus came from a press.
     */
    focusVisibleAxis?: QuadWarpAxis;
};

export type BaseCornerPinValues = {
    /** Names the whole set of grips for assistive technology. */
    ariaLabel?: string;
    /**
     * What each grip's two axes are called. A keyboard and a screen reader reach every corner as two sliders, one
     * across and one down, so eight names in all — "top left, across" and so on, in the page's own language.
     */
    gripLabels: Record<QuadCorner, CornerPinAxisLabels>;
    /**
     * How far past each edge of the box a corner may be taken, in shares of the box, so the content can be
     * stretched beyond its own size as well as squeezed inside it. `0` keeps every corner on or inside the box.
     */
    reachRatio?: number;
    /** How far one arrow key moves a corner, in shares of the box. */
    step?: number;
    /**
     * What the set of grips is called when it is announced, so a reader hears corner pin rather than group.
     * Defaults to "corner pin".
     */
    roleDescription?: string;
};

export type BaseCornerPinProps = BaseCornerPinValues;
