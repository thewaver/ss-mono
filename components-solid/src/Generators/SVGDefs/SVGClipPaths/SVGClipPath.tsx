import type { ParentProps } from "solid-js";

import { PaintAreaUtils } from "@thewaver/ss-components";

import { usePaintAreaContext } from "../SVGGradients/PaintArea.context";

export const SVGClipPath = (props: ParentProps<{ id: string }>) => {
    const paintArea = usePaintAreaContext();

    const getAttributes = () => PaintAreaUtils.computeClipPathAttributes(paintArea?.getPaintArea());

    return (
        <clipPath id={props.id} clipPathUnits={getAttributes().clipPathUnits} transform={getAttributes().transform}>
            {props.children}
        </clipPath>
    );
};
