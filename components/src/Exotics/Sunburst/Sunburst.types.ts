import type { Accessor, JSX } from "solid-js";

import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type SunburstNode<T> = {
    value: T;
    weight?: number;
    children?: SunburstNode<T>[];
};

export type SunburstSpan = {
    start: number;
    end: number;
    inner: number;
    outer: number;
};

export type SunburstArc = {
    /** Where the arc begins, in radians clockwise from twelve o'clock. */
    startAngle: number;
    /** Where the arc ends, in radians clockwise from twelve o'clock. */
    endAngle: number;
    /** How far the arc's inner edge is from the center, in pixels. */
    innerRadius: number;
    /** How far the arc's outer edge is from the center, in pixels. */
    outerRadius: number;
};

export type SunburstArcState = SunburstArc & {
    /** The arc's own weight for a leaf, or everything under it for a branch. */
    weight: number;
    /** Whether the arc has children, and so can be zoomed into. */
    isBranch: boolean;
    /** Which ring the arc belongs to once the current zoom settles, counting out from the center from one. */
    ring: number;
};

export type SunburstArcPathOpts = {
    /** The width of the gap left between neighboring arcs in one ring, in pixels. */
    padLength?: number;
    /** The width of the gap left between one ring and the next, in pixels. */
    ringGap?: number;
};

export type SunburstProps<T> = AccessorProps<{
    /** Names the sunburst for assistive technology. */
    ariaLabel: string;
    /** How many rings are drawn around the center. The center takes the room of one ring more. */
    ringCount?: number;
    /** How long a zoom takes. `0` jumps straight to the new level, which is the route for reduced motion. */
    zoomDurationMs?: number;
}> & {
    /**
     * The whole tree. A leaf's share of its ring comes from its `weight` and a branch's from the total of its children,
     * so a weight set on a branch is ignored. A child weighing nothing gets no arc.
     */
    root: MaybeAccessor<SunburstNode<T>>;
    /**
     * The branch at the center, whose children make the first ring. Both sides write it: the sunburst when an arc is
     * activated or Escape is pressed, the consumer to move it from outside — which is how a way back out is drawn, in
     * the middle or anywhere else. Leave it out and the sunburst keeps it itself, starting at the root. A node that is
     * not a branch of the current tree puts the root at the center.
     */
    branchSignal?: SignalSource<SunburstNode<T>>;
    /**
     * Draws one arc inside the sunburst's own drawing, whose origin is the center. It is handed where the arc sits at
     * this moment, which changes on every frame of a zoom; `SunburstUtils.computeArcPath` turns that into a path.
     */
    renderArc: (getNode: Accessor<SunburstNode<T>>, getState: Accessor<SunburstArcState>) => JSX.Element;
};
