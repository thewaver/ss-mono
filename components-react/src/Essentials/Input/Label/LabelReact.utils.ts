import { useEffect } from "react";

import { LabelUtils } from "@thewaver/ss-components";

import { useLabelContext } from "./Label.context";

/** The React side of `LabelUtils`: a control's accessible name resolved against the Label it sits in. */
export namespace LabelReactUtils {
    /**
     * Drops the caller's `aria-label` when the control already has a visible caption.
     *
     * `LabelUtils.resolveAriaLabel` against the nearest `Label`, with the ignored value warned about when the control
     * mounts so the caller can drop one of the two.
     *
     * @param ariaLabel The caller's own value, if any.
     * @returns The label to use, or `undefined` when the visible caption should name the control.
     */
    export const useAriaLabel = (ariaLabel: string | undefined) => {
        const isLabeled = useLabelContext().getIsLabeled();
        const hasAriaLabel = ariaLabel !== undefined;

        useEffect(() => LabelUtils.warnIfShadowed(isLabeled, hasAriaLabel, "ariaLabel"), [isLabeled, hasAriaLabel]);

        return LabelUtils.resolveAriaLabel(isLabeled, ariaLabel);
    };
}
