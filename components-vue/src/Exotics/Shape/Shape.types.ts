import type { VNodeChild } from "vue";

import type { ShapeStrokeGeom } from "@thewaver/ss-components";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefs.types";

export type ShapeProps = {
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
    /**
     * The paint for the outline, which may build its own SVG definitions. It is handed the element's size and the
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
    /** Draws whatever sits inside the shape, and is handed the clip path so it can cut itself to the outline. */
    renderChildren: (props: { size: Size2d; clipPath: string; clipPoints: Point2d[] }) => VNodeChild;
};
