import type { Count2d, Index2d } from "@thewaver/ss-utils";

const originRegistry: Record<CellAnimationOrigins.OriginType, (count: Count2d) => Index2d> = {
    center: (count) => ({ col: (count.colCount - 1) * 0.5, row: (count.rowCount - 1) * 0.5 }),
    top: (count) => ({ col: (count.colCount - 1) * 0.5, row: 0 }),
    top_right: (count) => ({ col: count.colCount - 1, row: 0 }),
    right: (count) => ({ col: count.colCount - 1, row: (count.rowCount - 1) * 0.5 }),
    bottom_right: (count) => ({ col: count.colCount - 1, row: count.rowCount - 1 }),
    bottom: (count) => ({ col: (count.colCount - 1) * 0.5, row: count.rowCount - 1 }),
    bottom_left: (count) => ({ col: 0, row: count.rowCount - 1 }),
    left: (count) => ({ col: 0, row: (count.rowCount - 1) * 0.5 }),
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

    export const computeOrigin = (type: OriginType, count: Count2d) => {
        if (!Object.hasOwn(originRegistry, type))
            throw new Error(`CellAnimationOrigins: there is no origin named "${type}".`);

        return originRegistry[type](count);
    };
}
