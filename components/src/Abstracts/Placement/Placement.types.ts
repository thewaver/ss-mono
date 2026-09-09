import type { ParentProps } from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../Utils/typeUtils";

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
    width?: number;
    heightRatio: number;
    pickRule?: PlacementPickRule;
    origin?: Point2d;
};

export type PlacementLayoutDefs = {
    itemCount: number;
    path?: number[];
    parentWidth?: number;
    parentPlacement?: PlacementRect;
    itemParents?: (number | undefined)[];
};

export type PlacementLayoutFn = (defs: PlacementLayoutDefs) => PlacementLayout;

export type PlacementPickDefs = {
    layout: PlacementLayout;
    point: Point2d;
    isPickable?: (index: number) => boolean;
};

export type PlacementBoxProps = ParentProps<
    AccessorProps<{
        layout: PlacementLayout;
    }> & {
        ref?: (element: HTMLElement) => void;
    }
>;

export type PlacementItemProps = ParentProps<
    AccessorProps<{
        placement: PlacementRect;
        stackAt?: number;
    }>
>;
