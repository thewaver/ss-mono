/** What the library prints when a control's own `aria-label` is dropped in favor of the field's caption. */
const computeShadowedWarning = (propName: string) =>
    `FormField: ${propName} was given to a control inside a FormField that draws a caption, and is being ignored. The caption names the control, and an aria-label would leave the two disagreeing — drop one of them.`;

/** Connects a control to the field around it: the ids the control is named and described by. */
export namespace FormFieldUtils {
    /**
     * The id a control's `aria-labelledby` should point at: the caption of the `Label` around it, or else the caption of
     * the field it sits in.
     *
     * A caption names its control, which is what makes the words beside a field the field's name for a screen reader
     * ({@link https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html WCAG 4.1.2}). A `Label` wrapping the
     * control is the nearer caption, so inside one the field's caption names nothing. Pointing at the `Label`'s caption
     * rather than leaving the `<label>` element to name the control keeps the name to the caption's words: a `<label>`
     * names its control from all the text inside it, a button's name among it. A `Label` whose caption has not
     * registered an id is left to name the control natively.
     *
     * @param isLabeled Whether the control sits inside a `Label`.
     * @param labelCaptionId The id of the `Label`'s caption, or `undefined` while none is registered.
     * @param fieldCaptionId The id of the field's caption, or `undefined` outside a field or when it draws none.
     * @returns The id to put in `aria-labelledby`, or `undefined` when nothing should be written.
     */
    export const resolveAriaLabelledBy = (
        isLabeled: boolean,
        labelCaptionId: string | undefined,
        fieldCaptionId: string | undefined,
    ) => (isLabeled ? labelCaptionId : fieldCaptionId);

    /**
     * Warns, in the console, that a control's own `aria-label` is being dropped for the caption of the field it sits
     * in.
     *
     * Call it once per control, when it is set up. It says nothing unless the caption names the control — see
     * {@link resolveAriaLabelledBy} — and the control was given a label of its own, since that is the only case where
     * one of the two is being ignored.
     *
     * @param isCaptioned Whether the field's caption names the control.
     * @param hasAriaLabel Whether the caller gave the control an `aria-label`.
     * @param propName What the caller's framework calls the prop, so the warning names what they actually wrote.
     */
    export const warnIfShadowed = (isCaptioned: boolean, hasAriaLabel: boolean, propName: string) => {
        if (isCaptioned && hasAriaLabel) console.warn(computeShadowedWarning(propName));
    };

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
