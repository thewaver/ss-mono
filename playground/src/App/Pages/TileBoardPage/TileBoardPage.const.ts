import { Index2d, type Index2dString } from "@thewaver/ss-utils";

export const EXAMPLE_NAMES = {
    default: "A board you can mark",
    meeple: "A piece that lives above the board",
    route: "The shortest way round",
    paint: "Paint by sweeping",
    disabled: "Disabled",
};

export const EXAMPLES_ROOT = "/src/App/Pages/TileBoardPage/Examples";

export const FIELD_WIDTH = 130;

export const STARTING_PIECE: Index2d = { row: 2, col: 2 };

export const ROUTE_START: Index2d = { row: 0, col: 0 };

export const ROCKS: Index2d[] = [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 2, col: 2 },
    { row: 3, col: 1 },
    { row: 3, col: 2 },
];

export const NO_MARKS: Index2dString[] = [];
