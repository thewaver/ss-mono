import type { Index2d } from "@thewaver/ss-utils";

const originRegistry: Record<CellAnimationOrigins.OriginType, (count: Index2d) => Index2d> = {
    center: (count) => ({ col: (count.col - 1) * 0.5, row: (count.row - 1) * 0.5 }),
    top: (count) => ({ col: (count.col - 1) * 0.5, row: 0 }),
    top_right: (count) => ({ col: count.col - 1, row: 0 }),
    right: (count) => ({ col: count.col - 1, row: (count.row - 1) * 0.5 }),
    bottom_right: (count) => ({ col: count.col - 1, row: count.row - 1 }),
    bottom: (count) => ({ col: (count.col - 1) * 0.5, row: count.row - 1 }),
    bottom_left: (count) => ({ col: 0, row: count.row - 1 }),
    left: (count) => ({ col: 0, row: (count.row - 1) * 0.5 }),
    top_left: () => ({ col: 0, row: 0 }),
};

export namespace CellAnimationOrigins {
    export const ORIGIN_TYPES = [
        "center",
        "top",
        "top_right",
        "right",
        "bottom_right",
        "bottom",
        "bottom_left",
        "left",
        "top_left",
    ] as const;

    export type OriginType = (typeof ORIGIN_TYPES)[number];

    export const computeOrigin = (type: OriginType, count: Index2d) => originRegistry[type](count);
}
