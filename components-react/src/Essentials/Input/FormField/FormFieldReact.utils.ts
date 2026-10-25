import { type RefObject, useEffect, useLayoutEffect } from "react";

import { FormFieldUtils } from "@thewaver/ss-components";

import { useElement } from "../../../Utils/refUtils";
import { useLabelContext } from "../Label/Label.context";
import { LabelReactUtils } from "../Label/LabelReact.utils";
import { useFormFieldContext } from "./FormField.context";

/** The React side of `FormFieldUtils`: a control connected to the field around it. */
export namespace FormFieldReactUtils {
    /**
     * The id of the caption that names the control, from the nearest `Label` or field.
     *
     * `FormFieldUtils.resolveAriaLabelledBy` against the nearest `Label` and `FormField`: the `Label`'s caption when the
     * control sits inside one, and the field's caption otherwise. A control of your own puts the answer in its
     * `aria-labelledby` and drops any `aria-label` while there is one, since the caption is then its name.
     *
     * @returns The caption's id, or `undefined` when there is no caption to point at, including inside a `Label` whose
     * caption registered no id.
     */
    export const useAriaLabelledBy = () => {
        const labelContext = useLabelContext();
        const fieldContext = useFormFieldContext();

        return FormFieldUtils.resolveAriaLabelledBy(
            labelContext.getIsLabeled(),
            labelContext.getCaptionId(),
            fieldContext.getCaptionId(),
        );
    };

    /**
     * The name a library control carries: its own `aria-label`, or the caption of the `Label` or field around it.
     *
     * Either caption names the control through `aria-labelledby` (see {@link useAriaLabelledBy}); either way the
     * caller's `aria-label` is dropped, since it would replace the caption the reader can see, and the dropped value is
     * warned about when the control mounts so the caller can remove one of the two.
     *
     * @param ariaLabel The caller's own value, if any.
     * @returns The `ariaLabel` and the `ariaLabelledBy` to write, either `undefined` when it should be left off.
     */
    export const useAriaName = (ariaLabel: string | undefined) => {
        const isLabeled = useLabelContext().getIsLabeled();
        const ownAriaLabel = LabelReactUtils.useAriaLabel(ariaLabel);
        const ariaLabelledBy = useAriaLabelledBy();
        const isCaptioned = !isLabeled && ariaLabelledBy !== undefined;
        const hasAriaLabel = ariaLabel !== undefined;

        useEffect(
            () => FormFieldUtils.warnIfShadowed(isCaptioned, hasAriaLabel, "ariaLabel"),
            [isCaptioned, hasAriaLabel],
        );

        return { ariaLabel: ariaLabelledBy === undefined ? ownAriaLabel : undefined, ariaLabelledBy };
    };

    /**
     * Combines the caller's `aria-describedby` with the description of the nearest field.
     *
     * `FormFieldUtils.resolveAriaDescribedBy` against the nearest `FormField`. The field re-renders its control when
     * its message comes or goes, so the ids follow it.
     *
     * @param ariaDescribedBy The caller's own value, if any.
     * @returns The ids to announce, space-separated, or `undefined` when there are none.
     */
    export const useAriaDescribedBy = (ariaDescribedBy?: string) =>
        FormFieldUtils.resolveAriaDescribedBy(ariaDescribedBy, useFormFieldContext().getDescriptionId());

    /**
     * Tells the surrounding field which element is its control, so the field can be focused from outside.
     *
     * A `Form` moves focus to the first field reporting an error when it is submitted, and a field knows its caption
     * and its message but not which element inside it takes focus. The control does, so it hands that element up.
     * Call it once in the control, beside {@link useAriaDescribedBy}. The element may arrive later and may change;
     * the field always holds the latest one, and lets go of it when the control unmounts. Outside a field it does
     * nothing.
     *
     * @param ref The element that should take focus for the field.
     */
    export const useRegisterControl = (ref: RefObject<HTMLElement | null>) => {
        const { registerControl, unregisterControl } = useFormFieldContext();
        const element = useElement(ref);

        useLayoutEffect(() => {
            if (!element) return;

            registerControl(element);

            return () => unregisterControl(element);
        }, [element, registerControl, unregisterControl]);
    };
}
