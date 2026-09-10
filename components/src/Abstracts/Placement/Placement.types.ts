import type { Point2d } from "@thewaver/ss-utils";

export type PlacementSector = {
    innerRadius: number;
    outerRadius: number;
    fromAngle: number;
    toAngle: number;
    origin?: Point2d;
};

export type PlacementRect = {
    left: number;
    top: number;
    width: number;
    height: number;
    angle?: number;
    depth?: number;
    clipPath?: string;
    sector?: PlacementSector;
};

export type PlacementPickRule = "nearest" | "angle";

export type PlacementLayout = {
    placements: PlacementRect[];
    extent?: number;
    heightRatio: number;
    pickRule?: PlacementPickRule;
    origin?: Point2d;
    radii?: Point2d;
};

export type PlacementLayoutDefs = {
    itemCount: number;
    path?: number[];
    parentExtent?: number;
    parentPlacement?: PlacementRect;
    itemParents?: (number | undefined)[];
};

export type PlacementLayoutFn = (defs: PlacementLayoutDefs) => PlacementLayout;

export type PlacementPickDefs = {
    layout: PlacementLayout;
    point: Point2d;
    isPickable?: (index: number) => boolean;
};
