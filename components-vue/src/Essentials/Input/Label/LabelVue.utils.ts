import { type MaybeRefOrGetter, computed, onUnmounted, toValue, watch } from "vue";

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

    /**
     * Tells the nearest `Label` which element its caption names, for a control whose real one is not the first thing
     * it draws.
     *
     * A label that only wraps names the first control inside it, so a control that draws buttons before its input —
     * `TagInput`'s remove buttons — would have its caption name a button, and a click on the caption press it. The
     * label points at the id given here instead, unless the consumer gave it a `for` of their own. Outside a `Label`
     * it does nothing, and the id is withdrawn when the control unmounts.
     *
     * Must run inside a component's `setup`.
     *
     * @param id The id of the element the caption should name.
     */
    export const useControlId = (id: MaybeRefOrGetter<string | undefined>) => {
        const labelContext = useLabelContext();

        watch(
            () => toValue(id),
            (next) => labelContext.setControlId(next),
            { immediate: true },
        );

        onUnmounted(() => labelContext.setControlId(undefined));
    };
}
