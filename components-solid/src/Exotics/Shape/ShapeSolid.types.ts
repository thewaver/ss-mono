import type { JSX } from "solid-js";

import type { BaseShapeCbs, BaseShapeValues } from "@thewaver/ss-components";
import type { Point2d, Size2d } from "@thewaver/ss-utils";

import type { SVGDefs } from "../../Generators/SVGDefs/SVGDefsSolid.types";
import type { AccessorValues } from "../../Utils/typeUtils";

export type ShapeProps = AccessorValues<BaseShapeValues> &
    BaseShapeCbs & {
        /** The paint for the stroke, which may build its own SVG definitions. */
        computeStrokeDefs?: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
        /** The paint for the inside, which may build its own SVG definitions. */
        computeFillDefs?: (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => SVGDefs[];
        /** Draws whatever sits inside the shape, and is handed the clip path so it can cut itself to the contour. */
        renderChildren: (
            getSize: () => Size2d,
            getClipPath: () => string,
            getClipPoints: () => Point2d[],
        ) => JSX.Element;
    };
