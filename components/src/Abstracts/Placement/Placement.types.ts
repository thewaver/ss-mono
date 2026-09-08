import type { Point2d } from "@thewaver/ss-utils";

export type PlacementSector = {
    innerRadius: number;
    outerRadius: number;
    fromAngle: number;
    toAngle: number;
};

export type PlacementRect = {
    left: number;
    top: number;
    width: number;
    height: number;
    angle?: number;
    depth?: number;
    sector?: PlacementSector;
};

export type PlacementPickRule = "nearest" | "angle";

export type PlacementLayout = {
    placements: PlacementRect[];
    width: number;
    heightRatio: number;
    pickRule?: PlacementPickRule;
    origin?: Point2d;
};

export type PlacementLayoutDefs = {
    itemCount: number;
    path: number[];
    parentWidth: number;
    parentPlacement?: PlacementRect;
};

export type PlacementLayoutFn = (defs: PlacementLayoutDefs) => PlacementLayout;

export type PlacementPickDefs = {
    layout: PlacementLayout;
    point: Point2d;
    isPickable?: (index: number) => boolean;
};
