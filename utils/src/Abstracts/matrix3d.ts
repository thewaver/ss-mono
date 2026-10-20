import { AngleUtils } from "./angle.js";
import { MathUtils } from "./math.js";
import { Point3d } from "./point3d.js";

const SIZE = 3;
const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

/**
 * A 3×3 matrix held as nine numbers in row-major order.
 *
 * Row-major means the first three entries are the top row, so the entry at row `r` and
 * column `c` sits at index `r * 3 + c`.
 */
export type Matrix3d = [number, number, number, number, number, number, number, number, number];

/** Builders and arithmetic for {@link Matrix3d} transforms. */
export namespace Matrix3dUtils {
    /**
     * Combines two transforms into one.
     *
     * Order matters and reads right to left: `multiply(a, b)` applied to a vector gives the
     * same result as applying `b` first and then `a`.
     *
     * @param a The transform applied second.
     * @param b The transform applied first.
     * @returns A new matrix. Neither input is modified.
     */
    export const multiply = (a: Matrix3d, b: Matrix3d): Matrix3d =>
        CELLS.map((idx) => {
            const row = Math.floor(idx / SIZE) * SIZE;
            const col = idx % SIZE;

            return a[row] * b[col] + a[row + 1] * b[SIZE + col] + a[row + 2] * b[2 * SIZE + col];
        }) as Matrix3d;

    /**
     * Runs a point through a transform.
     *
     * @param m The transform to apply.
     * @param v The point to transform.
     * @returns A new point. Neither input is modified.
     */
    export const apply = (m: Matrix3d, v: Point3d): Point3d => ({
        x: m[0] * v.x + m[1] * v.y + m[2] * v.z,
        y: m[3] * v.x + m[4] * v.y + m[5] * v.z,
        z: m[6] * v.x + m[7] * v.y + m[8] * v.z,
    });

    /**
     * Builds a rotation about the X axis, which leaves `x` alone and turns `y` towards `z`.
     *
     * @param degrees How far to turn. Negative turns the other way.
     */
    export const rotationX = (degrees: number): Matrix3d => {
        const radians = degrees * AngleUtils.RADIANS_PER_DEGREE;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        return [1, 0, 0, 0, cos, -sin, 0, sin, cos];
    };

    /**
     * Builds a rotation about the Y axis, which leaves `y` alone and turns `z` towards `x`.
     *
     * @param degrees How far to turn. Negative turns the other way.
     */
    export const rotationY = (degrees: number): Matrix3d => {
        const radians = degrees * AngleUtils.RADIANS_PER_DEGREE;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        return [cos, 0, sin, 0, 1, 0, -sin, 0, cos];
    };

    /**
     * Builds a rotation about the Z axis, which leaves `z` alone and turns `x` towards `y`.
     *
     * @param degrees How far to turn. Negative turns the other way.
     */
    export const rotationZ = (degrees: number): Matrix3d => {
        const radians = degrees * AngleUtils.RADIANS_PER_DEGREE;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        return [cos, -sin, 0, sin, cos, 0, 0, 0, 1];
    };

    /**
     * Builds a transform that stretches the X and Y axes, leaving Z untouched.
     *
     * @param scaleX How much to stretch sideways. `1` leaves it alone, negative flips it.
     * @param scaleY How much to stretch up and down.
     */
    export const scaling = (scaleX: number, scaleY: number): Matrix3d => [scaleX, 0, 0, 0, scaleY, 0, 0, 0, 1];

    /**
     * Flips a matrix across its diagonal, so rows become columns.
     *
     * For a rotation this is the turn undone: `multiply(m, transpose(m))` is no turn at all.
     */
    export const transpose = (m: Matrix3d): Matrix3d => [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]];

    /**
     * Tests whether two matrices match entry by entry.
     *
     * @param a One matrix.
     * @param b The other.
     * @param tolerance How far apart two entries may be and still match, to allow for rounding. `0` asks for an
     * exact match.
     */
    export const isSame = (a: Matrix3d, b: Matrix3d, tolerance = 0) =>
        a.every((value, index) => Math.abs(value - b[index]) <= tolerance);

    /**
     * Rounds every entry to a whole number.
     *
     * A turn by whole quarter turns has only `-1`, `0` and `1` in it, so this removes the drift a run of such turns
     * picks up. A negative zero comes back as `0`.
     */
    export const round = (m: Matrix3d): Matrix3d => m.map((value) => Math.round(value) + 0) as Matrix3d;

    /**
     * Measures how far a rotation turns in all, about whatever axis it turns.
     *
     * @param m A rotation, with no stretching in it.
     * @returns The angle in degrees, from `0` for no turn up to `180` for half a turn. Every turn has an equal one
     * the other way round, so nothing past half a turn is ever answered.
     */
    export const getRotationAngle = (m: Matrix3d) =>
        AngleUtils.fromRadians(Math.acos(MathUtils.clamp((m[0] + m[4] + m[8] - 1) * 0.5, -1, 1)));

    /**
     * Writes a transform as the CSS `matrix3d(…)` function that draws it, optionally moved somewhere.
     *
     * The matrix's columns are where the element's own right, down and outwards directions end up, so a matrix
     * built from three directions — a face's right, down and normal — places an element along them.
     *
     * @param m The transform, rows first as everywhere here; CSS wants columns, and the reordering is done here.
     * @param offset Where to move the element's origin to afterwards, in pixels. Nothing moves it nowhere.
     * @returns A value for the CSS `transform` property.
     */
    export const toCss = (m: Matrix3d, offset?: Point3d) =>
        `matrix3d(${[
            m[0],
            m[3],
            m[6],
            0,
            m[1],
            m[4],
            m[7],
            0,
            m[2],
            m[5],
            m[8],
            0,
            offset?.x ?? 0,
            offset?.y ?? 0,
            offset?.z ?? 0,
            1,
        ].join(", ")})`;

    /**
     * Reads the turning and stretching back out of a CSS transform, as a browser reports it.
     *
     * A computed `transform` is always `none`, `matrix(…)` or `matrix3d(…)`, so those three are what this reads.
     * Anything the transform moves is left out, since a 3×3 matrix has nowhere to hold it, and so is perspective.
     * Browsers round what they report, so a caller expecting whole numbers back rounds the answer itself.
     *
     * @param transform A computed `transform` value.
     * @returns The transform, rows first, or `undefined` for anything else.
     */
    export const fromCss = (transform: string): Matrix3d | undefined => {
        if (transform === "none") return [1, 0, 0, 0, 1, 0, 0, 0, 1];

        const values = transform
            .slice(transform.indexOf("(") + 1, transform.lastIndexOf(")"))
            .split(",")
            .map(Number);

        if (values.some((value) => !Number.isFinite(value))) return undefined;

        if (transform.startsWith("matrix3d(") && values.length === 16) {
            return [values[0], values[4], values[8], values[1], values[5], values[9], values[2], values[6], values[10]];
        }

        if (transform.startsWith("matrix(") && values.length === 6) {
            return [values[0], values[2], 0, values[1], values[3], 0, 0, 0, 1];
        }

        return undefined;
    };
}
