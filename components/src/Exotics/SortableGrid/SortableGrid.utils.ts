import { type Index2d, MathUtils, type Point2d } from "@thewaver/ss-utils";

import type { CarrierZone, Carry, CarryPlace } from "../../Abstracts/Carrier/Carrier.types";
import { CarrierUtils } from "../../Abstracts/Carrier/Carrier.utils";
import { NavigatorUtils } from "../../Abstracts/Navigator/Navigator.utils";
import type { ViewportContextType } from "../../Abstracts/Viewport/Viewport.context.types";
import { ViewportUtils } from "../../Abstracts/Viewport/Viewport.utils";
import type { SortableKeyAction } from "../../Essentials/Sortable/Sortable.types";
import type {
    SortableGridBox,
    SortableGridFootprint,
    SortableGridGeometry,
    SortableGridItemRecord,
    SortableGridPickUp,
    SortableGridPlace,
    SortableGridShape,
    SortableGridSize,
    SortableGridSpot,
    SortableGridZoneDefs,
} from "./SortableGrid.types";

type SortableGridEdge = {
    from: SortableGridSpot;
    to: SortableGridSpot;
};

/** How much sideways drift counts against a candidate when stepping in a direction. Higher keeps arrow keys traveling in a straighter line. */
const ACROSS_PENALTY = 2;
/** Quarter turns in a full turn. */
const TURN_COUNT = 4;
/** The middle of a cell. */
const HALF_CELL = 0.5;

/** A cell's coordinates as a string, so cells can go in a set. */
const toKey = (spot: SortableGridSpot) => `${spot.col},${spot.row}`;

/** Turns a set of cells a quarter turn clockwise about its own top-left corner. */
const getTurnedOnce = (cells: SortableGridSpot[], rowCount: number) =>
    cells.map((cell) => ({ col: rowCount - 1 - cell.row, row: cell.col }));

/**
 * The outward-facing edges of a set of cells, each pointing clockwise.
 *
 * A cell contributes an edge only where it has no neighbor, so the edges collected are exactly the
 * outline. Directing them consistently is what lets them be threaded into a loop afterwards.
 */
const getEdges = (cells: SortableGridSpot[]) => {
    const filled = new Set(cells.map(toKey));
    const has = (col: number, row: number) => filled.has(toKey({ col, row }));
    const edges: SortableGridEdge[] = [];

    for (const { col, row } of cells) {
        if (!has(col, row - 1)) edges.push({ from: { col, row }, to: { col: col + 1, row } });
        if (!has(col + 1, row)) edges.push({ from: { col: col + 1, row }, to: { col: col + 1, row: row + 1 } });
        if (!has(col, row + 1)) edges.push({ from: { col: col + 1, row: row + 1 }, to: { col, row: row + 1 } });
        if (!has(col - 1, row)) edges.push({ from: { col, row: row + 1 }, to: { col, row } });
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
        (best, edge) =>
            edge.from.row < best.row || (edge.from.row === best.row && edge.from.col < best.col) ? edge.from : best,
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

        return !(
            (before.col === point.col && point.col === after.col) ||
            (before.row === point.row && point.row === after.row)
        );
    });

/** The footprint an item arriving from a list is given, since it has never had a size. */
const SINGLE_CELL: SortableGridFootprint = { colCount: 1, rowCount: 1 };
/** The top left cell, where an item with nowhere better to go is put. */
const FIRST_SPOT: SortableGridSpot = { col: 0, row: 0 };
/** What cancels a carry. */
const CANCEL_KEY = "Escape";
/** What carries an item to the next grid that will take it. */
const NEXT_ZONE_KEY = "Tab";
/** What each arrow key nudges a carry by. */
const NUDGE_KEYS: Record<string, { x?: number; y?: number } | undefined> = {
    ArrowRight: { x: 1 },
    ArrowLeft: { x: -1 },
    ArrowDown: { y: 1 },
    ArrowUp: { y: -1 },
};
/** Which way each arrow key walks the focus. */
const STEP_KEYS: Record<string, Index2d | undefined> = {
    ArrowRight: { row: 0, col: 1 },
    ArrowLeft: { row: 0, col: -1 },
    ArrowDown: { row: 1, col: 0 },
    ArrowUp: { row: -1, col: 0 },
};

/**
 * Where on the carried item the pointer took hold, and the zone that carry began in.
 *
 * One carry exists at a time, so one record is enough, and it is shared by every grid on the page whatever it is
 * drawn with: the grid that needs it is the one being aimed at, which may not be the one the item came from. The zone
 * is what stops a stale record being read after a list started the carry.
 */
let grabbed: { zone: CarrierZone; spot: SortableGridSpot } | undefined;

/**
 * Places, turns and moves items that occupy several cells of a grid.
 *
 * An item is described by which cells it fills rather than by a colCount and a rowCount, so a Tetris
 * piece or an L-shape is as ordinary as a rectangle. Everything else follows from that: a shape's
 * size is worked out from its cells, turning it means turning the cells, and whether it fits means
 * asking about each cell.
 *
 * Footprints are normalized to start at the origin, so a caller may describe a shape anywhere in a
 * grid of its own and the description still means the same thing.
 */
export namespace SortableGridUtils {
    /**
     * The cells a footprint fills, moved to start at the origin.
     *
     * @param footprint Either a colCount and a rowCount, for a rectangle, or the cells themselves for
     * anything else.
     * @returns The cells with the top-left of their bounding box at `0, 0`, so two descriptions of the
     * same shape come out identical.
     */
    export const getCells = (footprint: SortableGridFootprint): SortableGridSpot[] => {
        if (!Array.isArray(footprint)) {
            const cells: SortableGridSpot[] = [];

            for (let row = 0; row < footprint.rowCount; row++) {
                for (let col = 0; col < footprint.colCount; col++) cells.push({ col, row });
            }

            return cells;
        }

        const left = Math.min(...footprint.map((cell) => cell.col));
        const top = Math.min(...footprint.map((cell) => cell.row));

        return footprint.map((cell) => ({ col: cell.col - left, row: cell.row - top }));
    };

    /** The bounding box of a set of cells. A shape with holes still reports the box around it. */
    export const getSize = (cells: SortableGridSpot[]): SortableGridSize => ({
        colCount: Math.max(...cells.map((cell) => cell.col)) + 1,
        rowCount: Math.max(...cells.map((cell) => cell.row)) + 1,
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
            turned = getTurnedOnce(turned, getSize(turned).rowCount);
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
    export const getItemShape = <T, TTooltipDefs>(item: SortableGridItemRecord<T, TTooltipDefs>) =>
        getShape(item.footprint, item.turns ?? 0);

    /** An item's position and bounding box, which is enough for anything that only needs to know roughly where it is. */
    export const getItemBox = <T, TTooltipDefs>(item: SortableGridItemRecord<T, TTooltipDefs>): SortableGridBox => ({
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
        shape.cells.map((cell) => ({ col: spot.col + cell.col, row: spot.row + cell.row }));

    /** The grid cells an item occupies. */
    export const getItemCells = <T, TTooltipDefs>(item: SortableGridItemRecord<T, TTooltipDefs>) =>
        getPlacedCells(item.spot, getItemShape(item));

    /** Whether a carried destination is one of this grid's places — a spot plus a rotation — rather than something another kind of zone produced. */
    export const getIsPlace = (place: unknown): place is SortableGridPlace =>
        typeof place === "object" && place !== null && "turns" in place;

    /**
     * Whether a shape at a position fits within the grid's bounds.
     *
     * @param spot The position.
     * @param size The shape's bounding box.
     * @param columns The grid's colCount.
     * @param rows The grid's rowCount.
     */
    export const getIsInside = (spot: SortableGridSpot, size: SortableGridSize, columns: number, rows: number) =>
        spot.col >= 0 && spot.row >= 0 && spot.col + size.colCount <= columns && spot.row + size.rowCount <= rows;

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
     * @param columns The grid's colCount.
     * @param rows The grid's rowCount.
     */
    export const getClampedSpot = (
        spot: SortableGridSpot,
        size: SortableGridSize,
        columns: number,
        rows: number,
    ): SortableGridSpot => ({
        col: MathUtils.clamp(spot.col, 0, Math.max(columns - size.colCount, 0)),
        row: MathUtils.clamp(spot.row, 0, Math.max(rows - size.rowCount, 0)),
    });

    /**
     * The first place a shape fits, scanning left to right and top to bottom.
     *
     * For dropping an item in without the user choosing where — a new item, or one arriving from
     * another grid.
     *
     * @param shape The shape to place.
     * @param columns The grid's colCount.
     * @param rows The grid's rowCount.
     * @param taken The cells already occupied.
     * @returns The position, or `undefined` when the shape does not fit anywhere.
     */
    export const getFreeSpot = (
        shape: SortableGridShape,
        columns: number,
        rows: number,
        taken: SortableGridSpot[],
    ): SortableGridSpot | undefined => {
        for (let row = 0; row + shape.size.rowCount <= rows; row++) {
            for (let col = 0; col + shape.size.colCount <= columns; col++) {
                if (getIsFree(getPlacedCells({ col, row }, shape), taken)) return { col, row };
            }
        }
    };

    /**
     * Where an arrow key moves a carried shape, stepping over any spot that would put it on a blocked cell.
     *
     * The shape moves one cell in the direction given, clamped to the grid as
     * {@link SortableGridUtils.getClampedSpot} does. If that leaves any of its cells on a blocked one, it keeps
     * going the same way until it reaches a spot clear of every blocked cell. Other items are not blocked cells
     * and are not stepped over: a place they fill can still be aimed at and refused.
     *
     * @param spot Where the shape is now.
     * @param step The direction, as a unit step — `{ col: 1, row: 0 }` for right.
     * @param shape The shape being moved, turns applied.
     * @param columns The grid's colCount.
     * @param rows The grid's rowCount.
     * @param blocked The cells nothing may land on.
     * @returns The first clear spot that way, or the plain one-cell step when there is none before the edge, so a
     * shape that fits nowhere clear can still be moved.
     */
    export const getSteppedSpot = (
        spot: SortableGridSpot,
        step: Index2d,
        shape: SortableGridShape,
        columns: number,
        rows: number,
        blocked: SortableGridSpot[],
    ): SortableGridSpot => {
        const advance = (from: SortableGridSpot) =>
            getClampedSpot({ col: from.col + step.col, row: from.row + step.row }, shape.size, columns, rows);
        const first = advance(spot);

        let previous = spot;
        let current = first;

        while (current.col !== previous.col || current.row !== previous.row) {
            if (getIsFree(getPlacedCells(current, shape), blocked)) return current;

            previous = current;
            current = advance(current);
        }

        return first;
    };

    /**
     * The items with every one pulled upward as far as it will slide.
     *
     * Each item moves straight up in its own column, one row at a time, until the next row up would put one of
     * its cells on another item, on a blocked cell or off the top of the grid. Items are taken top first, and the
     * pass is repeated until nothing moves, so an item freed by one below it sliding away still gets pulled up.
     * Nothing is turned and nothing moves sideways, so an item never jumps past something in its way.
     *
     * @param items The items where they are now.
     * @param blocked The cells nothing may land on.
     * @returns The items in the same order. An item that did not move is the same object it was, so a caller
     * can tell whether anything changed by comparing each entry.
     */
    export const getCompacted = <T, TTooltipDefs>(
        items: SortableGridItemRecord<T, TTooltipDefs>[],
        blocked: SortableGridSpot[],
    ): SortableGridItemRecord<T, TTooltipDefs>[] => {
        const placed = [...items];

        let hasMoved = true;

        while (hasMoved) {
            hasMoved = false;

            for (const index of getReadingOrder(placed.map(getItemBox))) {
                const item = placed[index];
                const shape = getItemShape(item);
                const taken = [...blocked, ...placed.filter((_unused, other) => other !== index).flatMap(getItemCells)];

                let row = item.spot.row;

                while (row > 0 && getIsFree(getPlacedCells({ col: item.spot.col, row: row - 1 }, shape), taken)) {
                    row -= 1;
                }

                if (row === item.spot.row) continue;

                placed[index] = { ...item, spot: { col: item.spot.col, row } };
                hasMoved = true;
            }
        }

        return placed;
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
            .sort(
                (first, second) => first.box.spot.row - second.box.spot.row || first.box.spot.col - second.box.spot.col,
            )
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
     * @param step The direction, as a unit step — `{ col: 1, row: 0 }` for right.
     * @returns The item's index, or `undefined` when there is nothing that way.
     */
    export const getNeighborIndex = (boxes: SortableGridBox[], fromIndex: number, step: Index2d) => {
        const from = boxes[fromIndex];

        if (!from) return;

        const getBoxCenter = (box: SortableGridBox) => ({
            col: box.spot.col + box.size.colCount * 0.5,
            row: box.spot.row + box.size.rowCount * 0.5,
        });

        const origin = getBoxCenter(from);

        let best: number | undefined;
        let bestScore = Number.POSITIVE_INFINITY;

        boxes.forEach((box, index) => {
            if (index === fromIndex) return;

            const center = getBoxCenter(box);
            const offset = { col: center.col - origin.col, row: center.row - origin.row };
            const along = offset.col * step.col + offset.row * step.row;

            if (along <= 0) return;

            const across = Math.abs(offset.col * step.row - offset.row * step.col);
            const score = along + across * ACROSS_PENALTY;

            if (score >= bestScore) return;

            bestScore = score;
            best = index;
        });

        return best;
    };

    /** The average of a shape's cells, in cell coordinates. A shape with holes centers on its cells rather than on its bounding box. */
    export const getCenter = (cells: SortableGridSpot[]): Index2d => ({
        col: cells.reduce((total, cell) => total + cell.col + HALF_CELL, 0) / cells.length,
        row: cells.reduce((total, cell) => total + cell.row + HALF_CELL, 0) / cells.length,
    });

    /**
     * The largest solid rectangle inside a shape.
     *
     * A label, an icon or a handle needs somewhere rectangular to sit, and an L-shaped item has no
     * obvious middle. This finds the biggest full rectangle of cells, preferring the one nearest the
     * shape's center where several are the same size.
     *
     * @param cells The shape's cells.
     * @returns The rectangle's position and size, in cell coordinates.
     */
    export const getBlock = (cells: SortableGridSpot[]): SortableGridBox => {
        const filled = new Set(cells.map(toKey));
        const size = getSize(cells);
        const center = getCenter(cells);

        const getIsSolid = (spot: SortableGridSpot, block: SortableGridSize) => {
            for (let row = spot.row; row < spot.row + block.rowCount; row++) {
                for (let col = spot.col; col < spot.col + block.colCount; col++) {
                    if (!filled.has(toKey({ col, row }))) return false;
                }
            }

            return true;
        };

        let best: SortableGridBox = { spot: cells[0], size: { colCount: 1, rowCount: 1 } };
        let bestArea = 0;
        let bestOffset = Number.POSITIVE_INFINITY;

        for (let row = 0; row < size.rowCount; row++) {
            for (let col = 0; col < size.colCount; col++) {
                for (let rowCount = 1; row + rowCount <= size.rowCount; rowCount++) {
                    for (let colCount = 1; col + colCount <= size.colCount; colCount++) {
                        if (!getIsSolid({ col, row }, { colCount, rowCount })) continue;

                        const area = colCount * rowCount;
                        const offset = Math.hypot(col + colCount * 0.5 - center.col, row + rowCount * 0.5 - center.row);

                        if (area < bestArea || (area === bestArea && offset >= bestOffset)) continue;

                        best = { spot: { col, row }, size: { colCount, rowCount } };
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
            left: cell.col * (cellSize + gap),
            top: cell.row * (cellSize + gap),
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
            const isAfterVertical = after.col === point.col;
            const down = isAfterVertical ? after.row > point.row : point.row > before.row;
            const right = isAfterVertical ? point.col > before.col : after.col > point.col;

            return {
                x: point.col * pitch - (down ? gap : 0),
                y: point.row * pitch - (right ? 0 : gap),
            };
        });
    };

    /**
     * How long a run of cells is, gaps between them included and the outer gaps not.
     *
     * @param cells How many cells.
     * @param cellSize A cell's size in pixels.
     * @param gap The space between cells.
     */
    export const getSpan = (cells: number, cellSize: number, gap: number) => cells * (cellSize + gap) - gap;

    /**
     * Where a cell starts, from the grid's own edge, the outer gap included.
     *
     * @param cell Which cell, counting from zero.
     * @param cellSize A cell's size in pixels.
     * @param gap The space between cells.
     */
    export const getOffset = (cell: number, cellSize: number, gap: number) => gap + cell * (cellSize + gap);

    /**
     * How large the whole grid is along one axis, a gap on either side of its cells.
     *
     * @param cells How many cells along that axis.
     * @param cellSize A cell's size in pixels.
     * @param gap The space between cells.
     */
    export const getExtent = (cells: number, cellSize: number, gap: number) => gap * 2 + getSpan(cells, cellSize, gap);

    /**
     * Every cell of the grid, row by row, which is the order the cell layer lays them out in.
     *
     * @param columns The grid's colCount.
     * @param rows The grid's rowCount.
     */
    export const getSpots = (columns: number, rows: number): SortableGridSpot[] =>
        Array.from({ length: columns * rows }, (_unused, index) => ({
            col: index % columns,
            row: Math.floor(index / columns),
        }));

    /**
     * What a painter is handed about a shape: its size in cells, a pixel rectangle per cell, the largest solid
     * rectangle inside it and its outline.
     *
     * Everything is in pixels from the shape's own top-left corner, so a painter never needs the cell size or the
     * gap.
     *
     * @param shape The shape, turns applied.
     * @param cellSize A cell's size in pixels.
     * @param gap The space between cells.
     */
    export const getGeometry = (shape: SortableGridShape, cellSize: number, gap: number): SortableGridGeometry => {
        const block = getBlock(shape.cells);
        const pitch = cellSize + gap;

        return {
            size: shape.size,
            cells: getCellRects(shape.cells, cellSize, gap),
            block: {
                spot: block.spot,
                left: block.spot.col * pitch,
                top: block.spot.row * pitch,
                width: getSpan(block.size.colCount, cellSize, gap),
                height: getSpan(block.size.rowCount, cellSize, gap),
            },
            outline: getOutline(shape.cells, cellSize, gap),
        };
    };

    /**
     * An item's accessible name: the consumer's own, then its footprint and where it sits.
     *
     * A position on a board cannot be inferred from anything else that is spoken, so it is said with the name.
     *
     * @param label The consumer's name for the item.
     * @param item The item.
     */
    export const computeItemLabel = <T, TTooltipDefs>(label: string, item: SortableGridItemRecord<T, TTooltipDefs>) => {
        const size = getItemShape(item).size;

        return `${label}, ${size.colCount} by ${size.rowCount}, column ${item.spot.col + 1}, row ${item.spot.row + 1}`;
    };

    /**
     * The shape a carried item takes at a number of turns. An item from a list has no footprint and is one cell.
     *
     * @param carry The carry in flight.
     * @param turns How many quarter turns clockwise.
     */
    export const getCarriedShape = (carry: Carry, turns: number) =>
        getShape((carry.value as Partial<SortableGridItemRecord<unknown, unknown>>).footprint ?? SINGLE_CELL, turns);

    /**
     * How far the carried item is turned where it is aimed.
     *
     * @param carry The carry in flight.
     * @param targetPlace Where it is aimed. A place another kind of zone made carries no turn, so the item's own
     * counts.
     */
    export const getAimedTurns = (carry: Carry, targetPlace: CarryPlace | undefined) =>
        getIsPlace(targetPlace)
            ? targetPlace.turns
            : ((carry.value as Partial<SortableGridItemRecord<unknown, unknown>>).turns ?? 0);

    /**
     * Where a picked-up item's floating copy is held, and which of its cells the pointer took hold of.
     *
     * A pointer keeps its grip where it pressed; a keyboard pick-up has no grip, so the copy is held by its middle.
     * Everything is in the viewport's content coordinates, so the copy follows the pointer at any scale.
     *
     * @param rect The item's box, in client coordinates, if it has been measured.
     * @param viewportContext The viewport the item is drawn in.
     * @param shape The item's shape, turns applied.
     * @param opts.cellSize A cell's size in pixels.
     * @param opts.gap The space between cells.
     * @param opts.from Where the pointer pressed, in client coordinates, for a pick-up by pointer.
     * @returns `grabOffset`, where the copy is held from its corner; `grabSpot`, the cell that was taken hold of,
     * for {@link grab}; and `point`, where the pointer is, or `undefined` for a pick-up by key.
     */
    export const computePickUp = (
        rect: DOMRect | undefined,
        viewportContext: ViewportContextType,
        shape: SortableGridShape,
        opts: { cellSize: number; gap: number; from?: Point2d },
    ): SortableGridPickUp => {
        const pitch = opts.cellSize + opts.gap;
        const point = rect && opts.from ? ViewportUtils.getAdjustedClientPoint(opts.from, viewportContext) : undefined;

        let grabOffset: Point2d = { x: 0, y: 0 };

        if (rect) {
            const origin = ViewportUtils.getAdjustedClientPoint({ x: rect.left, y: rect.top }, viewportContext);

            grabOffset = point
                ? { x: point.x - origin.x, y: point.y - origin.y }
                : {
                      x: getSpan(shape.size.colCount, opts.cellSize, opts.gap) * 0.5,
                      y: getSpan(shape.size.rowCount, opts.cellSize, opts.gap) * 0.5,
                  };
        }

        return {
            grabOffset,
            point,
            grabSpot: {
                col: Math.min(Math.floor(grabOffset.x / pitch), shape.size.colCount - 1),
                row: Math.min(Math.floor(grabOffset.y / pitch), shape.size.rowCount - 1),
            },
        };
    };

    /**
     * Records which cell of an item the carry about to start took hold of, so every grid it is aimed into follows
     * that cell rather than the item's corner.
     *
     * @param zone The zone the carry starts in.
     * @param spot The cell taken hold of, from the item's own top-left corner.
     */
    export const grab = (zone: CarrierZone, spot: SortableGridSpot) => {
        grabbed = { zone, spot };
    };

    /**
     * The cell of a shape the pointer holds, for the carry in flight.
     *
     * A carry that did not begin with {@link grab} — one from a list — takes hold at the top left, and the cell is
     * held inside the shape, since a turn can make a shape narrower than where it was held.
     *
     * @param shape The carried shape, turns applied.
     */
    export const getGrabSpot = (shape: SortableGridShape): SortableGridSpot => {
        if (!grabbed || grabbed.zone !== CarrierUtils.getSourceZone()) return FIRST_SPOT;

        return {
            col: Math.min(grabbed.spot.col, shape.size.colCount - 1),
            row: Math.min(grabbed.spot.row, shape.size.rowCount - 1),
        };
    };

    /**
     * What a key pressed on an item does.
     *
     * Enter and Space pick the item up, and put a carried one down. Escape cancels a carry and is left alone
     * otherwise. Tab carries the item to the next grid that will take it, Shift reversing the way. While carrying,
     * the arrows move the item a cell at a time; while not, they walk to the nearest item that way, and Home and End
     * go to the first and last item in reading order.
     *
     * @param key The `key` of the keyboard event.
     * @param opts.index The item the key was pressed on.
     * @param opts.isShifted Whether Shift was held.
     * @param opts.isCarrying Whether a carry begun by key or tap is in flight. A drag is left to the pointer.
     * @param opts.navigable The walkable indexes.
     * @param opts.boxes Every item's position and size, by index.
     * @returns What to do, or `undefined` when the key is not the grid's and should be left alone.
     */
    export const computeKeyAction = (
        key: string,
        opts: { index: number; isShifted: boolean; isCarrying: boolean; navigable: number[]; boxes: SortableGridBox[] },
    ): SortableKeyAction | undefined => {
        if (key === CANCEL_KEY) return opts.isCarrying ? { kind: "cancel" } : undefined;

        if (NavigatorUtils.getIsActivationKey(key)) return opts.isCarrying ? { kind: "drop" } : { kind: "pickUp" };

        if (opts.isCarrying && key === NEXT_ZONE_KEY) return { kind: "aimAtNextZone", step: opts.isShifted ? -1 : 1 };

        if (opts.isCarrying) {
            const nudge = NUDGE_KEYS[key];

            return nudge ? { kind: "nudge", nudge } : undefined;
        }

        if (opts.navigable.length < 1) return;

        if (key === "Home" || key === "End") {
            const reading = getReadingOrder(opts.boxes).filter((entry) => opts.navigable.includes(entry));

            return { kind: "focus", index: key === "Home" ? reading[0] : reading[reading.length - 1] };
        }

        const step = STEP_KEYS[key];

        if (!step) return;

        const next = getNeighborIndex(
            opts.navigable.map((entry) => opts.boxes[entry]),
            opts.navigable.indexOf(opts.index),
            step,
        );

        return next === undefined
            ? { kind: "focus", index: opts.index }
            : { kind: "focus", index: opts.navigable[next] };
    };

    /**
     * The zone a grid offers every carry: what it accepts, where a point, a nudge or a Tab lands, whether a place is
     * free, how its places are named, and how it takes, puts and moves items.
     *
     * Everything is read through the getters when a carry asks, so the zone is made once and follows the grid as it
     * changes. Items are changed only through `updateItems`, and `onTransfer` is told after an item lands here.
     *
     * @param defs The grid's state and answers, read at the moment a carry needs them. `getZone` is the zone as it
     * was registered, which a framework may have wrapped.
     * @returns The zone, to register with the carrier.
     */
    export const createZone = <T, TTooltipDefs>(defs: SortableGridZoneDefs<T, TTooltipDefs>): CarrierZone => {
        const asPlace = (place: CarryPlace) => place as SortableGridPlace;

        const asItem = (carry: Carry) => carry.value as SortableGridItemRecord<T, TTooltipDefs>;

        const getTakenCells = (carry: Carry) => [
            ...defs.getBlockedSpots(),
            ...defs
                .getItems()
                .filter((item) => defs.computeItemKey(item.value) !== carry.key)
                .flatMap(getItemCells),
        ];

        const computeIsPlaceAllowed = (place: CarryPlace, carry: Carry) => {
            const current = asPlace(place);
            const shape = getCarriedShape(carry, current.turns);

            return (
                getIsInside(current, shape.size, defs.getColumns(), defs.getRows()) &&
                getIsFree(getPlacedCells({ col: current.col, row: current.row }, shape), getTakenCells(carry))
            );
        };

        const toSpot = (place: CarryPlace) => (getIsPlace(place) ? { col: place.col, row: place.row } : undefined);

        return {
            getGroupId: defs.getGroupId,
            getLabel: defs.getLabel,
            getRootRef: defs.getRootRef,
            getIsDisabled: defs.getIsDisabled,
            getKeyHint: (hasOtherZones) =>
                hasOtherZones ? defs.getAnnouncements().keyHintAcrossZones : defs.getAnnouncements().keyHint,
            getAnnouncements: defs.getAnnouncements,
            computeCanAccept: (carry) => {
                if (defs.getIsDisabled() || defs.getIsLocked()) return false;

                return (
                    defs.computeCanAccept?.(asItem(carry).value, CarrierUtils.getSourceZone()?.getLabel() ?? "") ?? true
                );
            },
            computePlaceAtPoint: (point, carry) => {
                const root = defs.getRootRef();

                if (!root) return;

                const turns = getAimedTurns(carry, CarrierUtils.getTargetPlace());
                const shape = getCarriedShape(carry, turns);
                const rect = root.getBoundingClientRect();
                const scale = defs.getScale();
                const gap = defs.getGap();
                const pitch = defs.getCellSize() + gap;
                const grip = getGrabSpot(shape);
                const cell = {
                    col: Math.floor(((point.x - rect.left) / scale - gap) / pitch) - grip.col,
                    row: Math.floor(((point.y - rect.top) / scale - gap) / pitch) - grip.row,
                };

                return {
                    ...getClampedSpot(cell, shape.size, defs.getColumns(), defs.getRows()),
                    turns,
                } satisfies SortableGridPlace;
            },
            computeNudgedPlace: (place, nudge, carry) => {
                const current = asPlace(place);
                const turns = nudge.turn && defs.getIsTurnable() ? current.turns + nudge.turn : current.turns;
                const spot = getSteppedSpot(
                    current,
                    { col: nudge.x ?? 0, row: nudge.y ?? 0 },
                    getCarriedShape(carry, turns),
                    defs.getColumns(),
                    defs.getRows(),
                    defs.getBlockedSpots(),
                );

                return { ...spot, turns } satisfies SortableGridPlace;
            },
            computeEntryPlace: (carry) => {
                const item = asItem(carry);
                const turns = item.turns ?? 0;

                if (CarrierUtils.getSourceZone() === defs.getZone()) return { ...item.spot, turns };

                const spot = getFreeSpot(
                    getCarriedShape(carry, turns),
                    defs.getColumns(),
                    defs.getRows(),
                    getTakenCells(carry),
                );

                return { ...(spot ?? FIRST_SPOT), turns } satisfies SortableGridPlace;
            },
            computeIsSamePlace: (first, second) =>
                asPlace(first).col === asPlace(second).col &&
                asPlace(first).row === asPlace(second).row &&
                asPlace(first).turns === asPlace(second).turns,
            computeIsPlaceAllowed,
            computePlaceLabel: (place, carry) => {
                const current = asPlace(place);

                return defs
                    .getAnnouncements()
                    .computePlaceLabel({ col: current.col, row: current.row }, computeIsPlaceAllowed(place, carry));
            },
            takeAt: (_unused, carry) => {
                defs.updateItems((items) => items.filter((item) => defs.computeItemKey(item.value) !== carry.key));
            },
            putAt: (place, carry, origin) => {
                const current = asPlace(place);
                const item = asItem(carry);
                const placed: SortableGridItemRecord<T, TTooltipDefs> = {
                    ...item,
                    spot: { col: current.col, row: current.row },
                    footprint: item.footprint ?? SINGLE_CELL,
                    turns: current.turns,
                };

                defs.updateItems((items) => [...items, placed]);

                defs.onTransfer?.({
                    value: item.value,
                    fromLabel: origin.label,
                    toLabel: defs.getLabel(),
                    fromSpot: toSpot(origin.place),
                    toSpot: placed.spot,
                });
            },
            moveAt: (fromPlace, toPlace, carry) => {
                const current = asPlace(toPlace);
                const item = defs.getItems().find((entry) => defs.computeItemKey(entry.value) === carry.key);

                if (!item) return;

                const moved = { ...item, spot: { col: current.col, row: current.row }, turns: current.turns };

                defs.updateItems((items) =>
                    items.map((entry) => (defs.computeItemKey(entry.value) === carry.key ? moved : entry)),
                );

                defs.onTransfer?.({
                    value: moved.value,
                    fromLabel: defs.getLabel(),
                    toLabel: defs.getLabel(),
                    fromSpot: toSpot(fromPlace),
                    toSpot: moved.spot,
                });
            },
        };
    };
}
