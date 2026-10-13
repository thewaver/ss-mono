import type { SVGDefs } from "@thewaver/ss-components-react";
import type { Size2d } from "@thewaver/ss-utils";

import { computePaintDefs } from "../../PageComponents/PaintPicker/PaintPickerReact.const";
import type { PaintedTextExampleProps } from "./PaintedTextPageReact.types";

export const computeSampleDefs = (
    props: PaintedTextExampleProps,
    paintKind: "fill" | "stroke",
    id: string,
    size: Size2d,
    element: HTMLElement | undefined,
): SVGDefs[] =>
    computePaintDefs(
        paintKind === "fill" ? props.fillPaint : props.strokePaint,
        {
            colors: props.colors,
            blurWidth: props.blurWidth,
            animationDurationMs: props.animationDurationMs,
            iterationConfigKey: props.iterationConfigKey,
            cellSize: props.cellSize,
        },
        paintKind,
        `${paintKind}-${id}`,
        size,
        element,
    );
