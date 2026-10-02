import type { Snippet } from "svelte";

import type { SVGDefsColors, SVGDefsSamples, ShapeProps } from "@thewaver/ss-components-svelte";
import type { ShapeConst, Size2d } from "@thewaver/ss-utils";

import type { Paint } from "../../PageComponents/PaintPicker/PaintPicker.types";

export type ShapeExampleProps = Pick<ShapeProps, "lameExponents" | "joinRadii"> & {
    shouldClipChildren?: boolean;
    shouldPadChildren?: boolean;
    blurWidth?: number;
    animationDurationMs: number;
    colors: SVGDefsColors;
    shapeKind: ShapeConst.DefaultShape;
    strokePaint: Paint;
    fillPaint: Paint;
    iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
    cellSize: Size2d;
    edgeThicknesses: number[];
};

export type ShapeExampleGeometry = Pick<ShapeExampleProps, "shapeKind" | "joinRadii" | "lameExponents">;

export type ShapeGeometryProps = {
    startingShapeKind?: ShapeConst.DefaultShape;
    children: Snippet<[geometryProps: ShapeExampleGeometry, renderKnobs: Snippet]>;
};
