import { type MaybeRefOrGetter, computed, onUnmounted, toValue, useId, watch } from "vue";

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

    /**
     * Gives a caption inside a `Label` an id and tells the `Label` it is the caption, so the control is named by the
     * caption's words alone.
     *
     * A `<label>` names its control from all the text inside it, so a control drawing a named button of its own — a
     * date picker's calendar button — would be announced with the button's name folded in. Once a caption registers
     * here, the controls inside point `aria-labelledby` at it instead; the `<label>` element stays, so pressing the
     * caption still focuses the control. A caption that never registers leaves the `<label>` to name the control as a
     * native one does. Outside a `Label` it does nothing, and the caption is withdrawn when it unmounts.
     *
     * Must run inside a component's `setup`.
     *
     * @param id The caption's own id, if it has one. Left out, or reading `undefined`, an id is generated.
     * @returns A computed ref of the id to put on the caption's element, or the caller's own id outside a `Label`.
     */
    export const useCaptionId = (id?: MaybeRefOrGetter<string | undefined>) => {
        const labelContext = useLabelContext();
        const fallbackId = useId();

        const captionId = computed(() => (labelContext.getIsLabeled() ? (toValue(id) ?? fallbackId) : toValue(id)));

        watch(captionId, (next) => labelContext.setCaptionId(next), { immediate: true });

        onUnmounted(() => labelContext.setCaptionId(undefined));

        return captionId;
    };
}
