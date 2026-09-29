import { type MaybeRefOrGetter, computed, toValue } from "vue";

import { LabelUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../../Utils/effectUtils";
import { useLabelContext } from "./Label.context";

/** The Vue side of `LabelUtils`: a control's accessible name resolved against the Label it sits in. */
export namespace LabelVueUtils {
    /**
     * Drops the caller's `aria-label` when the control already has a visible caption.
     *
     * `LabelUtils.resolveAriaLabel` against the nearest `Label`, with the ignored value warned about once the control
     * has rendered, so the caller can drop one of the two.
     *
     * Must run inside a component's `setup`.
     *
     * @param ariaLabel The caller's own value, if any.
     * @returns A computed ref of the label to use, or `undefined` when the visible caption should name the control.
     */
    export const useAriaLabel = (ariaLabel: MaybeRefOrGetter<string | undefined>) => {
        const labelContext = useLabelContext();

        watchAfterRender(
            [() => labelContext.getIsLabeled(), () => toValue(ariaLabel) !== undefined],
            ([isLabeled, hasAriaLabel]) => LabelUtils.warnIfShadowed(isLabeled, hasAriaLabel, "ariaLabel"),
        );

        return computed(() => LabelUtils.resolveAriaLabel(labelContext.getIsLabeled(), toValue(ariaLabel)));
    };
}
