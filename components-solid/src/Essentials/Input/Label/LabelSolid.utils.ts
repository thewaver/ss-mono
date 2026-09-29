import { LabelUtils } from "@thewaver/ss-components";

import { useLabelContext } from "./Label.context";

/** The Solid side of {@link LabelUtils}: a control's accessible name resolved against the Label it sits in. */
export namespace LabelSolidUtils {
    /**
     * Drops the caller's `aria-label` when the control already has a visible caption.
     *
     * {@link LabelUtils.resolveAriaLabel} against the nearest `Label`, with the ignored value warned about once so
     * the caller can drop one of the two.
     *
     * Must run inside a component.
     *
     * @param getAriaLabel The caller's own value, if any.
     * @returns An accessor giving the label to use, or `undefined` when the visible caption should name
     * the control.
     */
    export const resolveAriaLabel = (getAriaLabel?: () => string) => {
        const labelContext = useLabelContext();

        LabelUtils.warnIfShadowed(labelContext.getIsLabeled(), getAriaLabel !== undefined, "getAriaLabel");

        return () => LabelUtils.resolveAriaLabel(labelContext.getIsLabeled(), getAriaLabel?.());
    };
}
