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
