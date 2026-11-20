import { Vec2d, type Vec2dString } from "./vec2d.js";

const K1 = "rowCount";
const K2 = "colCount";

/** A tally of rows and columns: how many of each a grid holds, as opposed to the position of one cell in it. */
export type Count2d = Vec2d<typeof K1, typeof K2>;

/** A {@link Count2d} flattened into a string, for example `ROWCOUNT3_COLCOUNT4`. Handy as a map key. */
export type Count2dString = Vec2dString<typeof K1, typeof K2>;

/** Arithmetic on {@link Count2d} values. Every operation returns a new value and modifies nothing. */
export namespace Count2d {
    /** Takes the smaller row count and the smaller column count of two values. Gives `undefined` if either is missing. */
    export const min = Vec2d.min(K1, K2);
    /** Takes the larger row count and the larger column count of two values. Gives `undefined` if either is missing. */
    export const max = Vec2d.max(K1, K2);
    /** Adds two values together. */
    export const add = Vec2d.add(K1, K2);
    /** Subtracts the second value from the first. */
    export const sub = Vec2d.sub(K1, K2);
    /** Multiplies row count by row count and column count by column count. */
    export const mul = Vec2d.mul(K1, K2);
    /** Divides row count by row count and column count by column count. */
    export const div = Vec2d.div(K1, K2);
    /** Tests whether two values match exactly. */
    export const isSame = Vec2d.isSame(K1, K2);
    /** Flattens a value into a string such as `ROWCOUNT3_COLCOUNT4`. */
    export const toString = Vec2d.toString(K1, K2);
}

/** Reading a tally of rows and columns back from its text form. */
export namespace Count2dString {
    /** Parses a string such as `ROWCOUNT3_COLCOUNT4` back into a {@link Count2d}. */
    export const fromString = Vec2d.fromString(K1, K2);
}
