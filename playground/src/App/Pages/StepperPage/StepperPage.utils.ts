import type { Step } from "@thewaver/ss-components";

import type { PageStepState } from "../../StyledComponents/StepContent/StepContent.types";
import { STATE_WORDS } from "./StepperPage.const";
import { LABELS, ORDER } from "./StepperSteps.const";
import type { StepValue } from "./StepperSteps.types";

const toStepId = (idPrefix: string, value: StepValue) => `${idPrefix}${value[0].toUpperCase()}${value.slice(1)}`;

const computeState = (value: StepValue, current: StepValue): PageStepState => {
    if (value === current) return "current";

    return ORDER.indexOf(value) < ORDER.indexOf(current) ? "done" : "ahead";
};

export namespace StepperPageUtils {
    export const buildSteps = (
        idPrefix: string,
        current: StepValue,
        isFreeNavigation: boolean,
        overrides: Partial<Record<StepValue, PageStepState>> = {},
    ): Step<StepValue, PageStepState>[] =>
        ORDER.map((value) => {
            const state = overrides[value] ?? computeState(value, current);

            return {
                value,
                state,
                id: toStepId(idPrefix, value),
                isNavigable: isFreeNavigation || state === "done" || state === "failed",
            };
        });

    export const describeStep = (step: Step<StepValue, PageStepState>, index: number) =>
        `Step ${index + 1} of ${ORDER.length}, ${LABELS[step.value]}, ${STATE_WORDS[step.state]}`;
}
