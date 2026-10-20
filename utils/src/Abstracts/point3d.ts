import { AngleUtils } from "./angle.js";
import type { Point2d } from "./point2d.js";
import { Vec3d, type Vec3dString } from "./vec3d.js";

const K1 = "x";
const K2 = "y";
const K3 = "z";
const PLANE_EPSILON = 1e-6;
const FULL_TURN_RADIANS = Math.PI * 2;

const orderAround = (indices: number[], points: readonly Point3d[], normal: Point3d) => {
    const center = Point3dUtils.getCentroid(indices.map((index) => points[index]));
    const axis = Point3dUtils.getNormal(Point3d.sub(points[indices[0]], center));
    const across = Point3dUtils.cross(normal, axis);

    const angleOf = (index: number) => {
        const offset = Point3d.sub(points[index], center);
        const angle = Math.atan2(Point3dUtils.dot(offset, across), Point3dUtils.dot(offset, axis));

        return angle < 0 ? angle + FULL_TURN_RADIANS : angle;
    };

    return [...indices].sort((first, second) => angleOf(first) - angleOf(second));
};

/** A position (or direction) in 3D space. */
export type Point3d = Vec3d<typeof K1, typeof K2, typeof K3>;

/** A {@link Point3d} flattened into a string, for example `X10_Y20_Z30`. Handy as a map key. */
export type Point3dString = Vec3dString<typeof K1, typeof K2, typeof K3>;

/** Arithmetic on {@link Point3d} values. Every operation returns a new point and modifies nothing. */
export namespace Point3d {
    /** Takes the smaller of each axis from two points. Gives `undefined` if either is missing. */
    export const min = Vec3d.min(K1, K2, K3);
    /** Takes the larger of each axis from two points. Gives `undefined` if either is missing. */
    export const max = Vec3d.max(K1, K2, K3);
    /** Adds two points together. */
    export const add = Vec3d.add(K1, K2, K3);
    /** Subtracts the second point from the first. */
    export const sub = Vec3d.sub(K1, K2, K3);
    /** Multiplies axis by matching axis. To scale by one number, build it with {@link spread} first. */
    export const mul = Vec3d.mul(K1, K2, K3);
    /** Divides axis by matching axis. */
    export const div = Vec3d.div(K1, K2, K3);
    /** Tests whether two points sit at exactly the same place. */
    export const isSame = Vec3d.isSame(K1, K2, K3);
    /** Fills all three axes with the same number. */
    export const spread = Vec3d.spread(K1, K2, K3);
    /** Flattens a point into a string such as `X10_Y20_Z30`. */
    export const toString = Vec3d.toString(K1, K2, K3);
}

export namespace Point3dString {
    /** Parses a string such as `X10_Y20_Z30` back into a {@link Point3d}. */
    export const fromString = Vec3d.fromString(K1, K2, K3);
}

/**
 * Directions, distances and turns in 3D space.
 *
 * Axes follow the screen: `x` runs right, `y` runs down and `z` comes out of the screen towards the viewer.
 * Angles are in degrees.
 */
export namespace Point3dUtils {
    /**
     * Multiplies two directions axis by axis and adds the results.
     *
     * For two directions of length 1 it is the cosine of the angle between them: `1` pointing the same way, `0`
     * at right angles, `-1` pointing opposite ways.
     */
    export const dot = (a: Point3d, b: Point3d) => a.x * b.x + a.y * b.y + a.z * b.z;

    /**
     * Finds the direction at right angles to two others.
     *
     * Its length is the area of the parallelogram the two span, so two directions along the same line answer a
     * point of no length. Order matters: swapping the two reverses the answer.
     */
    export const cross = (a: Point3d, b: Point3d): Point3d => ({
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x,
    });

    /** Measures how far a point sits from the origin, in a straight line. */
    export const getLength = (p: Point3d) => Math.hypot(p.x, p.y, p.z);

    /**
     * Shrinks a direction down to length 1, keeping the way it points.
     *
     * @returns A point of length 1, or the origin if the input had no length to begin with.
     */
    export const getNormal = (p: Point3d): Point3d => {
        const length = getLength(p);

        return length === 0 ? { x: 0, y: 0, z: 0 } : { x: p.x / length, y: p.y / length, z: p.z / length };
    };

    /**
     * Finds the average of a set of points — the middle of a face from its corners, for instance.
     *
     * @returns The average, or the origin when there are no points.
     */
    export const getCentroid = (points: readonly Point3d[]): Point3d => {
        const share = 1 / Math.max(points.length, 1);
        const sum = points.reduce((total, point) => Point3d.add(total, point), { x: 0, y: 0, z: 0 });

        return Point3d.mul(sum, Point3d.spread(share));
    };

    /**
     * Turns a point about a line through space, keeping its distance from it.
     *
     * A positive turn goes the way the right-hand rule gives: with the right thumb along `axis`, the way the
     * fingers curl.
     *
     * @param p The point to turn.
     * @param center Any point on the line.
     * @param axis Which way the line runs. Its length takes no part; one of no length turns nothing.
     * @param degrees How far to turn.
     */
    export const rotateAbout = (p: Point3d, center: Point3d, axis: Point3d, degrees: number): Point3d => {
        if (getLength(axis) === 0) return { ...p };

        const unit = getNormal(axis);
        const arm = Point3d.sub(p, center);
        const radians = AngleUtils.toRadians(degrees);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const along = dot(unit, arm) * (1 - cos);
        const across = cross(unit, arm);

        return {
            x: center.x + arm.x * cos + across.x * sin + unit.x * along,
            y: center.y + arm.y * cos + across.y * sin + unit.y * along,
            z: center.z + arm.z * cos + across.z * sin + unit.z * along,
        };
    };

    /**
     * Converts a place on a cylinder round the `z` axis into a position.
     *
     * The 3D counterpart of `Point2dUtils.polarToCartesian`: `angle` is measured round the axis on the screen's
     * plane the same way, `0` pointing right and `90` down, and `depth` is carried straight into `z`.
     *
     * @param radius How far from the axis.
     * @param angle Which way round the axis, in degrees.
     * @param depth How far along the axis, towards the viewer.
     */
    export const fromCylindrical = (radius: number, angle: number, depth: number): Point3d => {
        const radians = AngleUtils.toRadians(angle);

        return { x: radius * Math.cos(radians), y: radius * Math.sin(radians), z: depth };
    };

    /**
     * Finds where a point in front of a viewer is drawn on screen, as CSS `perspective()` draws it.
     *
     * @param p The point, measured from the middle of the view, in the same units as `perspective`.
     * @param perspective How far away the viewer sits.
     * @returns The point on screen, measured from the middle of the view, or `undefined` when it is level with
     * the viewer or behind them, where nothing can be drawn.
     */
    export const project = (p: Point3d, perspective: number): Point2d | undefined => {
        const depth = perspective - p.z;

        if (depth <= 0) return undefined;

        return { x: (p.x * perspective) / depth, y: (p.y * perspective) / depth };
    };

    /**
     * Wraps a set of points in the smallest convex solid, with a face wherever a flat side forms.
     *
     * Every point that lies on the surface ends up in a face, so points meant as corners all belong to at least one;
     * a point strictly inside the solid belongs to none. Where more than three points lie on one flat side they make
     * one face, so a cube's sides come out as squares rather than pairs of triangles.
     *
     * It compares every three points with every other, so it suits a few dozen points, not thousands.
     *
     * @param points The points.
     * @returns One list per face of the indices of its corners in `points`, in order counterclockwise as seen from
     * outside the solid. Points all in one plane enclose nothing and answer no faces.
     */
    export const getConvexHull = (points: readonly Point3d[]): number[][] => {
        const planes: { normal: Point3d; offset: number; face: number[] }[] = [];
        const count = points.length;

        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                for (let k = j + 1; k < count; k++) {
                    const raw = cross(Point3d.sub(points[j], points[i]), Point3d.sub(points[k], points[i]));

                    if (getLength(raw) < PLANE_EPSILON) continue;

                    let normal = getNormal(raw);
                    let offset = dot(normal, points[i]);

                    const sides = points.map((point) => dot(normal, point) - offset);

                    if (sides.some((side) => side > PLANE_EPSILON)) {
                        if (sides.some((side) => side < -PLANE_EPSILON)) continue;

                        normal = Point3d.mul(normal, Point3d.spread(-1));
                        offset = -offset;
                    }

                    const isKnown = planes.some(
                        (plane) =>
                            dot(plane.normal, normal) >= 1 - PLANE_EPSILON &&
                            Math.abs(plane.offset - offset) <= PLANE_EPSILON,
                    );

                    if (isKnown) continue;

                    const onPlane = points.flatMap((point, index) =>
                        Math.abs(dot(normal, point) - offset) <= PLANE_EPSILON ? [index] : [],
                    );

                    planes.push({ normal, offset, face: orderAround(onPlane, points, normal) });
                }
            }
        }

        return planes.length < 4 ? [] : planes.map((plane) => plane.face);
    };
}
