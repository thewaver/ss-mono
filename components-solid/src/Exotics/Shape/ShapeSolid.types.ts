import type { JSX } from "solid-js";

import type { ShapeStrokeGeom } from "@thewaver/ss-components";
import type { Point2d, ShapeGeometry, Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefsSolid.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type ShapeProps = AccessorProps<{
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
    /** The paint for the stroke, which may build its own SVG definitions. */
    computeStrokeDefs?: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
    /** The paint for the inside, which may build its own SVG definitions. */
    computeFillDefs?: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
    /** Draws whatever sits inside the shape, and is handed the clip path so it can cut itself to the contour. */
    renderChildren: (getSize: () => Size2d, getClipPath: () => string, getClipPoints: () => Point2d[]) => JSX.Element;
}>;
