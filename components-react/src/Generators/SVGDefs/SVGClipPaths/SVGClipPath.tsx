import type { ReactNode } from "react";

import { PaintAreaUtils } from "@thewaver/ss-components";

import { usePaintAreaContext } from "../SVGGradients/PaintArea.context";

export const SVGClipPath = (props: { id: string; children?: ReactNode }) => {
    const paintArea = usePaintAreaContext();

    const attributes = PaintAreaUtils.computeClipPathAttributes(paintArea?.paintArea);

    return (
        <clipPath id={props.id} clipPathUnits={attributes.clipPathUnits} transform={attributes.transform}>
            {props.children}
        </clipPath>
    );
};
