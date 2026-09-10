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

/** How much sideways drift counts against a candidate when stepping in a direction. Higher keeps arrow keys travelling in a straighter line. */
const ACROSS_PENALTY = 2;
/** Quarter turns in a full turn. */
const TURN_COUNT = 4;
/** The middle of a cell. */
const HALF_CELL = 0.5;

/** A cell's coordinates as a string, so cells can go in a set. */
const toKey = (spot: SortableGridSpot) => `${spot.x},${spot.y}`;

/** Turns a set of cells a quarter turn clockwise about its own top-left corner. */
const getTurnedOnce = (cells: SortableGridSpot[], height: number) =>
    cells.map((cell) => ({ x: height - 1 - cell.y, y: cell.x }));

/**
 * The outward-facing edges of a set of cells, each pointing clockwise.
 *
 * A cell contributes an edge only where it has no neighbour, so the edges collected are exactly the
 * outline. Directing them consistently is what lets them be threaded into a loop afterwards.
 */
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

/**
 * Threads the edges into a single closed path of corner points.
 *
 * Starts from the topmost, leftmost corner so the same shape always produces the same path, which
 * matters for anything comparing or animating between outlines.
 */
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

/** Drops the corners that are not really corners, where the path carries straight on. */
const getWithoutCollinear = (loop: SortableGridSpot[]) =>
    loop.filter((point, index) => {
        const before = loop[(index - 1 + loop.length) % loop.length];
        const after = loop[(index + 1) % loop.length];

        return !((before.x === point.x && point.x === after.x) || (before.y === point.y && point.y === after.y));
    });

/**
 * Places, turns and moves items that occupy several cells of a grid.
 *
 * An item is described by which cells it fills rather than by a width and a height, so a Tetris
 * piece or an L-shape is as ordinary as a rectangle. Everything else follows from that: a shape's
 * size is worked out from its cells, turning it means turning the cells, and whether it fits means
 * asking about each cell.
 *
 * Footprints are normalised to start at the origin, so a caller may describe a shape anywhere in a
 * grid of its own and the description still means the same thing.
 */
export namespace SortableGridUtils {
    /**
     * The cells a footprint fills, moved to start at the origin.
     *
     * @param footprint Either a width and a height, for a rectangle, or the cells themselves for
     * anything else.
     * @returns The cells with the top-left of their bounding box at `0, 0`, so two descriptions of the
     * same shape come out identical.
     */
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

    /** The bounding box of a set of cells. A shape with holes still reports the box around it. */
    export const getSize = (cells: SortableGridSpot[]): SortableGridSize => ({
        width: Math.max(...cells.map((cell) => cell.x)) + 1,
        height: Math.max(...cells.map((cell) => cell.y)) + 1,
    });

    /**
     * Turns a set of cells by quarter turns.
     *
     * @param cells The cells to turn.
     * @param turns How many quarter turns clockwise. Wraps, so any whole number works, negative
     * included.
     * @returns The turned cells, again starting at the origin.
     */
    export const getTurnedCells = (cells: SortableGridSpot[], turns: number) => {
        let turned = cells;

        for (let turn = 0; turn < ((turns % TURN_COUNT) + TURN_COUNT) % TURN_COUNT; turn++) {
            turned = getTurnedOnce(turned, getSize(turned).height);
        }

        return turned;
    };

    /**
     * A footprint's cells and size after turning.
     *
     * @param footprint The shape as described.
     * @param turns How many quarter turns clockwise.
     */
    export const getShape = (footprint: SortableGridFootprint, turns: number): SortableGridShape => {
        const cells = getTurnedCells(getCells(footprint), turns);

        return { cells, size: getSize(cells) };
    };

    /** An item's shape, turns applied. */
    export const getItemShape = <T>(item: SortableGridItem<T>) => getShape(item.footprint, item.turns ?? 0);

    /** An item's position and bounding box, which is enough for anything that only needs to know roughly where it is. */
    export const getItemBox = <T>(item: SortableGridItem<T>): SortableGridBox => ({
        spot: item.spot,
        size: getItemShape(item).size,
    });

    /**
     * A shape's cells moved to a position in the grid.
     *
     * @param spot Where the shape's own origin goes.
     * @param shape The shape.
     */
    export const getPlacedCells = (spot: SortableGridSpot, shape: SortableGridShape) =>
        shape.cells.map((cell) => ({ x: spot.x + cell.x, y: spot.y + cell.y }));

    /** The grid cells an item occupies. */
    export const getItemCells = <T>(item: SortableGridItem<T>) => getPlacedCells(item.spot, getItemShape(item));

    /** Whether a carried destination is one of this grid's places — a spot plus a rotation — rather than something another kind of zone produced. */
    export const getIsPlace = (place: unknown): place is SortableGridPlace =>
        typeof place === "object" && place !== null && "turns" in place;

    /**
     * Whether a shape at a position fits within the grid's bounds.
     *
     * @param spot The position.
     * @param size The shape's bounding box.
     * @param columns The grid's width.
     * @param rows The grid's height.
     */
    export const getIsInside = (spot: SortableGridSpot, size: SortableGridSize, columns: number, rows: number) =>
        spot.x >= 0 && spot.y >= 0 && spot.x + size.width <= columns && spot.y + size.height <= rows;

    /**
     * Whether every one of a shape's cells is unoccupied.
     *
     * @param cells The cells the shape would fill.
     * @param taken The cells already occupied — which should exclude the item being moved, or it would
     * collide with itself.
     */
    export const getIsFree = (cells: SortableGridSpot[], taken: SortableGridSpot[]) => {
        const takenKeys = new Set(taken.map(toKey));

        return cells.every((cell) => !takenKeys.has(toKey(cell)));
    };

    /**
     * Pulls a position inside the grid.
     *
     * Clamped by the shape's far edge too, so an item dragged towards a corner stops with all of itself
     * on the grid.
     *
     * @param spot The position the drag asks for.
     * @param size The shape's bounding box.
     * @param columns The grid's width.
     * @param rows The grid's height.
     */
    export const getClampedSpot = (
        spot: SortableGridSpot,
        size: SortableGridSize,
        columns: number,
        rows: number,
    ): SortableGridSpot => ({
        x: MathUtils.clamp(spot.x, 0, Math.max(columns - size.width, 0)),
        y: MathUtils.clamp(spot.y, 0, Math.max(rows - size.height, 0)),
    });

    /**
     * The first place a shape fits, scanning left to right and top to bottom.
     *
     * For dropping an item in without the user choosing where — a new item, or one arriving from
     * another grid.
     *
     * @param shape The shape to place.
     * @param columns The grid's width.
     * @param rows The grid's height.
     * @param taken The cells already occupied.
     * @returns The position, or `undefined` when the shape does not fit anywhere.
     */
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

    /**
     * The items sorted top to bottom, then left to right.
     *
     * Position is what a sighted user navigates by, so the keyboard should follow it rather than the
     * order the items happen to be declared in.
     *
     * @param boxes The items' positions and sizes.
     * @returns The item indices in that order.
     */
    export const getReadingOrder = (boxes: SortableGridBox[]) =>
        boxes
            .map((box, index) => ({ box, index }))
            .sort((first, second) => first.box.spot.y - second.box.spot.y || first.box.spot.x - second.box.spot.x)
            .map((entry) => entry.index);

    /**
     * Which item an arrow key moves to.
     *
     * Only items ahead in the direction pressed are considered, and among those the nearest is chosen
     * with sideways drift counting against a candidate — so pressing right lands on the item beside this
     * one rather than one diagonally away that happens to be closer as the crow flies.
     *
     * @param boxes The items' positions and sizes.
     * @param fromIndex Where the cursor is now.
     * @param step The direction, as a unit step — `{ x: 1, y: 0 }` for right.
     * @returns The item's index, or `undefined` when there is nothing that way.
     */
    export const getNeighbourIndex = (boxes: SortableGridBox[], fromIndex: number, step: Point2d) => {
        const from = boxes[fromIndex];

        if (!from) return;

        const getBoxCentre = (box: SortableGridBox) => ({
            x: box.spot.x + box.size.width * 0.5,
            y: box.spot.y + box.size.height * 0.5,
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

    /** The average of a shape's cells, in cell coordinates. A shape with holes centres on its cells rather than on its bounding box. */
    export const getCentre = (cells: SortableGridSpot[]): Point2d => ({
        x: cells.reduce((total, cell) => total + cell.x + HALF_CELL, 0) / cells.length,
        y: cells.reduce((total, cell) => total + cell.y + HALF_CELL, 0) / cells.length,
    });

    /**
     * The largest solid rectangle inside a shape.
     *
     * A label, an icon or a handle needs somewhere rectangular to sit, and an L-shaped item has no
     * obvious middle. This finds the biggest full rectangle of cells, preferring the one nearest the
     * shape's centre where several are the same size.
     *
     * @param cells The shape's cells.
     * @returns The rectangle's position and size, in cell coordinates.
     */
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
                        const offset = Math.hypot(x + width * 0.5 - centre.x, y + height * 0.5 - centre.y);

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

    /**
     * Each cell as a pixel rectangle.
     *
     * @param cells The cells to place.
     * @param cellSize A cell's size in pixels.
     * @param gap The space between cells.
     */
    export const getCellRects = (cells: SortableGridSpot[], cellSize: number, gap: number) =>
        cells.map((cell) => ({
            spot: cell,
            left: cell.x * (cellSize + gap),
            top: cell.y * (cellSize + gap),
            width: cellSize,
            height: cellSize,
        }));

    /**
     * The shape's outline as a pixel path.
     *
     * Traces the edge of the painted cells rather than the grid lines, so the gaps between a shape's own
     * cells are enclosed rather than being cut into. Corners where the path carries straight on are
     * dropped, so a rectangle comes back as four points however many cells it covers.
     *
     * @param cells The shape's cells.
     * @param cellSize A cell's size in pixels.
     * @param gap The space between cells.
     * @returns The corners in clockwise order, starting from the topmost leftmost one — so the same
     * shape always gives the same path. Empty for a shape with no cells.
     */
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
