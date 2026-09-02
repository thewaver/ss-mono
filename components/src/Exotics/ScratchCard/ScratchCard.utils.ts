import type { Point2d } from "@thewaver/ss-utils";

import type { ScratchCardBrushDefs } from "./ScratchCard.types";

const NOTHING = 0;

export namespace ScratchCardUtils {
    export const getCellCount = (cellCount: Point2d) => Math.max(cellCount.x, NOTHING) * Math.max(cellCount.y, NOTHING);

    export const getCellPosition = (index: number, cellCount: Point2d): Point2d => ({
        x: index % cellCount.x,
        y: Math.floor(index / cellCount.x),
    });

    export const computeBrushedCells = (defs: ScratchCardBrushDefs) => {
        if (defs.cellCount.x < 1 || defs.cellCount.y < 1) return [];

        const cellSize = { width: defs.size.width / defs.cellCount.x, height: defs.size.height / defs.cellCount.y };
        const reach = {
            x: defs.radius / Math.max(cellSize.width, NOTHING),
            y: defs.radius / Math.max(cellSize.height, NOTHING),
        };
        const centre = {
            x: defs.point.x / Math.max(cellSize.width, NOTHING),
            y: defs.point.y / Math.max(cellSize.height, NOTHING),
        };

        const from = { x: Math.floor(centre.x - reach.x), y: Math.floor(centre.y - reach.y) };
        const to = { x: Math.ceil(centre.x + reach.x), y: Math.ceil(centre.y + reach.y) };

        const brushed: number[] = [];

        for (let y = Math.max(from.y, NOTHING); y <= Math.min(to.y, defs.cellCount.y - 1); y++) {
            for (let x = Math.max(from.x, NOTHING); x <= Math.min(to.x, defs.cellCount.x - 1); x++) {
                const gap = {
                    x: Math.max(x * cellSize.width - defs.point.x, NOTHING, defs.point.x - (x + 1) * cellSize.width),
                    y: Math.max(y * cellSize.height - defs.point.y, NOTHING, defs.point.y - (y + 1) * cellSize.height),
                };

                if (gap.x * gap.x + gap.y * gap.y > defs.radius * defs.radius) continue;

                brushed.push(y * defs.cellCount.x + x);
            }
        }

        return brushed;
    };

    export const computeClearedRatio = (scratchedCount: number, cellCount: Point2d) => {
        const total = getCellCount(cellCount);

        return total > NOTHING ? Math.min(scratchedCount / total, 1) : NOTHING;
    };
}
