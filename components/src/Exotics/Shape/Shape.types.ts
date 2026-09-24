import type { JSX } from "solid-js";

import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefs.types";
import type { AccessorProps } from "../../Utils/typeUtils";

export type ShapeStrokeGeom = {
    thicknesses: number[];
    offset?: number;
};

export type ShapeProps = AccessorProps<{
    /** How far each corner is rounded. */
    joinRadii?: number[];
    /**
     * How square or how pinched each rounded corner is. Two is a circular round, higher is squarer, lower is pinched
     * inward.
     */
    lameExponents?: number[];
    /** How the outline is drawn along each edge. */
    strokeGeom?: ShapeStrokeGeom[];
    /** The corners of the outline, worked out from the element's size. */
    computePoints: (size: Size2d) => Point2d[];
    /** The paint for the outline, which may build its own SVG definitions. */
    computeStrokeDefs?: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
    /** The paint for the inside, which may build its own SVG definitions. */
    computeFillDefs?: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
    /** Draws whatever sits inside the shape, and is handed the clip path so it can cut itself to the outline. */
    renderChildren: (getSize: () => Size2d, getClipPath: () => string, getClipPoints: () => Point2d[]) => JSX.Element;
}>;
