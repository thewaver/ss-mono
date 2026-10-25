import { untrack } from "svelte";

import { FormFieldUtils } from "@thewaver/ss-components";

import { getLabelContext } from "../Label/Label.context.js";
import { LabelSvelteUtils } from "../Label/LabelSvelte.utils.svelte.js";
import { getFormFieldContext } from "./FormField.context.js";

/** The Svelte side of {@link FormFieldUtils}: a control connected to the field around it. */
export namespace FormFieldSvelteUtils {
    /**
     * The id of the caption that names the control, from the nearest `Label` or field.
     *
     * {@link FormFieldUtils.resolveAriaLabelledBy} against the nearest `Label` and `FormField`: the `Label`'s caption
     * when the control sits inside one, and the field's caption otherwise. A control of your own puts the answer in its
     * `aria-labelledby` and drops any `aria-label` while there is one, since the caption is then its name.
     *
     * Must run while a component is being set up.
     *
     * @returns A getter giving the caption's id, or `undefined` when there is no caption to point at, including inside
     * a `Label` whose caption registered no id.
     */
    export const resolveAriaLabelledBy = () => {
        const labelContext = getLabelContext();
        const fieldContext = getFormFieldContext();

        return () =>
            FormFieldUtils.resolveAriaLabelledBy(
                labelContext.getIsLabeled(),
                labelContext.getCaptionId(),
                fieldContext.getCaptionId(),
            );
    };

    /**
     * The name a library control carries: its own `aria-label`, or the caption of the `Label` or field around it.
     *
     * Either caption names the control through `aria-labelledby` (see {@link resolveAriaLabelledBy}); either way the
     * caller's `aria-label` is dropped, since it would replace the caption the reader can see, and the dropped value is
     * warned about once so the caller can remove one of the two.
     *
     * Must run while a component is being set up.
     *
     * @param getAriaLabel The caller's own value, if any.
     * @returns Getters giving the `aria-label` and the `aria-labelledby` to write, either `undefined` when it should be
     * left off.
     */
    export const resolveAriaName = (getAriaLabel: () => string | undefined) => {
        const labelContext = getLabelContext();
        const getOwnAriaLabel = LabelSvelteUtils.resolveAriaLabel(getAriaLabel);
        const getAriaLabelledBy = resolveAriaLabelledBy();

        $effect(() =>
            untrack(() =>
                FormFieldUtils.warnIfShadowed(
                    !labelContext.getIsLabeled() && getAriaLabelledBy() !== undefined,
                    getAriaLabel() !== undefined,
                    "ariaLabel",
                ),
            ),
        );

        return {
            getAriaLabel: () => (getAriaLabelledBy() === undefined ? getOwnAriaLabel() : undefined),
            getAriaLabelledBy,
        };
    };

    /**
     * Combines the caller's `aria-describedby` with the description of the nearest field.
     *
     * {@link FormFieldUtils.resolveAriaDescribedBy} against the nearest `FormField`, read afresh on every call so an
     * id that arrives later is picked up.
     *
     * Must run while a component is being set up.
     *
     * @param getAriaDescribedBy The caller's own value, if any.
     * @returns A getter giving the ids to announce, space-separated, or `undefined` when there are none.
     */
    export const resolveAriaDescribedBy = (getAriaDescribedBy?: () => string | undefined) => {
        const fieldContext = getFormFieldContext();

        return () => FormFieldUtils.resolveAriaDescribedBy(getAriaDescribedBy?.(), fieldContext.getDescriptionId());
    };

    /**
     * Tells the surrounding field which element is its control, so the field can be focused from outside.
     *
     * A `Form` moves focus to the first field reporting an error when it is submitted, and a field knows its caption
     * and its message but not which element inside it takes focus. The control does, so it hands that element up.
     * Call it once, while the control is being set up, beside {@link resolveAriaDescribedBy}. The element may arrive
     * later and may change; the field always holds the latest one, and lets go of it when the control is removed.
     * Outside a field it does nothing.
     *
     * Must run while a component is being set up.
     *
     * @param getElement The element that should take focus for the field, or `undefined` before it exists.
     */
    export const registerControl = (getElement: () => HTMLElement | undefined) => {
        const fieldContext = getFormFieldContext();

        $effect(() => {
            const element = getElement();

            if (!element) return;

            untrack(() => fieldContext.registerControl(element));

            return () => fieldContext.unregisterControl(element);
        });
    };
}
