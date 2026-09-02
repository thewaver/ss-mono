import { MathUtils, type Point2d } from "@thewaver/ss-utils";

import type {
    SortableGridBox,
    SortableGridFootprint,
    SortableGridItem,
    SortableGridPlace,
    SortableGridShape,
    SortableGridSize,
    SortableGridSpot,
} from "./SortableGrid.types";

type SortableGridEdge = {
    from: SortableGridSpot;
    to: SortableGridSpot;
};

const ACROSS_PENALTY = 2;
const TURN_COUNT = 4;
const HALF_CELL = 0.5;

const toKey = (spot: SortableGridSpot) => `${spot.x},${spot.y}`;

const getTurnedOnce = (cells: SortableGridSpot[], height: number) =>
    cells.map((cell) => ({ x: height - 1 - cell.y, y: cell.x }));

const getEdges = (cells: SortableGridSpot[]) => {
    const filled = new Set(cells.map(toKey));
    const has = (x: number, y: number) => filled.has(toKey({ x, y }));
    const edges: SortableGridEdge[] = [];

    for (const { x, y } of cells) {
        if (!has(x, y - 1)) edges.push({ from: { x, y }, to: { x: x + 1, y } });
        if (!has(x + 1, y)) edges.push({ from: { x: x + 1, y }, to: { x: x + 1, y: y + 1 } });
        if (!has(x, y + 1)) edges.push({ from: { x: x + 1, y: y + 1 }, to: { x, y: y + 1 } });
        if (!has(x - 1, y)) edges.push({ from: { x, y: y + 1 }, to: { x, y } });
    }

    return edges;
};

const getLoop = (edges: SortableGridEdge[]) => {
    const byStart = new Map<string, SortableGridEdge[]>();

    for (const edge of edges) {
        const key = toKey(edge.from);

        byStart.set(key, [...(byStart.get(key) ?? []), edge]);
    }

    const start = edges.reduce(
        (best, edge) => (edge.from.y < best.y || (edge.from.y === best.y && edge.from.x < best.x) ? edge.from : best),
        edges[0].from,
    );

    const loop: SortableGridSpot[] = [];

    let current = start;

    for (let step = 0; step <= edges.length; step++) {
        loop.push(current);

        const next = byStart.get(toKey(current))?.shift();

        if (!next) break;

        current = next.to;

        if (toKey(current) === toKey(start)) break;
    }

    return loop;
};

const getWithoutCollinear = (loop: SortableGridSpot[]) =>
    loop.filter((point, index) => {
        const before = loop[(index - 1 + loop.length) % loop.length];
        const after = loop[(index + 1) % loop.length];

        return !((before.x === point.x && point.x === after.x) || (before.y === point.y && point.y === after.y));
    });

export namespace SortableGridUtils {
    export const getCells = (footprint: SortableGridFootprint): SortableGridSpot[] => {
        if (!Array.isArray(footprint)) {
            const cells: SortableGridSpot[] = [];

            for (let y = 0; y < footprint.height; y++) {
                for (let x = 0; x < footprint.width; x++) cells.push({ x, y });
            }

            return cells;
        }

        const left = Math.min(...footprint.map((cell) => cell.x));
        const top = Math.min(...footprint.map((cell) => cell.y));

        return footprint.map((cell) => ({ x: cell.x - left, y: cell.y - top }));
    };

    export const getSize = (cells: SortableGridSpot[]): SortableGridSize => ({
        width: Math.max(...cells.map((cell) => cell.x)) + 1,
        height: Math.max(...cells.map((cell) => cell.y)) + 1,
    });

    export const getTurnedCells = (cells: SortableGridSpot[], turns: number) => {
        let turned = cells;

        for (let turn = 0; turn < ((turns % TURN_COUNT) + TURN_COUNT) % TURN_COUNT; turn++) {
            turned = getTurnedOnce(turned, getSize(turned).height);
        }

        return turned;
    };

    export const getShape = (footprint: SortableGridFootprint, turns: number): SortableGridShape => {
        const cells = getTurnedCells(getCells(footprint), turns);

        return { cells, size: getSize(cells) };
    };

    export const getItemShape = <T>(item: SortableGridItem<T>) => getShape(item.footprint, item.turns ?? 0);

    export const getItemBox = <T>(item: SortableGridItem<T>): SortableGridBox => ({
        spot: item.spot,
        size: getItemShape(item).size,
    });

    export const getPlacedCells = (spot: SortableGridSpot, shape: SortableGridShape) =>
        shape.cells.map((cell) => ({ x: spot.x + cell.x, y: spot.y + cell.y }));

    export const getItemCells = <T>(item: SortableGridItem<T>) => getPlacedCells(item.spot, getItemShape(item));

    export const getIsPlace = (place: unknown): place is SortableGridPlace =>
        typeof place === "object" && place !== null && "turns" in place;

    export const getIsInside = (spot: SortableGridSpot, size: SortableGridSize, columns: number, rows: number) =>
        spot.x >= 0 && spot.y >= 0 && spot.x + size.width <= columns && spot.y + size.height <= rows;

    export const getIsFree = (cells: SortableGridSpot[], taken: SortableGridSpot[]) => {
        const takenKeys = new Set(taken.map(toKey));

        return cells.every((cell) => !takenKeys.has(toKey(cell)));
    };

    export const getClampedSpot = (
        spot: SortableGridSpot,
        size: SortableGridSize,
        columns: number,
        rows: number,
    ): SortableGridSpot => ({
        x: MathUtils.clamp(spot.x, 0, Math.max(columns - size.width, 0)),
        y: MathUtils.clamp(spot.y, 0, Math.max(rows - size.height, 0)),
    });

    export const getFreeSpot = (
        shape: SortableGridShape,
        columns: number,
        rows: number,
        taken: SortableGridSpot[],
    ): SortableGridSpot | undefined => {
        for (let y = 0; y + shape.size.height <= rows; y++) {
            for (let x = 0; x + shape.size.width <= columns; x++) {
                if (getIsFree(getPlacedCells({ x, y }, shape), taken)) return { x, y };
            }
        }
    };

    export const getReadingOrder = (boxes: SortableGridBox[]) =>
        boxes
            .map((box, index) => ({ box, index }))
            .sort((first, second) => first.box.spot.y - second.box.spot.y || first.box.spot.x - second.box.spot.x)
            .map((entry) => entry.index);

    export const getNeighbourIndex = (boxes: SortableGridBox[], fromIndex: number, step: Point2d) => {
        const from = boxes[fromIndex];

        if (!from) return;

        const getBoxCentre = (box: SortableGridBox) => ({
            x: box.spot.x + box.size.width / 2,
            y: box.spot.y + box.size.height / 2,
        });

        const origin = getBoxCentre(from);

        let best: number | undefined;
        let bestScore = Number.POSITIVE_INFINITY;

        boxes.forEach((box, index) => {
            if (index === fromIndex) return;

            const centre = getBoxCentre(box);
            const offset = { x: centre.x - origin.x, y: centre.y - origin.y };
            const along = offset.x * step.x + offset.y * step.y;

            if (along <= 0) return;

            const across = Math.abs(offset.x * step.y - offset.y * step.x);
            const score = along + across * ACROSS_PENALTY;

            if (score >= bestScore) return;

            bestScore = score;
            best = index;
        });

        return best;
    };

    export const getCentre = (cells: SortableGridSpot[]): Point2d => ({
        x: cells.reduce((total, cell) => total + cell.x + HALF_CELL, 0) / cells.length,
        y: cells.reduce((total, cell) => total + cell.y + HALF_CELL, 0) / cells.length,
    });

    export const getBlock = (cells: SortableGridSpot[]): SortableGridBox => {
        const filled = new Set(cells.map(toKey));
        const size = getSize(cells);
        const centre = getCentre(cells);

        const getIsSolid = (spot: SortableGridSpot, block: SortableGridSize) => {
            for (let y = spot.y; y < spot.y + block.height; y++) {
                for (let x = spot.x; x < spot.x + block.width; x++) {
                    if (!filled.has(toKey({ x, y }))) return false;
                }
            }

            return true;
        };

        let best: SortableGridBox = { spot: cells[0], size: { width: 1, height: 1 } };
        let bestArea = 0;
        let bestOffset = Number.POSITIVE_INFINITY;

        for (let y = 0; y < size.height; y++) {
            for (let x = 0; x < size.width; x++) {
                for (let height = 1; y + height <= size.height; height++) {
                    for (let width = 1; x + width <= size.width; width++) {
                        if (!getIsSolid({ x, y }, { width, height })) continue;

                        const area = width * height;
                        const offset = Math.hypot(x + width / 2 - centre.x, y + height / 2 - centre.y);

                        if (area < bestArea || (area === bestArea && offset >= bestOffset)) continue;

                        best = { spot: { x, y }, size: { width, height } };
                        bestArea = area;
                        bestOffset = offset;
                    }
                }
            }
        }

        return best;
    };

    export const getCellRects = (cells: SortableGridSpot[], cellSize: number, gap: number) =>
        cells.map((cell) => ({
            spot: cell,
            left: cell.x * (cellSize + gap),
            top: cell.y * (cellSize + gap),
            width: cellSize,
            height: cellSize,
        }));

    export const getOutline = (cells: SortableGridSpot[], cellSize: number, gap: number): Point2d[] => {
        if (cells.length < 1) return [];

        const loop = getWithoutCollinear(getLoop(getEdges(cells)));
        const pitch = cellSize + gap;

        return loop.map((point, index) => {
            const before = loop[(index - 1 + loop.length) % loop.length];
            const after = loop[(index + 1) % loop.length];
            const isAfterVertical = after.x === point.x;
            const down = isAfterVertical ? after.y > point.y : point.y > before.y;
            const right = isAfterVertical ? point.x > before.x : after.x > point.x;

            return {
                x: point.x * pitch - (down ? gap : 0),
                y: point.y * pitch - (right ? 0 : gap),
            };
        });
    };
}
