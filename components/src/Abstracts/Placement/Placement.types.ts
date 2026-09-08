import type { Point2d } from "@thewaver/ss-utils";

export type PlacementRect = {
    left: number;
    top: number;
    width: number;
    height: number;
    angle?: number;
    depth?: number;
};

export type PlacementPickRule = "nearest" | "angle";

export type PlacementLayout = {
    placements: PlacementRect[];
    width: number;
    heightRatio: number;
    pickRule?: PlacementPickRule;
    origin?: Point2d;
};

export type PlacementLayoutFn = (itemCount: number) => PlacementLayout;

export type PlacementPickDefs = {
    layout: PlacementLayout;
    point: Point2d;
    isPickable?: (index: number) => boolean;
};
