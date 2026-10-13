import type { Point2d, ShapeGeometry, Size2d } from "@thewaver/ss-utils";

export type ShapeStrokeGeom = {
    thicknesses: number[];
    offset?: number;
};

export type BaseShapeValues = {
    /** How far each corner is rounded. */
    joinRadii?: number[];
    /**
     * How square or how pinched each rounded corner is. One is a circular round, higher is squarer, zero is a straight
     * bevel and below zero scoops inward.
     */
    lameExponents?: number[];
    /** How the stroke is drawn along each edge. */
    strokeGeom?: ShapeStrokeGeom[];
};

export type BaseShapeCbs = {
    /**
     * The corners of the contour, worked out from the element's size. It may instead return the corners together with
     * their styling, as `ShapeUtils.attachArrow` does: a list that comes back with the corners replaces the matching
     * prop — `strokeThicknesses` replacing each stroke's `thicknesses` in turn — because a contour whose corners depend
     * on the size is the only thing that knows which entry goes with which corner.
     */
    computePoints: (size: Size2d) => Point2d[] | ShapeGeometry;
};

export type BaseShapeProps = BaseShapeValues & BaseShapeCbs;
