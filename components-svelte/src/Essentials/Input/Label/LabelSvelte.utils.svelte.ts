import { LabelUtils } from "@thewaver/ss-components";

import { getLabelContext } from "./Label.context.js";

/** The Svelte side of {@link LabelUtils}: a control's accessible name resolved against the Label it sits in. */
export namespace LabelSvelteUtils {
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
    export const resolveAriaLabel = (getAriaLabel: () => string | undefined) => {
        const labelContext = getLabelContext();

        $effect(() =>
            LabelUtils.warnIfShadowed(labelContext.getIsLabeled(), getAriaLabel() !== undefined, "ariaLabel"),
        );

        return () => LabelUtils.resolveAriaLabel(labelContext.getIsLabeled(), getAriaLabel());
    };

    /**
     * Tells the nearest `Label` which element its caption names, for a control whose real one is not the first thing
     * it draws.
     *
     * A label that only wraps names the first control inside it, so a control that draws buttons before its input —
     * `TagInput`'s remove buttons — would have its caption name a button, and a click on the caption press it. The
     * label points at the id given here instead, unless the consumer gave it a `for` of their own. Outside a `Label`
     * it does nothing, and the id is withdrawn when the control goes away.
     *
     * Must run while a component is being set up.
     *
     * @param getId The id of the element the caption should name.
     */
    export const registerControlId = (getId: () => string | undefined) => {
        const labelContext = getLabelContext();

        $effect(() => {
            labelContext.setControlId(getId());

            return () => labelContext.setControlId(undefined);
        });
    };
}
