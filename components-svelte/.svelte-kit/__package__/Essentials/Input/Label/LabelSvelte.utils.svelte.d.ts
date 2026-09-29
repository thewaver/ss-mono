/** The Svelte side of {@link LabelUtils}: a control's accessible name resolved against the Label it sits in. */
export declare namespace LabelSvelteUtils {
    /**
     * Drops the caller's `aria-label` when the control already has a visible caption.
     *
     * {@link LabelUtils.resolveAriaLabel} against the nearest `Label`, with an ignored value warned about whenever the
     * control comes to hold one, so the caller can drop one of the two.
     *
     * Must run while a component is being set up.
     *
     * @param getAriaLabel The caller's own value, if any.
     * @returns A getter giving the label to use, or `undefined` when the visible caption should name the control.
     */
    const resolveAriaLabel: (getAriaLabel: () => string | undefined) => () => string | undefined;
}
