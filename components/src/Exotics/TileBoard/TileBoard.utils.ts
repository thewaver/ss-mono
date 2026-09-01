import { type Index2d, MathUtils, type Point2d, ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { TileBoardLayout, TileBoardTiling } from "./TileBoard.types";

const EMPTY_SIZE: Size2d = { width: 0, height: 0 };
const NO_TILES = 0;
const FIRST_INDEX = 0;
const SHORT_ROW_TILES = 1;
const HALF = 0.5;
const POINTS_UP = "triangle-up";
const POINTS_RIGHT = "triangle-right";

const TILING_RATIOS: Record<ShapeConst.DefaultShape, TileBoardTiling> = {
    "square": {
        pitch: { width: 1, height: 1 },
        hasOffsetRows: false,
        tileFlip: "none",
        neighbourhood: "orthogonal",
    },
    "lozenge": {
        pitch: { width: 1, height: 0.5 },
        hasOffsetRows: true,
        tileFlip: "none",
        neighbourhood: "diagonal",
    },
    "hexagon-pointy-top": {
        pitch: { width: 1, height: 0.75 },
        hasOffsetRows: true,
        tileFlip: "none",
        neighbourhood: "diagonalAndAcross",
    },
    "hexagon-flat-top": {
        pitch: { width: 1.5, height: 0.5 },
        hasOffsetRows: true,
        tileFlip: "none",
        neighbourhood: "diagonalAndDown",
    },
    "triangle-up": {
        pitch: { width: 0.5, height: 1 },
        hasOffsetRows: false,
        tileFlip: "topToBottom",
        neighbourhood: "uprightTriangle",
    },
    "triangle-down": {
        pitch: { width: 0.5, height: 1 },
        hasOffsetRows: false,
        tileFlip: "topToBottom",
        neighbourhood: "uprightTriangle",
    },
    "triangle-left": {
        pitch: { width: 1, height: 0.5 },
        hasOffsetRows: false,
        tileFlip: "leftToRight",
        neighbourhood: "sidewaysTriangle",
    },
    "triangle-right": {
        pitch: { width: 1, height: 0.5 },
        hasOffsetRows: false,
        tileFlip: "leftToRight",
        neighbourhood: "sidewaysTriangle",
    },
};

export namespace TileBoardUtils {
    export const getTiling = (shape: ShapeConst.DefaultShape, tileSize: Size2d): TileBoardTiling => {
        const ratios = TILING_RATIOS[shape];

        return {
            ...ratios,
            pitch: {
                width: tileSize.width * ratios.pitch.width,
                height: tileSize.height * ratios.pitch.height,
            },
        };
    };

    export const getLayout = (
        shape: ShapeConst.DefaultShape,
        count: Index2d,
        tileSize: Size2d,
        hasShortFirstRow: boolean,
    ): TileBoardLayout => ({
        ...getTiling(shape, tileSize),
        shape,
        count,
        tileSize,
        hasShortFirstRow,
    });

    export const getIsShortRow = (row: number, layout: TileBoardLayout) =>
        layout.hasOffsetRows && MathUtils.isOdd(row + (layout.hasShortFirstRow ? SHORT_ROW_TILES : 0));

    export const getRowLength = (row: number, layout: TileBoardLayout) =>
        Math.max(layout.count.col - (getIsShortRow(row, layout) ? SHORT_ROW_TILES : 0), NO_TILES);

    export const getRowOffset = (row: number, layout: TileBoardLayout) =>
        getIsShortRow(row, layout) ? layout.pitch.width * HALF : 0;

    export const getRowTop = (row: number, layout: TileBoardLayout) => row * layout.pitch.height;

    export const getTileCenter = (tile: Index2d, layout: TileBoardLayout): Point2d => ({
        x: getRowOffset(tile.row, layout) + tile.col * layout.pitch.width + layout.tileSize.width * HALF,
        y: getRowTop(tile.row, layout) + layout.tileSize.height * HALF,
    });

    export const getBoardSize = (layout: TileBoardLayout): Size2d => {
        if (layout.count.row < 1 || layout.count.col < 1) return EMPTY_SIZE;

        return {
            width: layout.pitch.width * (layout.count.col - 1) + layout.tileSize.width,
            height: layout.pitch.height * (layout.count.row - 1) + layout.tileSize.height,
        };
    };

    export const getIsFlippedTile = (tile: Index2d, layout: TileBoardLayout) =>
        layout.tileFlip !== "none" && MathUtils.isOdd(tile.row + tile.col);

    export const getTilePoints = (shape: ShapeConst.DefaultShape, tileSize: Size2d, isFlipped: boolean): Point2d[] => {
        const points = ShapeConst.getDefaultShapePoints(shape, tileSize);

        if (!isFlipped) return points;

        if (TILING_RATIOS[shape].tileFlip === "leftToRight") {
            return points.map((point) => ({ x: tileSize.width - point.x, y: point.y })).reverse();
        }

        return points.map((point) => ({ x: point.x, y: tileSize.height - point.y })).reverse();
    };

    export const getIsOnBoard = (tile: Index2d, layout: TileBoardLayout) =>
        tile.row >= FIRST_INDEX &&
        tile.row < layout.count.row &&
        tile.col >= FIRST_INDEX &&
        tile.col < getRowLength(tile.row, layout);

    const computeNeighbours = (tile: Index2d, layout: TileBoardLayout): Index2d[] => {
        const near = getIsShortRow(tile.row, layout) ? 0 : -SHORT_ROW_TILES;
        const far = near + SHORT_ROW_TILES;

        if (layout.neighbourhood === "diagonal") {
            return [
                { row: tile.row - 1, col: tile.col + near },
                { row: tile.row - 1, col: tile.col + far },
                { row: tile.row + 1, col: tile.col + far },
                { row: tile.row + 1, col: tile.col + near },
            ];
        }

        if (layout.neighbourhood === "diagonalAndAcross") {
            return [
                { row: tile.row - 1, col: tile.col + near },
                { row: tile.row - 1, col: tile.col + far },
                { row: tile.row, col: tile.col + 1 },
                { row: tile.row + 1, col: tile.col + far },
                { row: tile.row + 1, col: tile.col + near },
                { row: tile.row, col: tile.col - 1 },
            ];
        }

        if (layout.neighbourhood === "diagonalAndDown") {
            return [
                { row: tile.row - 2, col: tile.col },
                { row: tile.row - 1, col: tile.col + far },
                { row: tile.row + 1, col: tile.col + far },
                { row: tile.row + 2, col: tile.col },
                { row: tile.row + 1, col: tile.col + near },
                { row: tile.row - 1, col: tile.col + near },
            ];
        }

        if (layout.neighbourhood === "sidewaysTriangle") {
            const pointsRight = (layout.shape === POINTS_RIGHT) !== getIsFlippedTile(tile, layout);

            if (pointsRight) {
                return [
                    { row: tile.row - 1, col: tile.col },
                    { row: tile.row + 1, col: tile.col },
                    { row: tile.row, col: tile.col - 1 },
                ];
            }

            return [
                { row: tile.row - 1, col: tile.col },
                { row: tile.row, col: tile.col + 1 },
                { row: tile.row + 1, col: tile.col },
            ];
        }

        if (layout.neighbourhood === "uprightTriangle") {
            const pointsUp = (layout.shape === POINTS_UP) !== getIsFlippedTile(tile, layout);

            if (pointsUp) {
                return [
                    { row: tile.row, col: tile.col + 1 },
                    { row: tile.row + 1, col: tile.col },
                    { row: tile.row, col: tile.col - 1 },
                ];
            }

            return [
                { row: tile.row - 1, col: tile.col },
                { row: tile.row, col: tile.col + 1 },
                { row: tile.row, col: tile.col - 1 },
            ];
        }

        return [
            { row: tile.row - 1, col: tile.col },
            { row: tile.row, col: tile.col + 1 },
            { row: tile.row + 1, col: tile.col },
            { row: tile.row, col: tile.col - 1 },
        ];
    };

    export const getNeighbourTiles = (tile: Index2d, layout: TileBoardLayout): Index2d[] =>
        computeNeighbours(tile, layout).filter((neighbour) => getIsOnBoard(neighbour, layout));

    export const getFirstTile = (): Index2d => ({ row: FIRST_INDEX, col: FIRST_INDEX });

    export const getLastTile = (layout: TileBoardLayout): Index2d => {
        const row = Math.max(layout.count.row - 1, FIRST_INDEX);

        return { row, col: Math.max(getRowLength(row, layout) - 1, FIRST_INDEX) };
    };

    export const clampTile = (tile: Index2d, layout: TileBoardLayout): Index2d => {
        const row = MathUtils.clamp(tile.row, FIRST_INDEX, Math.max(layout.count.row - 1, FIRST_INDEX));

        return {
            row,
            col: MathUtils.clamp(tile.col, FIRST_INDEX, Math.max(getRowLength(row, layout) - 1, FIRST_INDEX)),
        };
    };

    export const computeNextTile = (
        key: string,
        from: Index2d,
        layout: TileBoardLayout,
        opts?: { hasEdgeKeys?: boolean },
    ): Index2d | undefined => {
        if (layout.count.row < 1 || layout.count.col < 1) return;

        const step = (rows: number, cols: number) => clampTile({ row: from.row + rows, col: from.col + cols }, layout);

        if (key === "ArrowRight") return step(0, 1);
        if (key === "ArrowLeft") return step(0, -1);
        if (key === "ArrowDown") return step(1, 0);
        if (key === "ArrowUp") return step(-1, 0);

        if (opts?.hasEdgeKeys === false) return;

        if (key === "Home") return clampTile({ row: from.row, col: FIRST_INDEX }, layout);
        if (key === "End") return clampTile({ row: from.row, col: getRowLength(from.row, layout) - 1 }, layout);
    };
}
