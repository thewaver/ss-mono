import type { Matrix3d, Point3d, Size2d } from "@thewaver/ss-utils";

import type { RollerQuaternion } from "../../../Abstracts/Roller/Roller.types";
import { RollerUtils } from "../../../Abstracts/Roller/Roller.utils";
import { BarrelUtils } from "../../../Primitives/Barrel/Barrel.utils";
import type { DieFaceGeometry, DieFaceState, DieShape } from "./Die.types";

/** Zero, as a length or an index. */
const NOTHING = 0;
/** One, as a whole or a unit length. */
const SINGLE = 1;
/** Halfway. */
const HALF = 0.5;
/** Double, for the two halves of a width. */
const DOUBLE = 2;
/** How far a corner may sit off a face's plane and still count as on it. */
const PLANE_EPSILON = 1e-6;
/** A full turn, in radians. */
const TURN = Math.PI * 2;
/** How far apart two corners may be, as a share of the die's radius, and still count as the same place. */
const SYMMETRY_EPSILON = 1e-6;

/** The way a face points before it is known, straight at the viewer. */
const FACING_NORMAL: Point3d = { x: 0, y: 0, z: 1 };
/** The size of a face that does not exist. */
const NO_SIZE: Size2d = { width: 0, height: 0 };

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
 * in pixels is worked out from it at the size the die is drawn. Turning the die is `RollerUtils`' business: every face
 * here carries the direction it points and the direction that reads as down on it, which is what a roller lands on.
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
     * read once the face is turned towards the viewer — its box, and its contour inside that box, measured from the
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
            const contour = points.map((point) => {
                const offset = subtract(point, center);

                return { x: dot(offset, right), y: dot(offset, down) };
            });
            const size: Size2d = {
                width: Math.max(...contour.map((point) => Math.abs(point.x))) * DOUBLE,
                height: Math.max(...contour.map((point) => Math.abs(point.y))) * DOUBLE,
            };

            return { center, normal, right, down, size, contour };
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

    /**
     * The transform the die's body is drawn with: pushed back its own radius, then turned.
     *
     * @param orientation How the die is turned.
     * @param size How far across the die is at its widest.
     * @returns The CSS `transform`.
     */
    export const getBodyTransform = (orientation: RollerQuaternion, size: number) =>
        `translateZ(${-size * HALF}px) ${toTransform(RollerUtils.toRotation(orientation))}`;

    /**
     * Where one face's box sits inside the die's box, and the contour it is clipped to.
     *
     * @param face The face.
     * @param size How far across the die is at its widest.
     * @returns The box's offset from the top left, so it is centered, and the CSS `clip-path` polygon of its contour.
     */
    export const getFaceBox = (face: DieFaceGeometry, size: number) => ({
        left: (size - face.size.width) * HALF,
        top: (size - face.size.height) * HALF,
        clipPath: `polygon(${face.contour
            .map((point) => `${point.x + face.size.width * HALF}px ${point.y + face.size.height * HALF}px`)
            .join(",")})`,
    });

    /**
     * What one face's painter is told.
     *
     * @param geometry The die's faces.
     * @param index Which face.
     * @param restingFace The face the die rests on, or `undefined` while it turns.
     * @returns The face's state.
     */
    export const getFaceState = (
        geometry: DieFaceGeometry[],
        index: number,
        restingFace: number | undefined,
    ): DieFaceState => ({
        index,
        isShowing: index === restingFace,
        normal: geometry[index]?.normal ?? FACING_NORMAL,
        size: geometry[index]?.size ?? NO_SIZE,
    });
}
