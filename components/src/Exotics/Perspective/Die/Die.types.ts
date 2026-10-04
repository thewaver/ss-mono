import type { Point3d, Size2d } from "@thewaver/ss-utils";

export type DieShape = {
    vertices: Point3d[];
    faces: number[][];
};

export type DieFaceGeometry = {
    center: Point3d;
    normal: Point3d;
    right: Point3d;
    down: Point3d;
    size: Size2d;
    contour: { x: number; y: number }[];
};

export type DieFaceState = {
    /** Which face this is, counting from zero in the order the shape lists its faces. */
    index: number;
    /** Whether this is the face turned towards the viewer with the die at rest. No face is showing while it turns. */
    isShowing: boolean;
    /** Which way the face points, out from the die's center, before the die is turned. A unit vector. */
    normal: Point3d;
    /** How large the face's own box is, in pixels; the face's contour is centered in it. */
    size: Size2d;
};
