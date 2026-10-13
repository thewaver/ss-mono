import type { ReactNode } from "react";

import type { BaseShapeProps } from "@thewaver/ss-components";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefs.types";

export type ShapeProps = BaseShapeProps & {
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
    /** Draws whatever sits inside the shape, and is handed the clip path so it can cut itself to the contour. */
    renderChildren: (size: Size2d, clipPath: string, clipPoints: Point2d[]) => ReactNode;
};
