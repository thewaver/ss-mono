import type { Matrix3d, Point3d, Size2d } from "@thewaver/ss-utils";

import { BarrelUtils } from "../../Primitives/Barrel/Barrel.utils";
import type { DieFaceGeometry, DieQuaternion, DieShape } from "./Die.types";

/** Zero, as a length or an index. */
const NOTHING = 0;
/** One, as a whole or a unit length. */
const SINGLE = 1;
/** Halfway. */
const HALF = 0.5;
/** Double, for the two halves of a width or the doubled terms of a rotation. */
const DOUBLE = 2;
/** A quarter, for recovering a rotation from its largest term. */
const QUARTER = 0.25;
/** How far a corner may sit off a face's plane and still count as on it. */
const PLANE_EPSILON = 1e-6;
/** How close two rotations may be before blending between them stops being worth the trigonometry. */
const SLERP_EPSILON = 1e-6;
/** A full turn, in radians. */
const TURN = Math.PI * 2;
/** How far apart two corners may be, as a share of the die's radius, and still count as the same place. */
const SYMMETRY_EPSILON = 1e-6;

const dot = (a: Point3d, b: Point3d) => a.x * b.x + a.y * b.y + a.z * b.z;

const cross = (a: Point3d, b: Point3d): Point3d => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
});

const subtract = (a: Point3d, b: Point3d): Point3d => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });

const scale = (a: Point3d, factor: number): Point3d => ({ x: a.x * factor, y: a.y * factor, z: a.z * factor });

const normalize = (a: Point3d): Point3d => {
    const length = Math.hypot(a.x, a.y, a.z);

    return length > NOTHING ? scale(a, SINGLE / length) : a;
};

const centroid = (points: Point3d[]): Point3d =>
    scale(
        points.reduce((sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y, z: sum.z + point.z }), {
            x: NOTHING,
            y: NOTHING,
            z: NOTHING,
        }),
        SINGLE / Math.max(points.length, SINGLE),
    );

const computeNormal = (points: Point3d[]) =>
    normalize(
        points.reduce(
            (sum, point, index) => {
                const next = points[(index + SINGLE) % points.length];

                return {
                    x: sum.x + (point.y - next.y) * (point.z + next.z),
                    y: sum.y + (point.z - next.z) * (point.x + next.x),
                    z: sum.z + (point.x - next.x) * (point.y + next.y),
                };
            },
            { x: NOTHING, y: NOTHING, z: NOTHING },
        ),
    );

const orderAround = (indices: number[], vertices: Point3d[], normal: Point3d) => {
    const center = centroid(indices.map((index) => vertices[index]));
    const axis = normalize(subtract(vertices[indices[0]], center));
    const across = cross(normal, axis);

    const angleOf = (index: number) => {
        const offset = subtract(vertices[index], center);
        const angle = Math.atan2(dot(offset, across), dot(offset, axis));

        return angle < NOTHING ? angle + TURN : angle;
    };

    return [...indices].sort((first, second) => angleOf(first) - angleOf(second));
};

const getIsCentrallySymmetric = (offsets: Point3d[], tolerance: number) =>
    offsets.every((offset) =>
        offsets.some((other) => Math.hypot(offset.x + other.x, offset.y + other.y, offset.z + other.z) <= tolerance),
    );

/**
 * Builds the solids a die is made of, and the rotations that turn one face or another towards the viewer.
 *
 * A shape is corners and faces in its own space, centered on the origin and no larger than a unit sphere. Everything
 * in pixels is worked out from it at the size the die is drawn, and turning the die is one rotation applied to the
 * whole solid, held as a quaternion so two rotations can be blended smoothly.
 */
export namespace DieUtils {
    /**
     * Wraps a set of corners in the smallest convex solid, with a face wherever a flat side forms.
     *
     * @param vertices The corners, around the origin. Every one of them ends up on the surface of a convex set.
     * @returns The shape, with each face's corners in order counterclockwise seen from outside. A side where more than
     * three corners are coplanar comes out as one face, so a cube's sides are squares rather than pairs of triangles.
     * It compares every triple of corners, so it is meant for the few dozen corners a die has, not for thousands.
     */
    export const computeHull = (vertices: Point3d[]): DieShape => {
        const planes: { normal: Point3d; offset: number; face: number[] }[] = [];
        const count = vertices.length;

        for (let i = NOTHING; i < count; i++) {
            for (let j = i + SINGLE; j < count; j++) {
                for (let k = j + SINGLE; k < count; k++) {
                    const raw = cross(subtract(vertices[j], vertices[i]), subtract(vertices[k], vertices[i]));

                    if (Math.hypot(raw.x, raw.y, raw.z) < PLANE_EPSILON) continue;

                    let normal = normalize(raw);
                    let offset = dot(normal, vertices[i]);

                    const sides = vertices.map((vertex) => dot(normal, vertex) - offset);

                    if (sides.some((side) => side > PLANE_EPSILON)) {
                        if (sides.some((side) => side < -PLANE_EPSILON)) continue;

                        normal = scale(normal, -SINGLE);
                        offset = -offset;
                    }

                    const isKnown = planes.some(
                        (plane) =>
                            dot(plane.normal, normal) >= SINGLE - PLANE_EPSILON &&
                            Math.abs(plane.offset - offset) <= PLANE_EPSILON,
                    );

                    if (isKnown) continue;

                    const onPlane = vertices.flatMap((vertex, index) =>
                        Math.abs(dot(normal, vertex) - offset) <= PLANE_EPSILON ? [index] : [],
                    );

                    planes.push({ normal, offset, face: orderAround(onPlane, vertices, normal) });
                }
            }
        }

        return { vertices, faces: planes.map((plane) => plane.face) };
    };

    /**
     * Where each face sits and how it is drawn, at a given size.
     *
     * @param shape The solid.
     * @param radius How far a corner at distance one from the center is drawn from it, in pixels.
     * @returns Per face: its center, the direction it points, the two directions across it — right and down as they
     * read once the face is turned towards the viewer — its box, and its outline inside that box, measured from the
     * box's center. A face's top points at its first corner, except on a face that is the same turned half way round,
     * like a square, where it points at the middle of the first edge so the face shows square-on rather than as a
     * diamond. Every face is turned to point outward whatever order its corners were given in.
     */
    export const computeFaceGeometry = (shape: DieShape, radius: number): DieFaceGeometry[] =>
        shape.faces.map((face) => {
            const points = face.map((index) => scale(shape.vertices[index], radius));
            const center = centroid(points);
            const facing = computeNormal(points);
            const normal = dot(facing, center) < NOTHING ? scale(facing, -SINGLE) : facing;
            const corners = points.map((point) => subtract(point, center));
            const flatOffsets = corners.map((corner) => subtract(corner, scale(normal, dot(corner, normal))));
            const [first, second] = flatOffsets;
            const toTop = getIsCentrallySymmetric(flatOffsets, radius * SYMMETRY_EPSILON)
                ? scale({ x: first.x + second.x, y: first.y + second.y, z: first.z + second.z }, HALF)
                : first;
            const up = normalize(toTop);
            const down = scale(up, -SINGLE);
            const right = cross(down, normal);
            const outline = points.map((point) => {
                const offset = subtract(point, center);

                return { x: dot(offset, right), y: dot(offset, down) };
            });
            const size: Size2d = {
                width: Math.max(...outline.map((point) => Math.abs(point.x))) * DOUBLE,
                height: Math.max(...outline.map((point) => Math.abs(point.y))) * DOUBLE,
            };

            return { center, normal, right, down, size, outline };
        });

    /**
     * The CSS transform that puts a face on the solid's surface.
     *
     * @param face The face, from {@link computeFaceGeometry}.
     * @returns A `matrix3d` for an element whose center is the solid's center, turning it to point along the face's
     * normal with its top towards the face's first corner and moving it out to the face's center.
     */
    export const computeFaceTransform = (face: DieFaceGeometry) =>
        `matrix3d(${[
            face.right.x,
            face.right.y,
            face.right.z,
            NOTHING,
            face.down.x,
            face.down.y,
            face.down.z,
            NOTHING,
            face.normal.x,
            face.normal.y,
            face.normal.z,
            NOTHING,
            face.center.x,
            face.center.y,
            face.center.z,
            SINGLE,
        ].join(",")})`;

    /**
     * The rotation that turns a face towards the viewer, the right way up.
     *
     * @param face The face, from {@link computeFaceGeometry}.
     * @returns A rotation, as a matrix in rows, that sends the face's normal towards the viewer and its top up the
     * screen.
     */
    export const computeFacingRotation = (face: DieFaceGeometry): Matrix3d => [
        face.right.x,
        face.right.y,
        face.right.z,
        face.down.x,
        face.down.y,
        face.down.z,
        face.normal.x,
        face.normal.y,
        face.normal.z,
    ];

    /**
     * The CSS transform for a rotation of the whole solid.
     *
     * @param rotation A rotation, as a matrix in rows.
     */
    export const toTransform = (rotation: Matrix3d) =>
        `matrix3d(${[
            rotation[0],
            rotation[3],
            rotation[6],
            NOTHING,
            rotation[1],
            rotation[4],
            rotation[7],
            NOTHING,
            rotation[2],
            rotation[5],
            rotation[8],
            NOTHING,
            NOTHING,
            NOTHING,
            NOTHING,
            SINGLE,
        ].join(",")})`;

    /**
     * A rotation matrix as a quaternion, so it can be blended with another.
     *
     * @param m A rotation, as a matrix in rows.
     */
    export const toQuaternion = (m: Matrix3d): DieQuaternion => {
        const trace = m[0] + m[4] + m[8];

        if (trace > NOTHING) {
            const s = HALF / Math.sqrt(trace + SINGLE);

            return { w: QUARTER / s, x: (m[7] - m[5]) * s, y: (m[2] - m[6]) * s, z: (m[3] - m[1]) * s };
        }

        if (m[0] > m[4] && m[0] > m[8]) {
            const s = DOUBLE * Math.sqrt(SINGLE + m[0] - m[4] - m[8]);

            return { w: (m[7] - m[5]) / s, x: QUARTER * s, y: (m[1] + m[3]) / s, z: (m[2] + m[6]) / s };
        }

        if (m[4] > m[8]) {
            const s = DOUBLE * Math.sqrt(SINGLE + m[4] - m[0] - m[8]);

            return { w: (m[2] - m[6]) / s, x: (m[1] + m[3]) / s, y: QUARTER * s, z: (m[5] + m[7]) / s };
        }

        const s = DOUBLE * Math.sqrt(SINGLE + m[8] - m[0] - m[4]);

        return { w: (m[3] - m[1]) / s, x: (m[2] + m[6]) / s, y: (m[5] + m[7]) / s, z: QUARTER * s };
    };

    /**
     * A quaternion as a rotation matrix.
     *
     * @param q A unit quaternion.
     * @returns The rotation, as a matrix in rows.
     */
    export const toRotation = (q: DieQuaternion): Matrix3d => [
        SINGLE - DOUBLE * (q.y * q.y + q.z * q.z),
        DOUBLE * (q.x * q.y - q.z * q.w),
        DOUBLE * (q.x * q.z + q.y * q.w),
        DOUBLE * (q.x * q.y + q.z * q.w),
        SINGLE - DOUBLE * (q.x * q.x + q.z * q.z),
        DOUBLE * (q.y * q.z - q.x * q.w),
        DOUBLE * (q.x * q.z - q.y * q.w),
        DOUBLE * (q.y * q.z + q.x * q.w),
        SINGLE - DOUBLE * (q.x * q.x + q.y * q.y),
    ];

    /**
     * A turn about an axis, as a quaternion.
     *
     * @param axis The axis to turn about. It need not be a unit vector.
     * @param radians How far to turn.
     */
    export const fromAxisAngle = (axis: Point3d, radians: number): DieQuaternion => {
        const unit = normalize(axis);
        const sine = Math.sin(radians * HALF);

        return { w: Math.cos(radians * HALF), x: unit.x * sine, y: unit.y * sine, z: unit.z * sine };
    };

    /**
     * Two rotations combined into one.
     *
     * @param a The rotation applied second.
     * @param b The rotation applied first.
     */
    export const multiply = (a: DieQuaternion, b: DieQuaternion): DieQuaternion => ({
        w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
        x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
        y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
        z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
    });

    /**
     * A rotation part of the way from one to another, along the shortest turn between them.
     *
     * @param from Where it starts.
     * @param to Where it ends.
     * @param progress How far along, `0` at `from` and `1` at `to`.
     */
    export const slerp = (from: DieQuaternion, to: DieQuaternion, progress: number): DieQuaternion => {
        let cosine = from.w * to.w + from.x * to.x + from.y * to.y + from.z * to.z;
        let target = to;

        if (cosine < NOTHING) {
            cosine = -cosine;
            target = { w: -to.w, x: -to.x, y: -to.y, z: -to.z };
        }

        if (SINGLE - cosine < SLERP_EPSILON) {
            const blended = {
                w: from.w + (target.w - from.w) * progress,
                x: from.x + (target.x - from.x) * progress,
                y: from.y + (target.y - from.y) * progress,
                z: from.z + (target.z - from.z) * progress,
            };
            const length = Math.hypot(blended.w, blended.x, blended.y, blended.z);

            return { w: blended.w / length, x: blended.x / length, y: blended.y / length, z: blended.z / length };
        }

        const angle = Math.acos(cosine);
        const sine = Math.sin(angle);
        const fromShare = Math.sin((SINGLE - progress) * angle) / sine;
        const toShare = Math.sin(progress * angle) / sine;

        return {
            w: from.w * fromShare + target.w * toShare,
            x: from.x * fromShare + target.x * toShare,
            y: from.y * fromShare + target.y * toShare,
            z: from.z * fromShare + target.z * toShare,
        };
    };

    /**
     * How much room to leave for a die so it never clips as it turns.
     *
     * @param size How far across the die is at its widest, in pixels.
     * @returns A square big enough for every orientation of a die whose center sits its own radius behind the screen,
     * allowing for perspective making the near side larger.
     */
    export const getReservedSize = (size: number): Size2d => {
        const radius = size * HALF;
        const extent = BarrelUtils.getProjectedExtent(radius, radius);

        return { width: extent, height: extent };
    };
}
