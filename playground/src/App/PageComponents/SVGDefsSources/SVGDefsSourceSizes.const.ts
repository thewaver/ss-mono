import type { Size2d } from "@thewaver/ss-utils";

export const SOURCE_SIZE: Size2d = { width: 1200, height: 1200 };

export const SOURCE_CELL_SIZE: Size2d = { width: 150, height: 150 };

export const SOURCE_RATIO_SIZES = {
    "1:1": SOURCE_SIZE,
    "2:1": { width: SOURCE_SIZE.width, height: SOURCE_SIZE.height * 0.5 },
    "1:2": { width: SOURCE_SIZE.width * 0.5, height: SOURCE_SIZE.height },
} satisfies Record<string, Size2d>;

export type SVGDefsSourceRatio = keyof typeof SOURCE_RATIO_SIZES;
