import type { InteractionFlags, SVGDefs } from "@thewaver/ss-components-vue";
import type { Size2d } from "@thewaver/ss-utils";

import { computePaintDefs } from "../../PageComponents/PaintPicker/PaintPicker.const";
import type { PaintSettings } from "../../PageComponents/PaintPicker/PaintPicker.types";
import type { ShapeExampleProps } from "./ShapePage.types";

const computeSettings = (props: ShapeExampleProps, cellScale: number): PaintSettings => ({
    colors: props.colors,
    blurWidth: props.blurWidth,
    animationDurationMs: props.animationDurationMs,
    iterationConfigKey: props.iterationConfigKey,
    cellSize: { width: props.cellSize.width * cellScale, height: props.cellSize.height * cellScale },
});

export const computeShapeStrokeDefs = (
    id: string,
    props: ShapeExampleProps,
    size: Size2d,
    element: HTMLElement | undefined,
    flags?: InteractionFlags,
    cellScale = 1,
): SVGDefs[] =>
    computePaintDefs(
        props.strokePaint,
        computeSettings(props, cellScale),
        "stroke",
        `stroke-${id}`,
        size,
        element,
        flags,
    );

export const computeShapeFillDefs = (
    id: string,
    props: ShapeExampleProps,
    size: Size2d,
    element: HTMLElement | undefined,
    cellScale = 1,
): SVGDefs[] =>
    computePaintDefs(props.fillPaint, computeSettings(props, cellScale), "fill", `fill-${id}`, size, element);
