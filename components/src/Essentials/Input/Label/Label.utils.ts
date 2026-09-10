import { useLabelContext } from "./Label.context";

/** Stops a control's own accessible name from overriding the visible caption it sits under. */
export namespace LabelUtils {
    /**
     * Drops the caller's `aria-label` when the control already has a visible caption.
     *
     * An `aria-label` replaces the accessible name entirely, so a control inside a labelled field would
     * be announced by the label rather than by the caption the user can see — and the two then disagree,
     * which is a failure of WCAG 2.5.3 Label in Name. The caption wins, and the ignored value is warned
     * about so the caller can drop one of the two.
     *
     * @param getAriaLabel The caller's own value, if any.
     * @returns An accessor giving the label to use, or `undefined` when the visible caption should name
     * the control.
     */
    export const resolveAriaLabel = (getAriaLabel?: () => string) => {
        const labelContext = useLabelContext();

        if (labelContext.getIsLabelled() && getAriaLabel) {
            console.warn(
                "Label: getAriaLabel was given inside a Label, and is being ignored. An aria-label overrides the visible caption as the accessible name, which leaves the two disagreeing — drop one of them.",
            );
        }

        return () => (labelContext.getIsLabelled() ? undefined : getAriaLabel?.());
    };
}
