import { type InteractionFlags, access } from "@thewaver/ss-components-solid";
import type { SVGDefs } from "@thewaver/ss-components-solid";
import { computeNoSampleDefs } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { Size2d } from "@thewaver/ss-utils";

import { computePaintDefs } from "../../PageComponents/PaintPicker/PaintPicker.const";
import type { PaintSettings } from "../../PageComponents/PaintPicker/PaintPicker.types";
import type { ShapeExampleProps } from "./ShapePage.types";

const computeSettings = (props: ShapeExampleProps, cellScale: number): PaintSettings => {
    const cellSize = access(props.cellSize);

    return {
        colors: access(props.colors),
        blurWidth: access(props.blurWidth),
        animationDurationMs: access(props.animationDurationMs),
        iterationConfigKey: access(props.iterationConfigKey),
        cellSize: { width: cellSize.width * cellScale, height: cellSize.height * cellScale },
    };
};

export const computeShapeStrokeDefs = (
    id: string,
    props: ShapeExampleProps,
    getSize: () => Size2d,
    getRef: () => HTMLElement | undefined,
    getFlags?: () => InteractionFlags,
    cellScale = 1,
): SVGDefs[] =>
    computePaintDefs(
        access(props.strokePaint),
        computeSettings(props, cellScale),
        `stroke-${id}`,
        getSize,
        getRef,
        getFlags,
    ) ?? computeNoSampleDefs(access(props.colors), "stroke");

export const computeShapeFillDefs = (
    id: string,
    props: ShapeExampleProps,
    getSize: () => Size2d,
    getRef: () => HTMLElement | undefined,
    cellScale = 1,
): SVGDefs[] =>
    computePaintDefs(access(props.fillPaint), computeSettings(props, cellScale), `fill-${id}`, getSize, getRef) ??
    computeNoSampleDefs(access(props.colors), "fill");
