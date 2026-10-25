import { type MaybeRefOrGetter, computed, toValue } from "vue";

import { FormFieldUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../../Utils/effectUtils";
import { useLabelContext } from "../Label/Label.context";
import { LabelVueUtils } from "../Label/LabelVue.utils";
import { useFormFieldContext } from "./FormField.context";

/** The Vue side of `FormFieldUtils`: a control connected to the field around it. */
export namespace FormFieldVueUtils {
    /**
     * The id of the caption that names the control, from the nearest `Label` or field.
     *
     * `FormFieldUtils.resolveAriaLabelledBy` against the nearest `Label` and `FormField`: the `Label`'s caption when
     * the control sits inside one, and the field's caption otherwise. A control of your own puts the answer in its
     * `aria-labelledby` and drops any `aria-label` while there is one, since the caption is then its name.
     *
     * Must run inside a component's `setup`.
     *
     * @returns A computed ref of the caption's id, or `undefined` when there is no caption to point at, including
     * inside a `Label` whose caption registered no id.
     */
    export const useAriaLabelledBy = () => {
        const labelContext = useLabelContext();
        const fieldContext = useFormFieldContext();

        return computed(() =>
            FormFieldUtils.resolveAriaLabelledBy(
                labelContext.getIsLabeled(),
                labelContext.getCaptionId(),
                fieldContext.getCaptionId(),
            ),
        );
    };

    /**
     * The name a library control carries: its own `aria-label`, or the caption of the `Label` or field around it.
     *
     * Either caption names the control through `aria-labelledby` (see {@link useAriaLabelledBy}); either way the
     * caller's `aria-label` is dropped, since it would replace the caption the reader can see, and the dropped value is
     * warned about once so the caller can remove one of the two.
     *
     * Must run inside a component's `setup`.
     *
     * @param ariaLabel The caller's own value, if any.
     * @returns Computed refs of the `aria-label` and the `aria-labelledby` to write, either `undefined` when it should
     * be left off.
     */
    export const useAriaName = (ariaLabel: MaybeRefOrGetter<string | undefined>) => {
        const labelContext = useLabelContext();
        const ownAriaLabel = LabelVueUtils.useAriaLabel(ariaLabel);
        const ariaLabelledBy = useAriaLabelledBy();

        FormFieldUtils.warnIfShadowed(
            !labelContext.getIsLabeled() && ariaLabelledBy.value !== undefined,
            toValue(ariaLabel) !== undefined,
            "ariaLabel",
        );

        return {
            ariaLabel: computed(() => (ariaLabelledBy.value === undefined ? ownAriaLabel.value : undefined)),
            ariaLabelledBy,
        };
    };

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
