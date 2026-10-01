import { type SlotsType, defineComponent } from "vue";

import { STAIRCASE_DEFAULTS, StaircaseStyles, StaircaseUtils } from "@thewaver/ss-components";

import { callSlot, declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { StaircaseProps, StaircaseSlots } from "./Staircase.types";

export const Staircase = defineComponent(
    <T,>(props: StaircaseProps<T>, { slots }: SlotsContext<StaircaseSlots<T>>) =>
        () => {
            const dir = props.dir ?? STAIRCASE_DEFAULTS.dir;
            const gap = props.gap ?? STAIRCASE_DEFAULTS.gap;
            const stepCount = props.steps.length;

            return (
                <div class={StaircaseStyles.staircaseRoot} style={{ gap: `${gap}px` }}>
                    {props.steps.map((step, index) => {
                        const defs = StaircaseUtils.computeStepDefs(index, stepCount, dir, props.indent);
                        const stepIndent = StaircaseUtils.computeStepIndent(defs, props.computeStepIndent);

                        return (
                            <div
                                key={index}
                                class={StaircaseStyles.staircaseStep}
                                style={{ paddingLeft: `${stepIndent}px`, paddingRight: `${stepIndent}px` }}
                            >
                                {callSlot(slots.renderStep, { step, state: { ...defs, stepIndent } })}
                            </div>
                        );
                    })}
                </div>
            );
        },
    {
        name: "Staircase",
        slots: Object as SlotsType<StaircaseSlots<any>>,
        props: declareProps<StaircaseProps<unknown>>({
            indent: null,
            gap: null,
            dir: null,
            computeStepIndent: null,
            steps: null,
        }),
    },
);
