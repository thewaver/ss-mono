import { type RefObject, useLayoutEffect } from "react";

import { FormFieldUtils } from "@thewaver/ss-components";

import { useElement } from "../../../Utils/refUtils";
import { useFormFieldContext } from "./FormField.context";

/** The React side of `FormFieldUtils`: a control connected to the field around it. */
export namespace FormFieldReactUtils {
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
