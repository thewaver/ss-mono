import type { Point2d, ShapeGeometry, ShapeJoinRadius, Size2d } from "@thewaver/ss-utils";

export type ShapeStrokeGeom = {
    thicknesses: number[];
    offset?: number;
};

export type ShapeFillGeom = {
    /**
     * How far each edge of the layer's contour is moved out from the shape's own edge, one entry per edge as in
     * `strokeGeom`; a negative entry moves it in. A shorter list repeats its last entry.
     */
    offsets?: number[];
    /**
     * The layer's own corner radii, rounding the moved corners as given. Left out, each corner follows its edges: moved
     * in, a reach shrinks by the offset of the edge across from it, as a CSS box's inner corners do; moved out, it grows.
     */
    joinRadii?: ShapeJoinRadius[];
    /**
     * A clip on the layer's paint, cut along the shape's own contour moved as `offsets` and `joinRadii` move the
     * layer's. Left out, the paint is not clipped; given, it replaces any clip path the layer's defs record points at.
     */
    clip?: ShapeFillClip;
};

export type ShapeFillClip = {
    /** The id the clip is drawn under, unique in the document. */
    id: string;
    /** How far each edge of the clip's contour is moved out from the shape's own edge, as in `ShapeFillGeom`. */
    offsets?: number[];
    /** The clip's own corner radii, as in `ShapeFillGeom`. */
    joinRadii?: ShapeJoinRadius[];
    /** Whether the paint is kept outside the contour rather than inside it. */
    isInverted?: boolean;
};

export type BaseShapeValues = {
    /**
     * How far each corner is rounded. A pair makes the corner elliptical: how far the curve starts back along the edge
     * arriving at the corner, then how far it ends along the edge leaving it.
     */
    joinRadii?: ShapeJoinRadius[];
    /**
     * How square or how pinched each rounded corner is. One is a circular round, higher is squarer, zero is a straight
     * bevel and below zero scoops inward.
     */
    lameExponents?: number[];
    /** How the stroke is drawn along each edge. */
    strokeGeom?: ShapeStrokeGeom[];
    /**
     * The contour each fill layer is painted along, matched to `computeFillDefs` by position. A layer with no entry
     * follows the first stroke's outer edge, as every fill does when this is left out.
     */
    fillGeom?: (ShapeFillGeom | undefined)[];
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
