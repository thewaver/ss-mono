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
