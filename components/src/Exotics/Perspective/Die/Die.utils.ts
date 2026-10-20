import {
    Matrix3dUtils,
    Point3d,
    Point3dUtils,
    type Quaternion,
    QuaternionUtils,
    type Size2d,
} from "@thewaver/ss-utils";

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
/** How far apart two corners may be, as a share of the die's radius, and still count as the same place. */
const SYMMETRY_EPSILON = 1e-6;

/** The way a face points before it is known, straight at the viewer. */
const FACING_NORMAL: Point3d = { x: 0, y: 0, z: 1 };
/** The size of a face that does not exist. */
const NO_SIZE: Size2d = { width: 0, height: 0 };

const computeNormal = (points: Point3d[]) =>
    Point3dUtils.getNormal(
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

const getIsCentrallySymmetric = (offsets: Point3d[], tolerance: number) =>
    offsets.every((offset) => offsets.some((other) => Point3dUtils.getLength(Point3d.add(offset, other)) <= tolerance));

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
     * The faces are `Point3dUtils.getConvexHull`'s, so it is meant for the few dozen corners a die has, not for
     * thousands.
     */
    export const computeHull = (vertices: Point3d[]): DieShape => ({
        vertices,
        faces: Point3dUtils.getConvexHull(vertices),
    });

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
            const points = face.map((index) => Point3d.mul(shape.vertices[index], Point3d.spread(radius)));
            const center = Point3dUtils.getCentroid(points);
            const facing = computeNormal(points);
            const normal =
                Point3dUtils.dot(facing, center) < NOTHING ? Point3d.mul(facing, Point3d.spread(-SINGLE)) : facing;
            const corners = points.map((point) => Point3d.sub(point, center));
            const flatOffsets = corners.map((corner) =>
                Point3d.sub(corner, Point3d.mul(normal, Point3d.spread(Point3dUtils.dot(corner, normal)))),
            );
            const [first, second] = flatOffsets;
            const toTop = getIsCentrallySymmetric(flatOffsets, radius * SYMMETRY_EPSILON)
                ? Point3d.mul(Point3d.add(first, second), Point3d.spread(HALF))
                : first;
            const up = Point3dUtils.getNormal(toTop);
            const down = Point3d.mul(up, Point3d.spread(-SINGLE));
            const right = Point3dUtils.cross(down, normal);
            const contour = points.map((point) => {
                const offset = Point3d.sub(point, center);

                return { x: Point3dUtils.dot(offset, right), y: Point3dUtils.dot(offset, down) };
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
        Matrix3dUtils.toCss(
            [
                face.right.x,
                face.down.x,
                face.normal.x,
                face.right.y,
                face.down.y,
                face.normal.y,
                face.right.z,
                face.down.z,
                face.normal.z,
            ],
            face.center,
        );

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
    export const getBodyTransform = (orientation: Quaternion, size: number) =>
        `translateZ(${-size * HALF}px) ${Matrix3dUtils.toCss(QuaternionUtils.toMatrix(orientation))}`;

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
