<script setup lang="ts">
import { h } from "vue";

import { Stepper } from "@thewaver/ss-components-vue";
import type { InteractionTooltipDefs, Step, StepperFlags } from "@thewaver/ss-components-vue";
import { LABELS, ORDER, STEPPER_GAP } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.const";
import type { StepValue } from "@thewaver/ss-playground/App/Pages/StepperPage/StepperSteps.types";

import PageStepConnector from "../../../StyledComponents/StepContent/PageStepConnector.vue";
import PageStepContent from "../../../StyledComponents/StepContent/PageStepContent.vue";
import type { PageStepState } from "../../../StyledComponents/StepContent/StepContent.types";
import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.vue";
import type { StepperExampleProps } from "../StepperPage.types";

const FAILURE_REASON = "The card was declined, so this step has to be repeated before the order can be reviewed.";
const LOCKED_REASON = "Review opens once payment succeeds, so there is nothing to look at here yet.";

const REASONS = { failed: FAILURE_REASON, ahead: LOCKED_REASON };

type Props = StepperExampleProps;

const props = defineProps<Props>();

const computeTooltipDefs = (step: Step<StepValue, PageStepState>): InteractionTooltipDefs<StepperFlags> | undefined => {
    const reason = step.state === "failed" || step.state === "ahead" ? REASONS[step.state] : undefined;

    if (!reason) return undefined;

    return {
        placement: { x: "center", y: "top-out" },
        offset: { x: 0, y: 10 },
        hoverShowDelayMs: 0,
        renderContent: ({ visibilityTarget, transitionDurationMs }) =>
            h(PageTooltipContent, { visibilityTarget, transitionDurationMs }, () => reason),
    };
};
</script>

<template>
    <Stepper
        :steps="steps"
        :current-value="currentValue"
        :gap="STEPPER_GAP"
        ariaLabel="Checkout with a failure"
        :compute-step-aria-label="computeStepAriaLabel"
        :compute-tooltip-defs="computeTooltipDefs"
        @current-change="props.onCurrentChange"
    >
        <template #renderStep="{ step, flags }">
            <PageStepContent
                :flags="flags"
                :state="step.state"
                :ordinal="ORDER.indexOf(step.value) + 1"
                orientation="horizontal"
                >{{ LABELS[step.value as StepValue] }}</PageStepContent
            >
        </template>

        <template #renderConnector>
            <PageStepConnector orientation="horizontal" />
        </template>
    </Stepper>
</template>
