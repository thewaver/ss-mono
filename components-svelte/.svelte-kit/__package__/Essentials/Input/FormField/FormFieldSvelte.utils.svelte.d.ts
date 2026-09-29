/** The Svelte side of {@link FormFieldUtils}: a control connected to the field around it. */
export declare namespace FormFieldSvelteUtils {
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
    const resolveAriaDescribedBy: (getAriaDescribedBy?: () => string | undefined) => () => string | undefined;
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
    const registerControl: (getElement: () => HTMLElement | undefined) => void;
}
