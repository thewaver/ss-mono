/** What the library prints when a control's own `aria-label` is dropped in favor of its visible caption. */
const computeShadowedWarning = (propName: string) =>
    `Label: ${propName} was given inside a Label, and is being ignored. An aria-label overrides the visible caption as the accessible name, which leaves the two disagreeing — drop one of them.`;

/** Stops a control's own accessible name from overriding the visible caption it sits under. */
export namespace LabelUtils {
    /**
     * The `aria-label` a control should carry, given whether it sits inside a `Label`.
     *
     * An `aria-label` replaces the accessible name entirely, so a control inside a labeled field would be announced
     * by the label rather than by the caption the user can see — and the two then disagree, which is a failure of
     * WCAG 2.5.3 Label in Name. The caption wins.
     *
     * @param isLabeled Whether the control sits inside a `Label`.
     * @param ariaLabel The caller's own value, if any.
     * @returns The label to put on the control, or `undefined` when the visible caption should name it.
     */
    export const resolveAriaLabel = (isLabeled: boolean, ariaLabel: string | undefined) =>
        isLabeled ? undefined : ariaLabel;

    /**
     * Warns, in the console, that a control's own `aria-label` is being dropped for its visible caption.
     *
     * Call it once per control, when it is set up. It says nothing unless the control is inside a `Label` and was
     * given a label of its own, since that is the only case where one of the two is being ignored.
     *
     * @param isLabeled Whether the control sits inside a `Label`.
     * @param hasAriaLabel Whether the caller gave the control an `aria-label`.
     * @param propName What the caller's framework calls the prop, so the warning names what they actually wrote.
     */
    export const warnIfShadowed = (isLabeled: boolean, hasAriaLabel: boolean, propName: string) => {
        if (isLabeled && hasAriaLabel) console.warn(computeShadowedWarning(propName));
    };
}
