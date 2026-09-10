import { useFormFieldContext } from "./FormField.context";

/** Joins a control's own accessible description to the one its surrounding field provides. */
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
}
