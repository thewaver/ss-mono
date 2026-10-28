import type { Point2d, Rect } from "@thewaver/ss-utils";

export type PaintedRegionRadii = [topLeft: number, topRight: number, bottomRight: number, bottomLeft: number];

export type PaintedRegion = {
    /** The region's box, in layout pixels from the top left corner of the element that was read. */
    rect: Rect;
    /** How far each corner of the box is rounded, in layout pixels. */
    radii: PaintedRegionRadii;
    /** The color that paints there, as CSS writes it. */
    color: string;
    /**
     * Whether a point inside the box is painted, for a shape the box overstates. Left out, the rounded box is the
     * region.
     */
    getIsInside?: (point: Point2d) => boolean;
    /**
     * The color painted at a point inside the box, for a region whose color changes from point to point: a picture,
     * which may be transparent in places, or an SVG shape whose stroke paints over its fill in another color.
     * `undefined` for a point nothing is painted at. Left out, the region is one flat `color`.
     */
    getColorAt?: (point: Point2d) => string | undefined;
};

export type PaintedSample = {
    /** A point that is painted, in the same coordinates as the regions. */
    pos: Point2d;
    /** The color of what paints there. */
    color: string;
};
