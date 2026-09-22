import type { Index2d } from "@thewaver/ss-utils";

const originRegistry: Record<CellAnimationOrigins.OriginType, (count: Index2d) => Index2d> = {
    center: (count) => ({ col: (count.col - 1) * 0.5, row: (count.row - 1) * 0.5 }),
    top: (count) => ({ col: (count.col - 1) * 0.5, row: 0 }),
    topRight: (count) => ({ col: count.col - 1, row: 0 }),
    right: (count) => ({ col: count.col - 1, row: (count.row - 1) * 0.5 }),
    bottomRight: (count) => ({ col: count.col - 1, row: count.row - 1 }),
    bottom: (count) => ({ col: (count.col - 1) * 0.5, row: count.row - 1 }),
    bottomLeft: (count) => ({ col: 0, row: count.row - 1 }),
    left: (count) => ({ col: 0, row: (count.row - 1) * 0.5 }),
    topLeft: () => ({ col: 0, row: 0 }),
};

export namespace CellAnimationOrigins {
    export const ORIGIN_TYPES = [
        "center",
        "top",
        "topRight",
        "right",
        "bottomRight",
        "bottom",
        "bottomLeft",
        "left",
        "topLeft",
    ] as const;

    export type OriginType = (typeof ORIGIN_TYPES)[number];

    export const computeOrigin = (type: OriginType, count: Index2d) => originRegistry[type](count);
}
