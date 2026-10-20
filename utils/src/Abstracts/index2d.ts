import { Vec2d, type Vec2dString } from "./vec2d.js";

const K1 = "row";
const K2 = "col";

/**
 * A row and a column held together.
 *
 * The name leans towards an index, but the type is the same either way: a tally of eight rows
 * by four columns and a zero-based index of the cell at row eight, column four are the same
 * value, and which one is meant is decided by the name it is given at the call site.
 */
export type Index2d = Vec2d<typeof K1, typeof K2>;

/** An {@link Index2d} flattened into a string, for example `ROW3_COL4`. Handy as a map key. */
export type Index2dString = Vec2dString<typeof K1, typeof K2>;

/** Arithmetic on {@link Index2d} values. Every operation returns a new value and modifies nothing. */
export namespace Index2d {
    /** Takes the smaller row and the smaller column of two values. Gives `undefined` if either is missing. */
    export const min = Vec2d.min(K1, K2);
    /** Takes the larger row and the larger column of two values. Gives `undefined` if either is missing. */
    export const max = Vec2d.max(K1, K2);
    /** Adds two values together. */
    export const add = Vec2d.add(K1, K2);
    /** Subtracts the second value from the first. */
    export const sub = Vec2d.sub(K1, K2);
    /** Multiplies row by row and column by column. */
    export const mul = Vec2d.mul(K1, K2);
    /** Divides row by row and column by column. */
    export const div = Vec2d.div(K1, K2);
    /** Tests whether two values match exactly. */
    export const isSame = Vec2d.isSame(K1, K2);
    /** Flattens a value into a string such as `ROW3_COL4`. */
    export const toString = Vec2d.toString(K1, K2);
}

export namespace Index2dString {
    /** Parses a string such as `ROW3_COL4` back into an {@link Index2d}. */
    export const fromString = Vec2d.fromString(K1, K2);
}

/** Moving between a cell of a grid and its place in the grid read as one list. */
export namespace Index2dUtils {
    /**
     * Finds a cell's place in its grid read row by row, the first row left to right, then the next.
     *
     * @param cell The cell. A column at or past `colCount` runs on into the next row.
     * @param colCount How many columns each row holds.
     * @returns The cell's place, counting from `0`.
     */
    export const toFlatIndex = (cell: Index2d, colCount: number) => cell.row * colCount + cell.col;

    /**
     * Finds a cell's place in its grid read column by column, the first column top to bottom, then the next.
     *
     * @param cell The cell. A row at or past `rowCount` runs on into the next column.
     * @param rowCount How many rows each column holds.
     * @returns The cell's place, counting from `0`.
     */
    export const toFlatIndexByColumn = (cell: Index2d, rowCount: number) => cell.col * rowCount + cell.row;

    /**
     * Finds the cell at a place in a grid read row by row — the reverse of {@link toFlatIndex}.
     *
     * The column always comes back from `0` to `colCount - 1`, so a negative place lands in a row before the
     * first, counted back from its last column: `-1` is the last column of row `-1`.
     *
     * @param flat The place, counting from `0`. Fractions are truncated.
     * @param colCount How many columns each row holds. `0` or less has no cells and answers the first one.
     * @returns The cell.
     */
    export const fromFlatIndex = (flat: number, colCount: number): Index2d => {
        if (colCount < 1) return { row: 0, col: 0 };

        const whole = Math.trunc(flat);

        return { row: Math.floor(whole / colCount), col: ((whole % colCount) + colCount) % colCount };
    };
}
