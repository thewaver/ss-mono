import { AngleUtils } from "./angle.js";
import { type Matrix3d, Matrix3dUtils } from "./matrix3d.js";
import { type Point3d, Point3dUtils } from "./point3d.js";

const SLERP_EPSILON = 1e-6;

/**
 * A turn in 3D space held as four numbers, so two turns blend smoothly into each other.
 *
 * A turn of `angle` about a unit axis is `w = cos(angle / 2)` and `x`, `y`, `z` the axis times `sin(angle / 2)`.
 * Unlike three separate angles, blending two of these never passes through a sudden flip, and a long run of small
 * turns combined one after another does not pile up error the way it would in a matrix.
 */
export type Quaternion = { w: number; x: number; y: number; z: number };

/** Building, combining and blending {@link Quaternion} turns. Every operation returns a new value. */
export namespace QuaternionUtils {
    /** No turn at all. */
    export const IDENTITY: Quaternion = { w: 1, x: 0, y: 0, z: 0 };

    /**
     * Scales a quaternion to length 1, which every turn has to be.
     *
     * A long run of turns combined one after another drifts from length 1 by rounding, and this brings it back.
     *
     * @returns The turn at length 1, or {@link IDENTITY} for one of no length.
     */
    export const normalize = (q: Quaternion): Quaternion => {
        const length = Math.hypot(q.w, q.x, q.y, q.z);

        return length > 0 ? { w: q.w / length, x: q.x / length, y: q.y / length, z: q.z / length } : IDENTITY;
    };

    /**
     * Builds a turn about an axis.
     *
     * @param axis The axis to turn about. Its length takes no part; one of no length gives no turn.
     * @param degrees How far to turn, the way the right-hand rule gives: with the right thumb along `axis`, the
     * way the fingers curl.
     */
    export const fromAxisAngle = (axis: Point3d, degrees: number): Quaternion => {
        if (Point3dUtils.getLength(axis) <= 0) return IDENTITY;

        const unit = Point3dUtils.getNormal(axis);
        const half = AngleUtils.toRadians(degrees) * 0.5;
        const sine = Math.sin(half);

        return { w: Math.cos(half), x: unit.x * sine, y: unit.y * sine, z: unit.z * sine };
    };

    /**
     * Reads the turn out of a rotation matrix.
     *
     * @param m A rotation, rows first, with no stretching in it.
     */
    export const fromMatrix = (m: Matrix3d): Quaternion => {
        const trace = m[0] + m[4] + m[8];

        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1);

            return { w: 0.25 / s, x: (m[7] - m[5]) * s, y: (m[2] - m[6]) * s, z: (m[3] - m[1]) * s };
        }

        if (m[0] > m[4] && m[0] > m[8]) {
            const s = 2 * Math.sqrt(1 + m[0] - m[4] - m[8]);

            return { w: (m[7] - m[5]) / s, x: 0.25 * s, y: (m[1] + m[3]) / s, z: (m[2] + m[6]) / s };
        }

        if (m[4] > m[8]) {
            const s = 2 * Math.sqrt(1 + m[4] - m[0] - m[8]);

            return { w: (m[2] - m[6]) / s, x: (m[1] + m[3]) / s, y: 0.25 * s, z: (m[5] + m[7]) / s };
        }

        const s = 2 * Math.sqrt(1 + m[8] - m[0] - m[4]);

        return { w: (m[3] - m[1]) / s, x: (m[2] + m[6]) / s, y: (m[5] + m[7]) / s, z: 0.25 * s };
    };

    /**
     * Writes a turn as a rotation matrix.
     *
     * @param q A turn of length 1.
     * @returns The rotation, rows first.
     */
    export const toMatrix = (q: Quaternion): Matrix3d => [
        1 - 2 * (q.y * q.y + q.z * q.z),
        2 * (q.x * q.y - q.z * q.w),
        2 * (q.x * q.z + q.y * q.w),
        2 * (q.x * q.y + q.z * q.w),
        1 - 2 * (q.x * q.x + q.z * q.z),
        2 * (q.y * q.z - q.x * q.w),
        2 * (q.x * q.z - q.y * q.w),
        2 * (q.y * q.z + q.x * q.w),
        1 - 2 * (q.x * q.x + q.y * q.y),
    ];

    /**
     * Combines two turns into one.
     *
     * Order matters and reads right to left, as with matrices: `multiply(a, b)` turns by `b` first, then by `a`.
     *
     * @param a The turn applied second.
     * @param b The turn applied first.
     */
    export const multiply = (a: Quaternion, b: Quaternion): Quaternion => ({
        w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
        x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
        y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
        z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
    });

    /**
     * Finds the turn part of the way from one to another, going the shorter way round at an even speed.
     *
     * @param from Where it starts.
     * @param to Where it ends.
     * @param ratio How far along, `0` at `from` and `1` at `to`.
     */
    export const slerp = (from: Quaternion, to: Quaternion, ratio: number): Quaternion => {
        let cosine = from.w * to.w + from.x * to.x + from.y * to.y + from.z * to.z;
        let target = to;

        if (cosine < 0) {
            cosine = -cosine;
            target = { w: -to.w, x: -to.x, y: -to.y, z: -to.z };
        }

        if (1 - cosine < SLERP_EPSILON) {
            return normalize({
                w: from.w + (target.w - from.w) * ratio,
                x: from.x + (target.x - from.x) * ratio,
                y: from.y + (target.y - from.y) * ratio,
                z: from.z + (target.z - from.z) * ratio,
            });
        }

        const angle = Math.acos(cosine);
        const sine = Math.sin(angle);
        const fromShare = Math.sin((1 - ratio) * angle) / sine;
        const toShare = Math.sin(ratio * angle) / sine;

        return {
            w: from.w * fromShare + target.w * toShare,
            x: from.x * fromShare + target.x * toShare,
            y: from.y * fromShare + target.y * toShare,
            z: from.z * fromShare + target.z * toShare,
        };
    };

    /**
     * Turns a direction or a point about the origin.
     *
     * @param q The turn.
     * @param p The direction or point to turn.
     */
    export const rotate = (q: Quaternion, p: Point3d): Point3d => Matrix3dUtils.apply(toMatrix(q), p);
}
