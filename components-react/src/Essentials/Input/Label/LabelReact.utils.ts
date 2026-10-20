import { useEffect, useLayoutEffect } from "react";

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

    /**
     * Tells the nearest `Label` which element its caption names, for a control whose real one is not the first thing
     * it draws.
     *
     * A label that only wraps names the first control inside it, so a control that draws buttons before its input —
     * `TagInput`'s remove buttons — would have its caption name a button, and a click on the caption press it. The
     * label points at the id given here instead, unless the consumer gave it a `for` of their own. Outside a
     * `Label` it does nothing, and the id is withdrawn when the control unmounts.
     *
     * @param id The id of the element the caption should name.
     */
    export const useControlId = (id: string | undefined) => {
        const { setControlId } = useLabelContext();

        useLayoutEffect(() => {
            setControlId(id);

            return () => setControlId(undefined);
        }, [setControlId, id]);
    };
}
