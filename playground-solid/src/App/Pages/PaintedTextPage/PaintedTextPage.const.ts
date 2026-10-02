import { type SVGDefs, access } from "@thewaver/ss-components-solid";
import type { Size2d } from "@thewaver/ss-utils";

import { computePaintDefs } from "../../PageComponents/PaintPicker/PaintPicker.const";
import type { PaintedTextExampleProps } from "./PaintedTextPage.types";

export const computeSampleDefs = (
    props: PaintedTextExampleProps,
    paintKind: "fill" | "stroke",
    id: string,
    getSize: () => Size2d,
    getRef: () => HTMLElement | undefined,
): SVGDefs[] =>
    computePaintDefs(
        access(paintKind === "fill" ? props.fillPaint : props.strokePaint),
        {
            colors: access(props.colors),
            blurWidth: access(props.blurWidth),
            animationDurationMs: access(props.animationDurationMs),
            iterationConfigKey: access(props.iterationConfigKey),
            cellSize: access(props.cellSize),
        },
        `${paintKind}-${id}`,
        getSize,
        getRef,
    ) ?? [];
