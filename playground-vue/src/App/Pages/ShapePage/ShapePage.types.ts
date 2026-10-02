import type { ShallowRef } from "vue";

import type { SVGDefsColors, SVGDefsSamples, ShapeProps } from "@thewaver/ss-components-vue";
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

export type ShapeGeometry = {
    hasIndividualCorners: ShallowRef<boolean>;
    shapeKind: ShallowRef<ShapeConst.DefaultShape>;
    joinRadii: ShallowRef<number[]>;
    lameExponents: ShallowRef<number[]>;
    geometryProps: Readonly<ShallowRef<ShapeExampleGeometry>>;
};

export type ShapeGeometryKnobsProps = {
    geometry: ShapeGeometry;
};
