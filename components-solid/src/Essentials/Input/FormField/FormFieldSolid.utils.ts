import type { Accessor } from "solid-js";
import { createEffect, onCleanup } from "solid-js";

import { FormFieldUtils } from "@thewaver/ss-components";

import { useLabelContext } from "../Label/Label.context";
import { LabelSolidUtils } from "../Label/LabelSolid.utils";
import { useFormFieldContext } from "./FormField.context";

/** The Solid side of {@link FormFieldUtils}: a control connected to the field around it. */
export namespace FormFieldSolidUtils {
    /**
     * The id of the caption that names the control, from the nearest `Label` or field.
     *
     * {@link FormFieldUtils.resolveAriaLabelledBy} against the nearest `Label` and `FormField`: the `Label`'s caption
     * when the control sits inside one, and the field's caption otherwise. A control of your own puts the answer in its
     * `aria-labelledby` and drops any `aria-label` while there is one, since the caption is then its name.
     *
     * Must run inside a component.
     *
     * @returns An accessor giving the caption's id, or `undefined` when there is no caption to point at, including
     * inside a `Label` whose caption registered no id.
     */
    export const resolveAriaLabelledBy = () => {
        const labelContext = useLabelContext();
        const fieldContext = useFormFieldContext();

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
     * Must run inside a component.
     *
     * @param getAriaLabel The caller's own value, if any. Leave it out when the caller gave none, so nothing is warned
     * about.
     * @returns Accessors giving the `aria-label` and the `aria-labelledby` to write, either `undefined` when it should
     * be left off.
     */
    export const resolveAriaName = (getAriaLabel?: () => string) => {
        const labelContext = useLabelContext();
        const getOwnAriaLabel = LabelSolidUtils.resolveAriaLabel(getAriaLabel);
        const getAriaLabelledBy = resolveAriaLabelledBy();

        FormFieldUtils.warnIfShadowed(
            !labelContext.getIsLabeled() && getAriaLabelledBy() !== undefined,
            getAriaLabel !== undefined,
            "ariaLabel",
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
     * Must run inside a component.
     *
     * @param getAriaDescribedBy The caller's own value, if any.
     * @returns An accessor giving the ids to announce, space-separated, or `undefined` when there are none.
     */
    export const resolveAriaDescribedBy = (getAriaDescribedBy?: () => string) => {
        const fieldContext = useFormFieldContext();

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
     * Must run inside a component.
     *
     * @param getElement The element that should take focus for the field, or `undefined` before it exists.
     */
    export const registerControl = (getElement: Accessor<HTMLElement | undefined>) => {
        const fieldContext = useFormFieldContext();

        createEffect(() => {
            const element = getElement();

            if (!element) return;

            fieldContext.registerControl(element);

            onCleanup(() => fieldContext.unregisterControl(element));
        });
    };
}
