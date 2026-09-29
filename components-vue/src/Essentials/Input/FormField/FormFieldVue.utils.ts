import { type MaybeRefOrGetter, computed, toValue } from "vue";

import { FormFieldUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../../Utils/effectUtils";
import { useFormFieldContext } from "./FormField.context";

/** The Vue side of `FormFieldUtils`: a control connected to the field around it. */
export namespace FormFieldVueUtils {
    /**
     * Combines the caller's `aria-describedby` with the description of the nearest field.
     *
     * `FormFieldUtils.resolveAriaDescribedBy` against the nearest `FormField`, worked out again when the field's
     * message comes or goes.
     *
     * Must run inside a component's `setup`.
     *
     * @param ariaDescribedBy The caller's own value, if any.
     * @returns A computed ref of the ids to announce, space-separated, or `undefined` when there are none.
     */
    export const useAriaDescribedBy = (ariaDescribedBy?: MaybeRefOrGetter<string | undefined>) => {
        const formFieldContext = useFormFieldContext();

        return computed(() =>
            FormFieldUtils.resolveAriaDescribedBy(toValue(ariaDescribedBy), formFieldContext.getDescriptionId()),
        );
    };

    /**
     * Tells the surrounding field which element is its control, so the field can be focused from outside.
     *
     * A `Form` moves focus to the first field reporting an error when it is submitted, and a field knows its caption
     * and its message but not which element inside it takes focus. The control does, so it hands that element up.
     * Call it once in the control, beside {@link useAriaDescribedBy}. The element may arrive later and may change;
     * the field always holds the latest one, and lets go of it when the control unmounts. Outside a field it does
     * nothing.
     *
     * Must run inside a component's `setup`.
     *
     * @param ref The element that should take focus for the field.
     */
    export const useRegisterControl = (ref: MaybeRefOrGetter<HTMLElement | null | undefined>) => {
        const { registerControl, unregisterControl } = useFormFieldContext();

        watchAfterRender([() => toValue(ref)], ([element]) => {
            if (!element) return;

            registerControl(element);

            return () => unregisterControl(element);
        });
    };
}
