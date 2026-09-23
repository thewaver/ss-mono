import type { Accessor } from "solid-js";
import { createEffect, onCleanup } from "solid-js";

import { useFormFieldContext } from "./FormField.context";

/** Connects a control to the field around it: the field's description, and the element the field focuses. */
export namespace FormFieldUtils {
    /**
     * Combines the caller's `aria-describedby` with the field's description.
     *
     * A field's help or error text describes the control, and so may something the caller points at.
     * Both must be announced, and `aria-describedby` takes a list, so neither has to be dropped — a
     * control that simply overwrote the attribute would silence the field's own error message.
     *
     * @param getAriaDescribedBy The caller's own value, if any.
     * @returns An accessor giving the ids to announce, space-separated, or `undefined` when there are
     * none.
     */
    export const resolveAriaDescribedBy = (getAriaDescribedBy?: () => string) => {
        const fieldContext = useFormFieldContext();

        return () => {
            const ids = [getAriaDescribedBy?.(), fieldContext.getDescriptionId()].filter(Boolean);

            return ids.length > 0 ? ids.join(" ") : undefined;
        };
    };

    /**
     * Tells the surrounding field which element is its control, so the field can be focused from outside.
     *
     * A `Form` moves focus to the first field reporting an error when it is submitted, and a field knows
     * its caption and its message but not which element inside it takes focus. The control does, so it
     * hands that element up. Call it once, while the control is being set up, beside
     * {@link resolveAriaDescribedBy}. The element may arrive later and may change; the field always holds
     * the latest one, and lets go of it when the control is removed. Outside a field it does nothing.
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
