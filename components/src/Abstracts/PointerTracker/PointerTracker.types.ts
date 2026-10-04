import type { Point2d } from "@thewaver/ss-utils";

export type PointerReading = {
    offset: Point2d;
    angle: number;
    distance: number;
    edgeOffset: Point2d;
    edgeDistance: number;
    edgeRatio: number;
    boxRatio: Point2d;
};

export type PointSource = {
    /**
     * Where the point is, as a fraction across the box: `{ x: 0, y: 0 }` is the top-left corner and
     * `{ x: 1, y: 1 }` the bottom-right. Values outside `0` to `1` place it outside the box. Left `undefined`, there
     * is no point, which reads as the pointer having left the window: whatever follows it rests.
     */
    ratio: Point2d | undefined;
    /**
     * The box the fraction is of. Left out, each follower measures against its own box, so one source handed to
     * several components puts the point at the same place inside each of them; given, it is the same point on the
     * page for all of them, so a light moving across a banner reaches every card under it.
     */
    element?: HTMLElement;
};
