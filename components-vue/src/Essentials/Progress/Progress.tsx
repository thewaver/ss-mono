import { type SlotsType, defineComponent } from "vue";

import { PROGRESS_DEFAULTS, ProgressStyles, ProgressUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { ProgressProps, ProgressSlots } from "./Progress.types";

export const Progress = defineComponent(
    (props: ProgressProps, { slots }: SlotsContext<ProgressSlots>) => {
        const getMin = () => props.min ?? PROGRESS_DEFAULTS.min;
        const getMax = () => props.max ?? PROGRESS_DEFAULTS.max;

        watchAfterRender([], () => ProgressUtils.warnIfEmptyRange(getMin(), getMax()));

        return () => {
            const sizing = props.sizing ?? PROGRESS_DEFAULTS.sizing;
            const min = getMin();
            const max = getMax();
            const role = props.role ?? PROGRESS_DEFAULTS.role;

            const state = ProgressUtils.computeState({
                value: props.value,
                min,
                max,
                role,
                hasError: props.hasError ?? false,
            });

            return (
                <div
                    id={props.id}
                    class={[ProgressStyles.progressRoot, ProgressStyles.progressSizingVariants[sizing]]}
                    role={role}
                    aria-label={props.ariaLabel}
                    aria-labelledby={props.ariaLabelledBy}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={state.value}
                    aria-valuetext={props.ariaValueText}
                    aria-invalid={state.hasError || undefined}
                >
                    {callSlot(slots.renderContent, state)}
                </div>
            );
        };
    },
    {
        name: "Progress",
        slots: Object as SlotsType<ProgressSlots>,
        props: declareProps<ProgressProps>({
            role: null,
            value: null,
            ariaLabel: null,
            ariaLabelledBy: null,
            id: null,
            ariaValueText: null,
            min: null,
            max: null,
            hasError: Boolean,
            sizing: null,
        }),
    },
);
