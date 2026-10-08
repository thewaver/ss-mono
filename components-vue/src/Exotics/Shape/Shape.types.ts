import type { VNodeChild } from "vue";

import type { ShapeStrokeGeom } from "@thewaver/ss-components";
import type { Point2d, ShapeGeometry, Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefs.types";

export type ShapeProps = {
    /** How far each corner is rounded. */
    joinRadii?: number[];
    /**
     * How square or how pinched each rounded corner is. One is a circular round, higher is squarer, zero is a straight
     * bevel and below zero scoops inward.
     */
    lameExponents?: number[];
    /** How the stroke is drawn along each edge. */
    strokeGeom?: ShapeStrokeGeom[];
    /**
     * The corners of the contour, worked out from the element's size. It may instead return the corners together with
     * their styling, as `ShapeUtils.attachArrow` does: a list that comes back with the corners replaces the matching
     * prop — `strokeThicknesses` replacing each stroke's `thicknesses` in turn — because a contour whose corners depend
     * on the size is the only thing that knows which entry goes with which corner.
     */
    computePoints: (size: Size2d) => Point2d[] | ShapeGeometry;
    /**
     * The paint for the stroke, which may build its own SVG definitions. It is handed the element's size and the
     * element itself, which is `undefined` until the shape has mounted.
     */
    computeStrokeDefs?: (size: Size2d, element: HTMLElement | undefined) => SVGDefs[];
    /**
     * The paint for the inside, which may build its own SVG definitions. It is handed the element's size and the
     * element itself, which is `undefined` until the shape has mounted.
     */
    computeFillDefs?: (size: Size2d, element: HTMLElement | undefined) => SVGDefs[];
};

export type ShapeSlots = {
    /** Draws whatever sits inside the shape, and is handed the clip path so it can cut itself to the contour. */
    renderChildren: (props: { size: Size2d; clipPath: string; clipPoints: Point2d[] }) => VNodeChild;
};
