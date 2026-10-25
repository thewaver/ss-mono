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

    /**
     * Gives a caption inside a `Label` an id and tells the `Label` it is the caption, so the control is named by the
     * caption's words alone.
     *
     * A `<label>` names its control from all the text inside it, so a control drawing a named button of its own — a
     * date picker's calendar button — would be announced with the button's name folded in. Once a caption registers
     * here, the controls inside point `aria-labelledby` at it instead; the `<label>` element stays, so pressing the
     * caption still focuses the control. A caption that never registers leaves the `<label>` to name the control as a
     * native one does. Outside a `Label` it does nothing, and the caption is withdrawn when it goes away.
     *
     * Must run while a component is being set up.
     *
     * @param fallbackId The id used inside a `Label` when the caption has none of its own: pass one from
     * `$props.id()`, since only a component can generate an id that survives server rendering.
     * @param getId The caption's own id, if it has one. Left out, or answering `undefined`, `fallbackId` is used.
     * @returns A getter giving the id to put on the caption's element, or the caller's own id outside a `Label`.
     */
    export const registerCaptionId = (fallbackId: string, getId?: () => string | undefined) => {
        const labelContext = getLabelContext();

        const getCaptionId = () => (labelContext.getIsLabeled() ? (getId?.() ?? fallbackId) : getId?.());

        $effect.pre(() => {
            labelContext.setCaptionId(getCaptionId());

            return () => labelContext.setCaptionId(undefined);
        });

        return getCaptionId;
    };
}
