/** Connects a control to the field around it: the ids the control is described by. */
export namespace FormFieldUtils {
    /**
     * Combines the caller's `aria-describedby` with the field's description.
     *
     * A field's help or error text describes the control, and so may something the caller points at. Both must be
     * announced, and `aria-describedby` takes a list, so neither has to be dropped — a control that simply
     * overwrote the attribute would silence the field's own error message. An empty string on either side counts
     * as nothing, so the attribute never carries a stray space.
     *
     * @param ariaDescribedBy The caller's own value, if any.
     * @param descriptionId The id of the field's message, or `undefined` outside a field or while it shows none.
     * @returns The ids to announce, the caller's first, space-separated, or `undefined` when there are none.
     */
    export const resolveAriaDescribedBy = (ariaDescribedBy: string | undefined, descriptionId: string | undefined) => {
        const ids = [ariaDescribedBy, descriptionId].filter(Boolean);

        return ids.length > 0 ? ids.join(" ") : undefined;
    };
}
